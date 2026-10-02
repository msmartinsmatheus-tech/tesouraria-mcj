import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, auditLogs, categories, entries, tags, statements, statementTransactions, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export const DEFAULT_CATEGORIES = [
  { name: "Contribuições", description: "Entradas de contribuições e mensalidades.", kind: "income" as const },
  { name: "Doações", description: "Doações recebidas pelo núcleo.", kind: "income" as const },
  { name: "Encontros e retiros", description: "Despesas relacionadas aos encontros e retiros.", kind: "expense" as const },
  { name: "Alimentação", description: "Compras e despesas de alimentação.", kind: "expense" as const },
  { name: "Comunicação", description: "Materiais gráficos, impressões e comunicação.", kind: "expense" as const },
  { name: "Outros", description: "Movimentações sem categoria específica.", kind: "both" as const },
];

export const DEFAULT_TAGS = [
  { name: "Mensalidade", description: "Contribuições recorrentes dos casais." },
  { name: "Doação", description: "Doações recebidas ou realizadas." },
  { name: "Encontro", description: "Movimentações de encontros e retiros." },
  { name: "Retiro", description: "Movimentações específicas de retiros." },
  { name: "Administrativo", description: "Despesas administrativas da tesouraria." },
];

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (['name', 'email', 'loginMethod'] as const).forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }
export async function listEntries() { const db = await getDb(); if (!db) return []; return db.select().from(entries).orderBy(desc(entries.occurredAt)); }
export async function listCategories() { const db = await getDb(); if (!db) return []; const current = await db.select().from(categories).orderBy(categories.name); if (current.length === 0) { await db.insert(categories).values(DEFAULT_CATEGORIES); return db.select().from(categories).orderBy(categories.name); } return current; }
export async function listTags() { const db = await getDb(); if (!db) return []; const current = await db.select().from(tags).orderBy(tags.name); if (current.length === 0) { await db.insert(tags).values(DEFAULT_TAGS); return db.select().from(tags).orderBy(tags.name); } return current; }
export async function listStatements() { const db = await getDb(); if (!db) return []; return db.select().from(statements).orderBy(desc(statements.importedAt)); }
export async function listStatementTransactions(statementId?: number) { const db = await getDb(); if (!db) return []; return statementId ? db.select().from(statementTransactions).where(eq(statementTransactions.statementId, statementId)).orderBy(desc(statementTransactions.occurredAt)) : db.select().from(statementTransactions).orderBy(desc(statementTransactions.occurredAt)); }
export async function createAuditLog(input: { actorId?: number; actorName?: string; action: string; entityType: string; entityId?: number; details?: string }) { const db = await getDb(); if (!db) return; await db.insert(auditLogs).values(input); }
