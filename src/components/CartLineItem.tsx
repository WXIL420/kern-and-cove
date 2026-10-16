"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ProductArt } from "./ProductArt";
import { QuantityStepper } from "./QuantityStepper";
import { maxQty, removeLine, setLineQty, type CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

interface Props {
  item: CartItem;
  onNavigate?: () => void;
  compact?: boolean;
}

export function CartLineItem({ item, onNavigate, compact = false }: Props) {
  const { product, color, qty, lineTotal } = item;
  const limit = maxQty(product);
  return (
    <li className="flex gap-4 py-5 sm:gap-5">
      <Link
        href={`/products/${product.slug}`}
        onClick={onNavigate}
        className={`${compact ? "size-24" : "size-24 sm:size-32"} relative shrink-0 overflow-hidden border border-stone/60`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductArt
          slug={product.slug}
          color={color.hex}
          alt=""
          className="size-full"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              onClick={onNavigate}
              className="display block text-xl leading-tight hover:text-clay-deep"
            >
              {product.name}
            </Link>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted">
              <span
                aria-hidden="true"
                className="inline-block size-3 rounded-full border border-ink/20"
                style={{ background: color.hex }}
              />
              {color.name}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums">{formatPrice(lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            label={`${product.name}, ${color.name}`}
            value={qty}
            max={limit}
            onChange={(v) => setLineQty(product.slug, color.name, v)}
          />
          <button
            type="button"
            onClick={() => removeLine(product.slug, color.name)}
            className="inline-flex items-center gap-1.5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-clay-deep"
            aria-label={`Remove ${product.name}, ${color.name} from cart`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </button>
        </div>
        {qty >= limit && (
          <p className="mt-2 text-xs text-clay-deep">
            {product.inventory <= limit ? `Only ${product.inventory} in stock.` : `Limit ${limit} per order.`}
          </p>
        )}
      </div>
    </li>
  );
}
