"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Drawer } from "./Drawer";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { closeCart, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, count, subtotal, shipping, open } = useCart();

  return (
    <Drawer open={open} onClose={closeCart} label="Cart">
      <div className="flex h-full flex-col">
        <div className="border-b border-stone/70 px-6 py-5 pr-16">
          <h2 className="display text-3xl">Your cart</h2>
          <p className="mt-1 text-sm text-muted">
            {count === 0 ? "Nothing here yet" : `${count} ${count === 1 ? "item" : "items"}`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag className="size-10 text-stone" strokeWidth={1.25} aria-hidden="true" />
            <p className="display mt-5 text-2xl">Your cart is empty</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
              Start with the piece that will make the biggest difference to your desk.
            </p>
            <Link href="/shop" onClick={closeCart} className="btn btn-primary mt-7">
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-stone/70 px-6 py-5">
              <FreeShippingMeter subtotal={subtotal} />
            </div>
            <ul className="flex-1 divide-y divide-stone/60 overflow-y-auto px-6" aria-label="Cart items">
              {items.map((item) => (
                <CartLineItem key={`${item.product.slug}-${item.color.name}`} item={item} onNavigate={closeCart} compact />
              ))}
            </ul>
            <div className="border-t border-stone/70 bg-paper-deep/60 px-6 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Estimated shipping</dt>
                  <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                </div>
              </dl>
              <div className="mt-5 grid gap-3">
                <Link href="/checkout" onClick={closeCart} className="btn btn-primary w-full">
                  Continue to demo checkout
                </Link>
                <Link href="/cart" onClick={closeCart} className="btn btn-outline w-full">
                  View full cart
                </Link>
              </div>
              <p className="mt-4 text-center text-xs text-muted">
                Portfolio demonstration — no payment will be collected.
              </p>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
