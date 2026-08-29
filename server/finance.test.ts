import { describe, expect, it } from "vitest";
import { calculateCurrentBalance, formatBRL } from "../shared/finance";

describe("finance rules", () => {
  it("calculates balance from initial value, income and expense", () => {
    expect(calculateCurrentBalance(1000, [
      { type: "income", amount: 250 },
      { type: "expense", amount: 80 },
    ])).toBe(1170);
  });

  it("does not include excluded movements", () => {
    expect(calculateCurrentBalance(1000, [
      { type: "expense", amount: 200, status: "excluded" },
      { type: "income", amount: 75 },
    ])).toBe(1075);
  });

  it("formats values using Brazilian currency", () => {
    expect(formatBRL(18642.9)).toContain("18.642,90");
    expect(formatBRL(18642.9)).toContain("R$");
  });
});
