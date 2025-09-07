import { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { clientes } from '../src/lib/schema';
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
          // Buscar cliente específico
          const cliente = await db
            .select()
            .from(clientes)
            .where(eq(clientes.id, Number(req.query.id)))
            .limit(1);
          
          if (cliente.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
          }
          
          return res.json(cliente[0]);
        } else {
          // Listar todos os clientes
          const allClientes = await db.select().from(clientes);
          return res.json(allClientes);
        }

      case 'POST':
        const { nome, telefone, obs } = req.body;
        
        if (!nome) {
          return res.status(400).json({ error: 'Nome é obrigatório' });
        }

        const novoCliente = await db
          .insert(clientes)
          .values({ nome, telefone, obs })
          .returning();
        
        return res.status(201).json(novoCliente[0]);

      case 'PUT':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }

        const { nome: nomeUpdate, telefone: telefoneUpdate, obs: obsUpdate } = req.body;
        
        const clienteAtualizado = await db
          .update(clientes)
          .set({ nome: nomeUpdate, telefone: telefoneUpdate, obs: obsUpdate })
          .where(eq(clientes.id, Number(req.query.id)))
          .returning();
        
        if (clienteAtualizado.length === 0) {
          return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        
        return res.json(clienteAtualizado[0]);

      case 'DELETE':
        if (!req.query.id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }

        await db
          .delete(clientes)
          .where(eq(clientes.id, Number(req.query.id)));
        
        return res.status(204).end();

      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de clientes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}