import Link from "next/link";
import { ProductArt } from "./ProductArt";
import { stockState, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

interface Props {
  product: Product;
  priority?: boolean;
  rank?: number;
}

export function ProductCard({ product, rank }: Props) {
  const stock = stockState(product.inventory);
  const first = product.colors[0];
  const hover = product.images[3];
  return (
    <article className="group relative">
      <Link href={`/products/${product.slug}`} className="block focus-visible:outline-offset-4">
        <div className="relative aspect-[4/5] overflow-hidden border border-stone/60 bg-paper-deep">
          <ProductArt
            slug={product.slug}
            color={first.hex}
            view="studio"
            alt={product.images[0].alt}
            className="absolute inset-0 size-full transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0"
          />
          <ProductArt
            slug={product.slug}
            color={first.hex}
            view={hover.view}
            alt=""
            className="absolute inset-0 size-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
          />
          {stock !== "in" && (
            <span
              className={`absolute left-3 top-3 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${
                stock === "out" ? "bg-ink text-paper" : "bg-clay-deep text-white"
              }`}
            >
              {stock === "out" ? "Sold out" : `Only ${product.inventory} left`}
            </span>
          )}
          {rank && (
            <span className="display absolute right-4 top-3 text-4xl italic text-ink/50">{rank}</span>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="display text-[1.4rem] leading-tight transition-colors group-hover:text-clay-deep">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted">{product.category}</p>
          </div>
          <p className="pt-1 text-base font-semibold tabular-nums">{formatPrice(product.price)}</p>
        </div>
        <ul className="mt-3 flex items-center gap-1.5" aria-label={`Available colors: ${product.colors.map((c) => c.name).join(", ")}`}>
          {product.colors.map((c) => (
            <li
              key={c.name}
              className="size-3.5 rounded-full border border-ink/20"
              style={{ background: c.hex }}
              title={c.name}
            />
          ))}
        </ul>
      </Link>
    </article>
  );
}
