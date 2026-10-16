"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import { OrderSummaryLines } from "./OrderSummaryLines";
import { useHydrated } from "@/lib/cart-store";
import { formatDate, formatMoney } from "@/lib/format";
import { useLocalOrders } from "@/lib/orders-store";
import { getProduct } from "@/lib/products";
import { SHIPPING_METHODS } from "@/lib/shipping";

export function ConfirmationClient() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const orders = useLocalOrders();
  const number = params.get("order") ?? "";
  const order = orders.find((o) => o.number === number);

  if (!hydrated) {
    return (
      <div className="wrap py-16" aria-busy="true" aria-label="Loading your order">
        <div className="skeleton h-16 w-96 max-w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="wrap py-20 text-center">
        <h1 className="display text-5xl">We could not find that order</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-muted">
          Demo orders are only kept in the browser that placed them. If you cleared your browser data or
          opened this link elsewhere, the order will not be available.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  const method = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);
  const a = order.address;

  return (
    <div className="wrap py-12 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-5">
          <CheckCircle2 className="size-12 text-olive" strokeWidth={1.25} aria-hidden="true" />
          <p className="eyebrow">Demo order placed</p>
          <h1 className="display text-5xl sm:text-7xl">Thank you, {a.firstName}.</h1>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            Your fictional order <strong className="font-semibold text-ink">{order.number}</strong> was created on{" "}
            {formatDate(order.placedAt)}. A confirmation would be emailed to{" "}
            <span className="text-ink">{order.email}</span> in a real store.
          </p>
        </div>

        <div role="note" className="mt-8 flex items-start gap-3 border border-clay-deep/40 bg-[#f3e4dc] px-4 py-3.5 text-sm">
          <Info className="mt-0.5 size-5 shrink-0 text-clay-deep" aria-hidden="true" />
          <p>
            <strong className="font-semibold">Portfolio demonstration — no payment was collected</strong> and
            this order will not be fulfilled or shipped. Nothing was sent to a server.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <section aria-labelledby="items-heading">
            <h2 id="items-heading" className="display text-3xl">
              Your items
            </h2>
            <div className="mt-4 border-y border-stone/70">
              <OrderSummaryLines
                lines={order.lines.map((l) => ({
                  ...l,
                  colorHex: getProduct(l.slug)?.colors.find((c) => c.name === l.color)?.hex,
                }))}
              />
            </div>
            <dl className="mt-5 max-w-sm space-y-3 text-sm sm:ml-auto">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatMoney(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping ({method?.label})</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Estimated tax</dt>
                <dd className="tabular-nums">{formatMoney(order.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-stone/70 pt-4 text-lg">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold tabular-nums">{formatMoney(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="details-heading" className="h-fit border border-stone/70 bg-paper-deep/50 p-6 sm:p-8">
            <h2 id="details-heading" className="display text-3xl">
              Order details
            </h2>
            <dl className="mt-6 space-y-6 text-sm leading-6">
              <div>
                <dt className="font-semibold">Order number</dt>
                <dd className="text-muted">{order.number}</dd>
              </div>
              <div>
                <dt className="font-semibold">Ship to</dt>
                <dd className="text-muted">
                  {a.firstName} {a.lastName}
                  <br />
                  {a.address1}
                  {a.address2 && (
                    <>
                      <br />
                      {a.address2}
                    </>
                  )}
                  <br />
                  {a.city}, {a.state} {a.postalCode}
                  <br />
                  {a.country}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Delivery</dt>
                <dd className="text-muted">
                  {method?.label} · {method?.eta} (illustrative)
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Payment</dt>
                <dd className="text-muted">None collected — portfolio demonstration</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn btn-primary">
            Continue shopping
          </Link>
          <Link href="/admin-demo" className="btn btn-outline">
            See it in the admin demo
          </Link>
        </div>
      </div>
    </div>
  );
}
