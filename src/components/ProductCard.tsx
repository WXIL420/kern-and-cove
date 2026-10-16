import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { stockState, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

interface Props {
  product: Product;
  priority?: boolean;
  rank?: number;
}

export function ProductCard({ product, rank, priority = false }: Props) {
  const stock = stockState(product.inventory);
  const first = product.colors[0];
  const hover = product.images[2];
  return (
    <article className="group relative">
      <Link href={`/products/${product.slug}`} className="block focus-visible:outline-offset-4">
        <div className="relative aspect-square overflow-hidden border border-stone/60 bg-paper-deep">
          <ProductImage
            slug={product.slug}
            colorName={first.name}
            view="studio"
            alt={`${product.images[0].alt}, in ${first.name}`}
            sizes="(min-width: 1280px) 30vw, (min-width: 520px) 45vw, 92vw"
            priority={priority}
            className="transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0"
          />
          <ProductImage
            slug={product.slug}
            colorName={first.name}
            view={hover.view}
            alt=""
            sizes="(min-width: 1280px) 30vw, (min-width: 520px) 45vw, 92vw"
            className="opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
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
          {rank && <span className="display absolute right-4 top-3 text-4xl italic text-ink/50">{rank}</span>}
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
        <div className="mt-3 flex items-center gap-2.5">
          <ul className="flex items-center gap-1.5" aria-hidden="true">
            {product.colors.map((c) => (
              <li
                key={c.name}
                className="size-3.5 rounded-full border border-ink/20"
                style={{ background: c.hex }}
              />
            ))}
          </ul>
          <p className="text-xs text-muted">
            {product.colors.length} colors
            <span className="sr-only">: {product.colors.map((c) => c.name).join(", ")}</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
