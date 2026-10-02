import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Transaction = {
  id: number;
  type: string;
  amount: string | number;
  occurredAt: Date | string;
  description: string;
  status: string;
  matchedEntryId?: number | null;
};

type Entry = {
  id?: number;
  description: string;
  value: number;
  categoryId?: number | null;
  notes?: string | null;
};

type Category = { id: number; name: string; kind: string };
type Tag = { id: number; name: string };
type Draft = { entryId: string; categoryId: string; tagIds: number[]; notes: string };

type Props = {
  transactions: Transaction[];
  entries: Entry[];
  categories: Category[];
  tags: Tag[];
  onSave: (input: { transactionId: number; entryId?: number; categoryId?: number; tagIds: number[]; notes?: string; status: "matched" | "divergence" | "pending" }) => void;
};

export function StatementReconciliation({ transactions, entries, categories, tags, onSave }: Props) {
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const entryById = new Map(entries.filter(entry => entry.id).map(entry => [entry.id as number, entry]));

  const getDraft = (transaction: Transaction): Draft => {
    if (drafts[transaction.id]) return drafts[transaction.id];
    const entry = transaction.matchedEntryId ? entryById.get(transaction.matchedEntryId) : undefined;
    return { entryId: "", categoryId: entry?.categoryId ? String(entry.categoryId) : "", tagIds: [], notes: entry?.notes ?? "" };
  };

  const updateDraft = (transactionId: number, patch: Partial<Draft>) => {
    setDrafts(current => ({ ...current, [transactionId]: { ...getDraft(transactions.find(item => item.id === transactionId)!), ...patch } }));
  };

  const submit = (transaction: Transaction, status: "matched" | "divergence" | "pending") => {
    const draft = getDraft(transaction);
    onSave({
      transactionId: transaction.id,
      ...(draft.entryId ? { entryId: Number(draft.entryId) } : {}),
      ...(draft.categoryId ? { categoryId: Number(draft.categoryId) } : {}),
      tagIds: draft.tagIds,
      notes: draft.notes.trim() || undefined,
      status,
    });
  };

  return <div className="mt-6 rounded-2xl border border-[#cfe5dc] bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div><h3 className="font-display font-bold text-[#155a48]">Classificação das linhas do extrato</h3><p className="mt-1 text-xs text-[#8a97a8]">Cada linha já compõe o saldo. Aqui você informa categoria, tags e a justificativa da movimentação.</p></div>
      <Badge className="bg-[#e6f6f0] text-[#178260]">{transactions.length} linha(s)</Badge>
    </div>
    {transactions.length === 0 ? <div className="mt-5 rounded-xl border border-dashed border-[#cfe5dc] bg-[#f7fcfa] p-5 text-center text-xs text-[#6e8a80]">Nenhuma linha foi encontrada para este extrato.</div> : <div className="mt-5 space-y-4">{transactions.map(transaction => { const draft = getDraft(transaction); const isDone = transaction.status === "matched" || transaction.status === "divergence"; return <div key={transaction.id} className="rounded-xl border border-[#e7edf1] bg-[#f7fafc] p-4">
      <div className="flex flex-wrap items-start gap-3"><div className="flex-1"><p className="text-xs font-bold text-[#36516d]">{transaction.description}</p><p className="mt-1 text-[11px] text-[#8a97a8]">{new Date(transaction.occurredAt).toLocaleDateString("pt-BR")} · <span className={transaction.type === "income" ? "text-[#178260]" : "text-[#b57435]"}>{transaction.type === "income" ? "+" : "−"} {money(Number(transaction.amount))}</span></p></div><Badge className={transaction.status === "matched" ? "bg-[#e6f6f0] text-[#178260]" : transaction.status === "divergence" ? "bg-[#fff0e8] text-[#b7664c]" : "bg-[#fff4df] text-[#ad762e]"}>{transaction.status === "matched" ? "Classificada" : transaction.status === "divergence" ? "Divergência" : "Pendente"}</Badge></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="flex flex-col gap-1 text-[11px] font-bold text-[#526a84] sm:col-span-2">Lançamento existente (opcional)<select value={draft.entryId} onChange={event => updateDraft(transaction.id, { entryId: event.target.value })} className="h-10 rounded-lg border border-[#dce5ed] bg-white px-3 text-xs font-normal"><option value="">Usar a movimentação criada a partir do extrato</option>{entries.filter(entry => entry.id).map(entry => <option key={entry.id} value={entry.id}>{entry.description} · {money(entry.value)}</option>)}</select></label><label className="flex flex-col gap-1 text-[11px] font-bold text-[#526a84]">Categoria<select value={draft.categoryId} onChange={event => updateDraft(transaction.id, { categoryId: event.target.value })} className="h-10 rounded-lg border border-[#dce5ed] bg-white px-3 text-xs font-normal"><option value="">Selecione a categoria</option>{categories.filter(category => category.kind === "both" || category.kind === transaction.type).map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="flex flex-col gap-1 text-[11px] font-bold text-[#526a84]">Tag<select value={draft.tagIds[0] ?? ""} onChange={event => updateDraft(transaction.id, { tagIds: event.target.value ? [Number(event.target.value)] : [] })} className="h-10 rounded-lg border border-[#dce5ed] bg-white px-3 text-xs font-normal"><option value="">Selecione a tag</option>{tags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select></label><label className="flex flex-col gap-1 text-[11px] font-bold text-[#526a84] sm:col-span-2">Observação / justificativa<textarea value={draft.notes} onChange={event => updateDraft(transaction.id, { notes: event.target.value })} className="min-h-20 rounded-lg border border-[#dce5ed] bg-white px-3 py-2 text-xs font-normal outline-none focus:ring-2 focus:ring-[#b4d1e6]" placeholder="Explique ou justifique esta movimentação, se necessário." /></label></div>
      <div className="mt-3 flex flex-wrap justify-end gap-2"><button onClick={() => submit(transaction, "matched")} className="flex items-center gap-2 rounded-lg bg-[#147a5f] px-4 py-2 text-xs font-bold text-white"><CheckCircle2 className="h-3.5 w-3.5" /> {isDone && transaction.status === "matched" ? "Atualizar classificação" : "Salvar classificação"}</button>{transaction.status !== "divergence" && <button onClick={() => submit(transaction, "divergence")} className="rounded-lg border border-[#efd9b4] bg-[#fff9ef] px-3 py-2 text-xs font-bold text-[#ad762e]">Marcar divergência</button>}{isDone && <button onClick={() => submit(transaction, "pending")} className="rounded-lg border border-[#dce5ed] bg-white px-3 py-2 text-xs font-bold text-[#708196]">Voltar a pendente</button>}</div>
    </div>})}</div>}
  </div>;
}
