CREATE TABLE `bank_statement_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`statementId` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`occurredAt` timestamp NOT NULL,
	`description` varchar(255) NOT NULL,
	`matchedEntryId` int,
	`status` enum('pending','matched','divergence') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bank_statement_transactions_id` PRIMARY KEY(`id`)
);
