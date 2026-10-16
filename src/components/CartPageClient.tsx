"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { ProductCard } from "./ProductCard";
import { clearCart, useCart, useHydrated } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";
import { estimateTax } from "@/lib/shipping";
import { products } from "@/lib/products";

export function CartPageClient() {
  const hydrated = useHydrated();
  const { items, count, subtotal, shipping } = useCart();
  const tax = estimateTax(subtotal);

  if (!hydrated) {
    return (
      <div className="wrap py-12 lg:py-16" aria-busy="true" aria-label="Loading your cart">
        <div className="skeleton h-14 w-64" />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-5">
                <div className="skeleton size-32 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-6 w-1/2" />
                  <div className="skeleton h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="skeleton h-72" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    const suggestions = products.filter((p) => p.featured && p.inventory > 0 && p.slug !== "focus-workspace-bundle").slice(0, 3);
    return (
      <div className="wrap py-16 lg:py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <ShoppingBag className="size-12 text-stone" strokeWidth={1.1} aria-hidden="true" />
          <h1 className="display mt-6 text-5xl">Your cart is empty</h1>
          <p className="mt-4 leading-7 text-muted">
            Nothing has been added yet. The pieces below are a good place to begin.
          </p>
          <Link href="/shop" className="btn btn-primary mt-8">
            Browse the collection <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-14 min-[520px]:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-10 lg:py-16">
      <div className="flex items-end justify-between gap-4">
        <h1 className="display text-5xl sm:text-6xl">Your cart</h1>
        <p className="pb-2 text-sm text-muted">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16 xl:grid-cols-[1fr_26rem]">
        <section aria-label="Cart items">
          <ul className="divide-y divide-stone/70 border-y border-stone/70">
            {items.map((item) => (
              <CartLineItem key={`${item.product.slug}-${item.color.name}`} item={item} />
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link href="/shop" className="link-underline pb-1 text-sm font-semibold">
              ← Continue shopping
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-semibold text-muted underline underline-offset-4 hover:text-clay-deep"
            >
              Empty cart
            </button>
          </div>
        </section>

        <aside aria-labelledby="summary-heading" className="h-fit border border-stone/70 bg-paper-deep/50 p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 id="summary-heading" className="display text-3xl">
            Order summary
          </h2>
          <div className="mt-6">
            <FreeShippingMeter subtotal={subtotal} />
          </div>
          <dl className="mt-7 space-y-3 border-t border-stone/70 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold tabular-nums">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Estimated shipping</dt>
              <dd className="tabular-nums">{shipping === 0 ? "Free" : formatMoney(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Estimated tax</dt>
              <dd className="tabular-nums">{formatMoney(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone/70 pt-4 text-base">
              <dt className="font-semibold">Estimated total</dt>
              <dd className="font-semibold tabular-nums">{formatMoney(subtotal + shipping + tax)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn btn-primary mt-7 w-full">
            Continue to demo checkout
          </Link>
          <p className="mt-4 text-center text-xs leading-5 text-muted">
            Portfolio demonstration — no payment will be collected.
          </p>
        </aside>
      </div>
    </div>
  );
}
