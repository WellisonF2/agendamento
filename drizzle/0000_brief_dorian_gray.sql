CREATE TABLE `agendamento_servicos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agendamento_id` integer NOT NULL,
	`servico_id` integer NOT NULL,
	`qtd` integer DEFAULT 1 NOT NULL,
	`preco_unit_cents` integer NOT NULL,
	`duracao_min` integer NOT NULL,
	FOREIGN KEY (`agendamento_id`) REFERENCES `agendamentos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`servico_id`) REFERENCES `servicos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agendamentos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cliente_id` integer NOT NULL,
	`data_iso` text NOT NULL,
	`hora` text NOT NULL,
	`total_cents` integer NOT NULL,
	`pagamento` text NOT NULL,
	`obs` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `data_iso_idx` ON `agendamentos` (`data_iso`);--> statement-breakpoint
CREATE INDEX `cliente_id_idx` ON `agendamentos` (`cliente_id`);--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`telefone` text,
	`obs` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `servicos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`preco_cents` integer NOT NULL,
	`duracao_min` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
