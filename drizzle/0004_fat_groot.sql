CREATE TABLE `bank_statement_review_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`statementId` int NOT NULL,
	`rawText` text NOT NULL,
	`status` enum('pending','resolved') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bank_statement_review_items_id` PRIMARY KEY(`id`)
);
