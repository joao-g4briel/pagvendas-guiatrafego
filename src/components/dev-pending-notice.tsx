import { getPendingItems } from "@/config/site";

/** Visível apenas em `npm run dev`: lembra o que falta antes de abrir as vendas. */
export function DevPendingNotice() {
  const pending = getPendingItems();
  if (pending.length === 0) return null;
  return (
    <details className="relative z-50 border-b border-line-strong bg-surface text-sm text-fg-2">
      <summary className="shell cursor-pointer py-2">
        Desenvolvimento: {pending.length} pendências antes de abrir as vendas (src/config/site.ts)
      </summary>
      <ul className="shell list-disc space-y-1 pb-3 pl-9">
        {pending.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </details>
  );
}
