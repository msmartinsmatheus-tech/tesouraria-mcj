import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createAuditLog, getDb, listCategories, listEntries, listStatements, listTags } from "./db";
import { categories, entries, entryTags, tags } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  finance: router({
    dashboard: protectedProcedure.query(async () => listEntries()),
    entries: protectedProcedure.query(async () => listEntries()),
    categories: protectedProcedure.query(async () => listCategories()),
    tags: protectedProcedure.query(async () => listTags()),
    statements: protectedProcedure.query(async () => listStatements()),
    createEntry: protectedProcedure.input(z.object({ type: z.enum(["income", "expense"]), amount: z.number().positive(), occurredAt: z.coerce.date(), description: z.string().min(2), notes: z.string().optional(), categoryId: z.number().optional(), tagIds: z.array(z.number()).default([]), status: z.enum(["pending", "classified", "divergence", "reconciled"]).default("classified") })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível"); const inserted = await db.insert(entries).values({ type: input.type, amount: input.amount.toFixed(2), occurredAt: input.occurredAt, description: input.description, notes: input.notes, categoryId: input.categoryId, status: input.status, createdBy: ctx.user.id, updatedBy: ctx.user.id, originalDescription: input.description, originalType: input.type }).$returningId(); const id = inserted[0]?.id; if (id && input.tagIds.length) await db.insert(entryTags).values(input.tagIds.map(tagId => ({ entryId: id, tagId }))); await createAuditLog({ actorId: ctx.user.id, actorName: ctx.user.name ?? undefined, action: "create", entityType: "financial_entry", entityId: id, details: JSON.stringify(input) }); return { id }; }),
    createCategory: protectedProcedure.input(z.object({ name: z.string().min(2), description: z.string().optional(), kind: z.enum(["income", "expense", "both"]).default("both") })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível"); const inserted = await db.insert(categories).values({ ...input, createdBy: ctx.user.id }).$returningId(); await createAuditLog({ actorId: ctx.user.id, actorName: ctx.user.name ?? undefined, action: "create", entityType: "category", entityId: inserted[0]?.id, details: input.name }); return inserted[0]; }),
    createTag: protectedProcedure.input(z.object({ name: z.string().min(2), description: z.string().optional() })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível"); const inserted = await db.insert(tags).values({ ...input, createdBy: ctx.user.id }).$returningId(); await createAuditLog({ actorId: ctx.user.id, actorName: ctx.user.name ?? undefined, action: "create", entityType: "tag", entityId: inserted[0]?.id, details: input.name }); return inserted[0]; }),
    audit: adminProcedure.query(async () => { const db = await getDb(); if (!db) return []; const { auditLogs } = await import("../drizzle/schema"); return db.select().from(auditLogs); }),
  }),
});

export type AppRouter = typeof appRouter;
