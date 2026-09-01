export type BalanceEntry = { type: "income" | "expense"; amount: number; status?: string };

export function calculateCurrentBalance(initialBalance: number, movements: BalanceEntry[]) {
  return movements.reduce((balance, movement) => {
    if (movement.status === "excluded") return balance;
    return movement.type === "income" ? balance + movement.amount : balance - movement.amount;
  }, initialBalance);
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export type StatementLine = { status: "pending" | "matched" | "divergence" };

export function calculateStatementCounts(lines: StatementLine[]) {
  const total = lines.length;
  const matched = lines.filter(line => line.status === "matched").length;
  const pending = lines.filter(line => line.status === "pending").length;
  const divergence = lines.filter(line => line.status === "divergence").length;
  return { total, matched, pending, divergence, completion: total ? Math.round((matched / total) * 100) : 0 };
}
