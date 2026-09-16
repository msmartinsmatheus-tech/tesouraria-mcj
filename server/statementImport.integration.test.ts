import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getDb: vi.fn(), createAuditLog: vi.fn(), storagePut: vi.fn(), storageGetSignedUrl: vi.fn(), extractStatementLines: vi.fn() }));
vi.mock("./db", () => ({ getDb: mocks.getDb, createAuditLog: mocks.createAuditLog, listEntries: vi.fn(), listCategories: vi.fn(), listStatements: vi.fn(), listStatementTransactions: vi.fn(), listTags: vi.fn() }));
vi.mock("./storage", () => ({ storagePut: mocks.storagePut, storageGetSignedUrl: mocks.storageGetSignedUrl }));
vi.mock("./statementParser", () => ({ extractStatementLines: mocks.extractStatementLines }));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = { user: { id: 7, openId: "integration-user", name: "Integration User", email: "integration@example.com", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} }, res: {} as TrpcContext["res"] } as TrpcContext;

function fakeDb() {
  const inserts: unknown[] = [];
  const updates: unknown[] = [];
  const db = {
    insert: vi.fn(() => ({ values: vi.fn((values: unknown) => { inserts.push(values); return { $returningId: vi.fn(async () => [{ id: 101 }]) }; }) })),
    update: vi.fn(() => ({ set: vi.fn((values: unknown) => { updates.push(values); return { where: vi.fn(async () => undefined) }; }) })),
    delete: vi.fn(() => ({ where: vi.fn(async () => undefined) })),
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn(async () => [{ id: 101, fileKey: "statements/101.pdf" }]) })) })) })),
  };
  return { db, inserts, updates };
}

describe("statement import integration", () => {
  it("creates extracted transactions, review items and four counters", async () => {
    const { db, inserts, updates } = fakeDb(); mocks.getDb.mockResolvedValue(db); mocks.storagePut.mockResolvedValue({ key: "statements/101.pdf", url: "/manus-storage/statements/101.pdf" }); mocks.extractStatementLines.mockResolvedValue({ lines: [{ type: "income", amount: 120, occurredAt: new Date("2026-07-01"), description: "PIX" }], unrecognizedLines: 1, reviewLines: ["linha sem valor"] });
    const result = await appRouter.createCaller(context).finance.createStatement({ fileName: "extrato.pdf", base64Data: Buffer.from("pdf").toString("base64"), mimeType: "application/pdf" });
    expect(result).toMatchObject({ id: 101, extractedLines: 1, unrecognizedLines: 1 });
    expect(inserts.some(value => Array.isArray(value) && value[0]?.description === "PIX")).toBe(true);
    expect(inserts.some(value => Array.isArray(value) && value[0]?.rawText === "linha sem valor")).toBe(true);
    expect(updates).toContainEqual(expect.objectContaining({ movementCount: 1, pendingCount: 1, extractedLines: 1, unrecognizedLines: 1 }));
  });

  it("reprocesses from signed storage URL and recreates rows and reviews", async () => {
    const { db, inserts, updates } = fakeDb(); mocks.getDb.mockResolvedValue(db); mocks.storageGetSignedUrl.mockResolvedValue("https://signed.example/statement.pdf"); mocks.extractStatementLines.mockResolvedValue({ lines: [], unrecognizedLines: 1, reviewLines: ["linha pendente"] }); vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, arrayBuffer: async () => Buffer.from("pdf") })));
    const result = await appRouter.createCaller(context).finance.reprocessStatement({ statementId: 101 });
    expect(result).toEqual({ extractedLines: 0, unrecognizedLines: 1 }); expect(mocks.storageGetSignedUrl).toHaveBeenCalledWith("statements/101.pdf"); expect(inserts.some(value => Array.isArray(value) && value[0]?.rawText === "linha pendente")).toBe(true); expect(updates).toContainEqual(expect.objectContaining({ movementCount: 0, pendingCount: 0, extractedLines: 0, unrecognizedLines: 1 }));
  });
});
