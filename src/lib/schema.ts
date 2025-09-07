import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

export const clientes = sqliteTable('clientes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  telefone: text('telefone'),
  obs: text('obs'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const servicos = sqliteTable('servicos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  precoCents: integer('preco_cents').notNull(),
  duracaoMin: integer('duracao_min').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const agendamentos = sqliteTable('agendamentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clienteId: integer('cliente_id').notNull().references(() => clientes.id),
  dataIso: text('data_iso').notNull(), // YYYY-MM-DD
  hora: text('hora').notNull(), // HH:MM
  totalCents: integer('total_cents').notNull(),
  pagamento: text('pagamento').notNull(), // 'PIX' | 'Dinheiro' | 'Cartão'
  obs: text('obs'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  dataIsoIdx: index('data_iso_idx').on(table.dataIso),
  clienteIdIdx: index('cliente_id_idx').on(table.clienteId),
}));

export const agendamentoServicos = sqliteTable('agendamento_servicos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agendamentoId: integer('agendamento_id').notNull().references(() => agendamentos.id, { onDelete: 'cascade' }),
  servicoId: integer('servico_id').notNull().references(() => servicos.id),
  qtd: integer('qtd').notNull().default(1),
  precoUnitCents: integer('preco_unit_cents').notNull(),
  duracaoMin: integer('duracao_min').notNull(),
});

// Types
export type Cliente = typeof clientes.$inferSelect;
export type NovoCliente = typeof clientes.$inferInsert;

export type Servico = typeof servicos.$inferSelect;
export type NovoServico = typeof servicos.$inferInsert;

export type Agendamento = typeof agendamentos.$inferSelect;
export type NovoAgendamento = typeof agendamentos.$inferInsert;

export type AgendamentoServico = typeof agendamentoServicos.$inferSelect;
export type NovoAgendamentoServico = typeof agendamentoServicos.$inferInsert;