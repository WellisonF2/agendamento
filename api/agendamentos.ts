import { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { agendamentos, agendamentoServicos, clientes, servicos } from '../src/lib/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          // Buscar agendamento específico com detalhes
          const agendamento = await db
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
              created_at: agendamentos.created_at,
            })
            .from(agendamentos)
            .leftJoin(clientes, eq(agendamentos.cliente_id, clientes.id))
            .where(eq(agendamentos.id, Number(req.query.id)))
            .limit(1);
          
          if (agendamento.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
          }

          // Buscar serviços do agendamento
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
            .where(eq(agendamentoServicos.agendamento_id, Number(req.query.id)));
          
          return res.json({
            ...agendamento[0],
            servicos: servicosAgendamento,
          });
        } else {
          // Listar agendamentos com filtros opcionais
          const { data_inicio, data_fim, cliente_id } = req.query;
          
          let query = db
            .select({
              id: agendamentos.id,
              cliente_id: agendamentos.cliente_id,
              cliente_nome: clientes.nome,
              data_iso: agendamentos.data_iso,
              hora: agendamentos.hora,
              total_cents: agendamentos.total_cents,
              pagamento: agendamentos.pagamento,
              obs: agendamentos.obs,
              created_at: agendamentos.created_at,
            })
            .from(agendamentos)
            .leftJoin(clientes, eq(agendamentos.cliente_id, clientes.id));

          // Aplicar filtros
          const conditions = [];
          if (data_inicio) {
            conditions.push(gte(agendamentos.data_iso, String(data_inicio)));
          }
          if (data_fim) {
            conditions.push(lte(agendamentos.data_iso, String(data_fim)));
          }
          if (cliente_id) {
            conditions.push(eq(agendamentos.cliente_id, Number(cliente_id)));
          }

          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }

          const allAgendamentos = await query;
          return res.json(allAgendamentos);
        }

      case 'POST':
        const { cliente_id, data_iso, hora, pagamento, obs, servicos: servicosData } = req.body;
        
        if (!cliente_id || !data_iso || !hora || !pagamento || !servicosData?.length) {
          return res.status(400).json({ 
            error: 'Cliente, data, hora, pagamento e serviços são obrigatórios' 
          });
        }

        // Calcular total
        let total_cents = 0;
        for (const servico of servicosData) {
          total_cents += servico.preco_unit_cents * servico.qtd;
        }

        // Criar agendamento
        const novoAgendamento = await db
          .insert(agendamentos)
          .values({ cliente_id, data_iso, hora, total_cents, pagamento, obs })
          .returning();
        
        const agendamentoId = novoAgendamento[0].id;

        // Inserir serviços do agendamento
        for (const servico of servicosData) {
          await db.insert(agendamentoServicos).values({
            agendamento_id: agendamentoId,
            servico_id: servico.servico_id,
            qtd: servico.qtd,
            preco_unit_cents: servico.preco_unit_cents,
            duracao_min: servico.duracao_min,
          });
        }
        
        return res.status(201).json(novoAgendamento[0]);

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }

        const { 
          cliente_id: clienteUpdate,
          data_iso: dataUpdate,
          hora: horaUpdate,
          pagamento: pagamentoUpdate,
          obs: obsUpdate,
          servicos: servicosUpdate
        } = req.body;
        
        // Calcular novo total se serviços foram fornecidos
        let novoTotal = 0;
        if (servicosUpdate?.length) {
          for (const servico of servicosUpdate) {
            novoTotal += servico.preco_unit_cents * servico.qtd;
          }
        }

        const agendamentoAtualizado = await db
          .update(agendamentos)
          .set({ 
            cliente_id: clienteUpdate,
            data_iso: dataUpdate,
            hora: horaUpdate,
            total_cents: novoTotal || undefined,
            pagamento: pagamentoUpdate,
            obs: obsUpdate
          })
          .where(eq(agendamentos.id, Number(req.query.id)))
          .returning();
        
        if (agendamentoAtualizado.length === 0) {
          return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        // Atualizar serviços se fornecidos
        if (servicosUpdate?.length) {
          // Remover serviços existentes
          await db
            .delete(agendamentoServicos)
            .where(eq(agendamentoServicos.agendamento_id, Number(req.query.id)));

          // Inserir novos serviços
          for (const servico of servicosUpdate) {
            await db.insert(agendamentoServicos).values({
              agendamento_id: Number(req.query.id),
              servico_id: servico.servico_id,
              qtd: servico.qtd,
              preco_unit_cents: servico.preco_unit_cents,
              duracao_min: servico.duracao_min,
            });
          }
        }
        
        return res.json(agendamentoAtualizado[0]);

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }

        // Remover serviços do agendamento primeiro (cascade)
        await db
          .delete(agendamentoServicos)
          .where(eq(agendamentoServicos.agendamento_id, Number(req.query.id)));

        // Remover agendamento
        await db
          .delete(agendamentos)
          .where(eq(agendamentos.id, Number(req.query.id)));
        
        return res.status(204).end();

      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de agendamentos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}