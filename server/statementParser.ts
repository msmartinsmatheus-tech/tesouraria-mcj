import { PDFParse } from "pdf-parse";

export type ParsedStatementLine = {
  type: "income" | "expense";
  amount: number;
  occurredAt: Date;
  description: string;
};

const DATE_PATTERN = /\b(\d{2})[./-](\d{2})(?:[./-](\d{2,4}))?\b/;
const AMOUNT_PATTERN = /(?:R\$\s*)?(-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+\.\d{2})/;

function parseAmount(raw: string) {
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return Math.abs(Number(normalized));
}

function parseDate(match: RegExpMatchArray) {
  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const rawYear = match[3];
  const year = rawYear ? (rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear)) : new Date().getFullYear();
  const date = new Date(year, month, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function extractStatementLines(buffer: Buffer): Promise<{ lines: ParsedStatementLine[]; unrecognizedLines: number }> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const lines: ParsedStatementLine[] = [];
    let unrecognizedLines = 0;

    for (const rawLine of result.text.split(/\r?\n/)) {
      const text = rawLine.replace(/\s+/g, " ").trim();
      if (!text) continue;
      const dateMatch = text.match(DATE_PATTERN);
      const amountMatch = text.match(AMOUNT_PATTERN);
      if (!dateMatch || !amountMatch) {
        if (dateMatch || /R\$|\d+[,.]\d{2}/.test(text)) unrecognizedLines += 1;
        continue;
      }
      const occurredAt = parseDate(dateMatch);
      const amount = parseAmount(amountMatch[1]);
      if (!occurredAt || !amount || !Number.isFinite(amount)) {
        unrecognizedLines += 1;
        continue;
      }
      const beforeAmount = text.slice(0, amountMatch.index ?? text.length).replace(dateMatch[0], "").trim();
      const description = beforeAmount.replace(/^[|;:\-\s]+|[|;:\-\s]+$/g, "").replace(/^(D|DB|DÉBITO|DEBITO)\s+/i, "").trim() || "Transação importada";
      const debitHint = /(^|\s)(D|DB|DÉBITO|DEBITO)(\s|$)/i.test(text) || /-/.test(amountMatch[1]);
      lines.push({ type: debitHint ? "expense" : "income", amount, occurredAt, description: description.slice(0, 240) });
    }

    return { lines, unrecognizedLines };
  } finally {
    await parser.destroy();
  }
}
