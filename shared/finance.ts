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
