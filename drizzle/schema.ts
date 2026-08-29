import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("finance_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  description: text("description"),
  kind: mysqlEnum("kind", ["income", "expense", "both"]).default("both").notNull(),
  isArchived: boolean("isArchived").default(false).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tags = mysqlTable("finance_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  description: text("description"),
  isArchived: boolean("isArchived").default(false).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const statements = mysqlTable("bank_statements", {
  id: int("id").autoincrement().primaryKey(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
  periodStart: timestamp("periodStart"),
  periodEnd: timestamp("periodEnd"),
  openingBalance: decimal("openingBalance", { precision: 14, scale: 2 }),
  closingBalance: decimal("closingBalance", { precision: 14, scale: 2 }),
  importedBy: int("importedBy"),
  importedAt: timestamp("importedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["processing", "pending", "reconciled", "error"]).default("processing").notNull(),
  movementCount: int("movementCount").default(0).notNull(),
  pendingCount: int("pendingCount").default(0).notNull(),
});

export const entries = mysqlTable("financial_entries", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  occurredAt: timestamp("occurredAt").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  notes: text("notes"),
  categoryId: int("categoryId"),
  statementId: int("statementId"),
  bankIdentifier: varchar("bankIdentifier", { length: 160 }),
  originalDescription: text("originalDescription"),
  originalType: varchar("originalType", { length: 40 }),
  status: mysqlEnum("status", ["pending", "classified", "divergence", "reconciled", "excluded"]).default("pending").notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const entryTags = mysqlTable("financial_entry_tags", {
  entryId: int("entryId").notNull(),
  tagId: int("tagId").notNull(),
});

export const attachments = mysqlTable("financial_attachments", {
  id: int("id").autoincrement().primaryKey(),
  entryId: int("entryId"),
  statementId: int("statementId"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes"),
  uploadedBy: int("uploadedBy"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export const auditLogs = mysqlTable("finance_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  actorId: int("actorId"),
  actorName: varchar("actorName", { length: 160 }),
  action: varchar("action", { length: 120 }).notNull(),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: int("entityId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type FinancialEntry = typeof entries.$inferSelect;
export type InsertFinancialEntry = typeof entries.$inferInsert;
