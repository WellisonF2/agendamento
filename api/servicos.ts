import { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { servicos } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

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
          // Buscar serviço específico
          const servico = await db
            .select()
            .from(servicos)
            .where(eq(servicos.id, Number(req.query.id)))
            .limit(1);
          
          if (servico.length === 0) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
          }
          
          return res.json(servico[0]);
        } else {
          // Listar todos os serviços
          const allServicos = await db.select().from(servicos);
          return res.json(allServicos);
        }

      case 'POST':
        const { nome, preco_cents, duracao_min } = req.body;
        
        if (!nome || !preco_cents || !duracao_min) {
          return res.status(400).json({ 
            error: 'Nome, preço e duração são obrigatórios' 
          });
        }

        const novoServico = await db
          .insert(servicos)
          .values({ nome, preco_cents, duracao_min })
          .returning();
        
        return res.status(201).json(novoServico[0]);

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }

        const { 
          nome: nomeUpdate, 
          preco_cents: precoUpdate, 
          duracao_min: duracaoUpdate 
        } = req.body;
        
        const servicoAtualizado = await db
          .update(servicos)
          .set({ 
            nome: nomeUpdate, 
            preco_cents: precoUpdate, 
            duracao_min: duracaoUpdate 
          })
          .where(eq(servicos.id, Number(req.query.id)))
          .returning();
        
        if (servicoAtualizado.length === 0) {
          return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        
        return res.json(servicoAtualizado[0]);

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }

        await db
          .delete(servicos)
          .where(eq(servicos.id, Number(req.query.id)));
        
        return res.status(204).end();

      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de serviços:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}