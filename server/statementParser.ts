import { PDFParse } from "pdf-parse";

export type ParsedStatementLine = {
  type: "income" | "expense";
  amount: number;
  occurredAt: Date;
  description: string;
};

export type ParsedStatementResult = {
  lines: ParsedStatementLine[];
  unrecognizedLines: number;
  reviewLines: string[];
};

const DATE_PATTERN = /^(\d{2})[./-](\d{2})[./-](\d{2,4})(?:\s|$)/;
const AMOUNT_PATTERN = /([+-])\s*R\$\s*(-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+\.\d{2})/;

function parseAmount(raw: string) {
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return Math.abs(Number(normalized));
}

function parseDate(match: RegExpMatchArray) {
  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const rawYear = match[3];
  const year = rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear);
  const date = new Date(year, month, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function extractStatementLines(buffer: Buffer): Promise<ParsedStatementResult> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const lines: ParsedStatementLine[] = [];
    const reviewLines: string[] = [];
    let unrecognizedLines = 0;
    let currentDate: Date | null = null;

    for (const rawLine of result.text.split(/\r?\n/)) {
      const text = rawLine.replace(/\s+/g, " ").trim();
      if (!text) continue;

      const dateMatch = text.match(DATE_PATTERN);
      if (dateMatch) {
        currentDate = parseDate(dateMatch);
        const remainder = text.slice(dateMatch[0].length).trim();
        if (!remainder) continue;
      }

      const amountMatch = text.match(AMOUNT_PATTERN);
      if (!amountMatch) {
        if (currentDate && /[+-]\s*R\$/.test(text)) {
          unrecognizedLines += 1;
          reviewLines.push(text);
        }
        continue;
      }

      if (!currentDate) {
        unrecognizedLines += 1;
        reviewLines.push(text);
        continue;
      }

      const amount = parseAmount(amountMatch[2]);
      if (!amount || !Number.isFinite(amount)) {
        unrecognizedLines += 1;
        reviewLines.push(text);
        continue;
      }

      const description = text
        .slice(0, amountMatch.index ?? text.length)
        .replace(DATE_PATTERN, "")
        .replace(/^[|;:\-\s]+|[|;:\-\s]+$/g, "")
        .replace(/^(D|DB)\s+/i, "")
        .trim() || "Transação importada";

      lines.push({
        type: amountMatch[1] === "-" ? "expense" : "income",
        amount,
        occurredAt: currentDate,
        description: description.slice(0, 240),
      });
    }

    return { lines, unrecognizedLines, reviewLines };
  } finally {
    await parser.destroy();
  }
}
