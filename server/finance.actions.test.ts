import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const unauthenticatedContext = {
  user: undefined,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} satisfies TrpcContext;

describe("finance actions authorization", () => {
  it("requires authentication to reconcile an entry", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext);
    await expect(caller.finance.reconcileEntry({ id: 1, status: "reconciled" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires authentication to delete an entry", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext);
    await expect(caller.finance.deleteEntry({ id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires authentication to list statement transactions", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext);
    await expect(caller.finance.statementTransactions({ statementId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires authentication to match a statement transaction", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext);
    await expect(caller.finance.matchStatementTransaction({ transactionId: 1, entryId: 1, status: "matched" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
