CREATE TABLE `financial_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entryId` int,
	`statementId` int,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(1024) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`sizeBytes` int,
	`uploadedBy` int,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `financial_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `finance_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorId` int,
	`actorName` varchar(160),
	`action` varchar(120) NOT NULL,
	`entityType` varchar(80) NOT NULL,
	`entityId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `finance_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `finance_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text,
	`kind` enum('income','expense','both') NOT NULL DEFAULT 'both',
	`isArchived` boolean NOT NULL DEFAULT false,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `finance_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `finance_categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `financial_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`occurredAt` timestamp NOT NULL,
	`description` varchar(255) NOT NULL,
	`notes` text,
	`categoryId` int,
	`statementId` int,
	`bankIdentifier` varchar(160),
	`originalDescription` text,
	`originalType` varchar(40),
	`status` enum('pending','classified','divergence','reconciled','excluded') NOT NULL DEFAULT 'pending',
	`createdBy` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_entry_tags` (
	`entryId` int NOT NULL,
	`tagId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bank_statements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(1024) NOT NULL,
	`periodStart` timestamp,
	`periodEnd` timestamp,
	`openingBalance` decimal(14,2),
	`closingBalance` decimal(14,2),
	`importedBy` int,
	`importedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('processing','pending','reconciled','error') NOT NULL DEFAULT 'processing',
	`movementCount` int NOT NULL DEFAULT 0,
	`pendingCount` int NOT NULL DEFAULT 0,
	CONSTRAINT `bank_statements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `finance_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text,
	`isArchived` boolean NOT NULL DEFAULT false,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `finance_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `finance_tags_name_unique` UNIQUE(`name`)
);
