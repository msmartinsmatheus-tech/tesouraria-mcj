import { beforeEach, describe, expect, it, vi } from "vitest";

const getText = vi.fn();
const destroy = vi.fn();

vi.mock("pdf-parse", () => ({
  PDFParse: class {
    getText = getText;
    destroy = destroy;
    constructor(_options: { data: Buffer }) {}
  },
}));

describe("extractStatementLines", () => {
  beforeEach(() => {
    getText.mockReset();
    destroy.mockReset();
  });

  it("extracts Brazilian date, amount and debit/credit type", async () => {
    getText.mockResolvedValue({ text: "01/07/2026 PIX RECEBIDO 1.250,00\n02/07/2026 D MERCADO 85,90" });
    const { extractStatementLines } = await import("./statementParser");
    const result = await extractStatementLines(Buffer.from("pdf"));
    expect(result.lines).toHaveLength(2);
    expect(result.lines[0]).toMatchObject({ type: "income", amount: 1250, description: "PIX RECEBIDO" });
    expect(result.lines[1]).toMatchObject({ type: "expense", amount: 85.9, description: "MERCADO" });
    expect(result.unrecognizedLines).toBe(0);
    expect(destroy).toHaveBeenCalled();
  });
});
