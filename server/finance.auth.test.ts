import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const baseContext = (user: TrpcContext["user"]): TrpcContext => ({
  user,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("finance authorization", () => {
  it("denies unauthenticated access to financial entries", async () => {
    const caller = appRouter.createCaller(baseContext(null));
    await expect(caller.finance.entries()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("denies unauthenticated access to all financial read procedures", async () => {
    const caller = appRouter.createCaller(baseContext(null));
    await expect(caller.finance.dashboard()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.finance.categories()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.finance.tags()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.finance.statements()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects invalid financial entry input", async () => {
    const caller = appRouter.createCaller(baseContext({ id: 1, openId: "auth-user", email: "auth@example.com", name: "Authorized User", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }));
    await expect(caller.finance.createEntry({ type: "income", amount: 0, occurredAt: new Date(), description: "x", tagIds: [], status: "classified" })).rejects.toBeDefined();
  });

  it("allows authenticated access to financial entries", async () => {
    const caller = appRouter.createCaller(baseContext({
      id: 1,
      openId: "auth-user",
      email: "auth@example.com",
      name: "Authorized User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.finance.entries()).resolves.toBeDefined();
  });
});
