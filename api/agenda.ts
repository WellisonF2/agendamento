import { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { agendamentos, clientes, agendamentoServicos, servicos } from '../src/lib/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import dayjs from 'dayjs';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { data, mes, ano } = req.query;

    if (data) {
      // Buscar agendamentos de uma data específica
      const agendamentosData = await db
        .select({
          id: agendamentos.id,
          cliente_id: agendamentos.cliente_id,
          cliente_nome: clientes.nome,
          cliente_telefone: clientes.telefone,
          data_iso: agendamentos.data_iso,
          hora: agendamentos.hora,
          total_cents: agendamentos.total_cents,
          pagamento: agendamentos.pagamento,
          obs: agendamentos.obs,
        })
        .from(agendamentos)
        .leftJoin(clientes, eq(agendamentos.cliente_id, clientes.id))
        .where(eq(agendamentos.data_iso, String(data)))
        .orderBy(agendamentos.hora);

      // Buscar serviços para cada agendamento
      const agendamentosComServicos = await Promise.all(
        agendamentosData.map(async (agendamento) => {
          const servicosAgendamento = await db
            .select({
              id: agendamentoServicos.id,
              servico_id: agendamentoServicos.servico_id,
              servico_nome: servicos.nome,
              qtd: agendamentoServicos.qtd,
              preco_unit_cents: agendamentoServicos.preco_unit_cents,
              duracao_min: agendamentoServicos.duracao_min,
            })
            .from(agendamentoServicos)
            .leftJoin(servicos, eq(agendamentoServicos.servico_id, servicos.id))
            .where(eq(agendamentoServicos.agendamento_id, agendamento.id));

          return {
            ...agendamento,
            servicos: servicosAgendamento,
          };
        })
      );

      return res.json(agendamentosComServicos);
    } else if (mes && ano) {
      // Buscar resumo do mês
      const inicioMes = dayjs(`${ano}-${String(mes).padStart(2, '0')}-01`).format('YYYY-MM-DD');
      const fimMes = dayjs(inicioMes).endOf('month').format('YYYY-MM-DD');

      const agendamentosMes = await db
        .select({
          id: agendamentos.id,
          data_iso: agendamentos.data_iso,
          hora: agendamentos.hora,
          total_cents: agendamentos.total_cents,
          cliente_nome: clientes.nome,
        })
        .from(agendamentos)
        .leftJoin(clientes, eq(agendamentos.cliente_id, clientes.id))
        .where(
          and(
            gte(agendamentos.data_iso, inicioMes),
            lte(agendamentos.data_iso, fimMes)
          )
        )
        .orderBy(agendamentos.data_iso, agendamentos.hora);

      // Agrupar por data
      const agendamentosPorData = agendamentosMes.reduce((acc, agendamento) => {
        const data = agendamento.data_iso;
        if (!acc[data]) {
          acc[data] = [];
        }
        acc[data].push(agendamento);
        return acc;
      }, {} as Record<string, typeof agendamentosMes>);

      // Calcular estatísticas do mês
      const totalFaturamento = agendamentosMes.reduce(
        (sum, agendamento) => sum + agendamento.total_cents,
        0
      );
      const totalAgendamentos = agendamentosMes.length;
      const diasComAgendamento = Object.keys(agendamentosPorData).length;

      return res.json({
        agendamentos: agendamentosPorData,
        estatisticas: {
          total_faturamento_cents: totalFaturamento,
          total_agendamentos: totalAgendamentos,
          dias_com_agendamento: diasComAgendamento,
          ticket_medio_cents: totalAgendamentos > 0 ? Math.round(totalFaturamento / totalAgendamentos) : 0,
        },
      });
    } else {
      // Buscar próximos agendamentos (hoje e próximos 7 dias)
      const hoje = dayjs().format('YYYY-MM-DD');
      const proximaSemana = dayjs().add(7, 'days').format('YYYY-MM-DD');

      const proximosAgendamentos = await db
        .select({
          id: agendamentos.id,
          cliente_id: agendamentos.cliente_id,
          cliente_nome: clientes.nome,
          cliente_telefone: clientes.telefone,
          data_iso: agendamentos.data_iso,
          hora: agendamentos.hora,
          total_cents: agendamentos.total_cents,
          pagamento: agendamentos.pagamento,
        })
        .from(agendamentos)
        .leftJoin(clientes, eq(agendamentos.cliente_id, clientes.id))
        .where(
          and(
            gte(agendamentos.data_iso, hoje),
            lte(agendamentos.data_iso, proximaSemana)
          )
        )
        .orderBy(agendamentos.data_iso, agendamentos.hora)
        .limit(20);

      return res.json(proximosAgendamentos);
    }
  } catch (error) {
    console.error('Erro na API de agenda:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}