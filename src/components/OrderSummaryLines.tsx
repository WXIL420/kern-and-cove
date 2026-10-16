import { ProductImage } from "./ProductImage";
import { formatMoney } from "@/lib/format";

export interface SummaryLine {
  slug: string;
  name: string;
  color: string;
  qty: number;
  price: number;
}

export function OrderSummaryLines({ lines }: { lines: SummaryLine[] }) {
  return (
    <ul className="divide-y divide-stone/60" aria-label="Order items">
      {lines.map((l) => (
        <li key={`${l.slug}-${l.color}`} className="flex items-center gap-4 py-4">
          <div className="relative size-16 shrink-0 overflow-hidden border border-stone/60">
            <ProductImage slug={l.slug} colorName={l.color} alt="" sizes="64px" />
            <span className="absolute -right-0 top-0 grid min-w-5 place-items-center bg-ink px-1 text-[0.65rem] font-bold leading-5 text-paper">
              {l.qty}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="display truncate text-lg leading-tight">{l.name}</p>
            <p className="text-sm text-muted">{l.color}</p>
          </div>
          <p className="text-sm font-semibold tabular-nums">{formatMoney(l.price * l.qty)}</p>
        </li>
      ))}
    </ul>
  );
}
