ALTER TABLE `bank_statements` ADD `extractedLines` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `bank_statements` ADD `unrecognizedLines` int DEFAULT 0 NOT NULL;