"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Info, Minus, Plus, RotateCcw, Search } from "lucide-react";
import { ORDER_STATUSES, NEXT_STATUS, SEED_ORDERS } from "@/lib/admin-data";
import { formatDate, formatMoney, formatPrice } from "@/lib/format";
import { useLocalOrders, type DemoOrder, type OrderStatus } from "@/lib/orders-store";
import { LOW_STOCK_THRESHOLD, products, stockState } from "@/lib/products";
import { useHydrated } from "@/lib/cart-store";

export const ADMIN_NOTICE = "Demonstration dashboard using fictional store data.";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Processing: "bg-[#efe3c7] text-[#6b5314]",
  Packed: "bg-[#dfe6dc] text-olive-deep",
  Shipped: "bg-[#d9e1e8] text-[#2f4559]",
  Delivered: "bg-olive text-paper",
  Cancelled: "bg-stone/70 text-ink/70 line-through decoration-1",
};

const STOCK_STYLES = {
  in: "bg-[#dfe6dc] text-olive-deep",
  low: "bg-[#f3e0d7] text-clay-deep",
  out: "bg-ink text-paper",
};

const STOCK_LABELS = { in: "In stock", low: "Low stock", out: "Out of stock" };

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-paper p-5 sm:p-6">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="display mt-3 text-4xl tabular-nums sm:text-5xl">{value}</dd>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}

export function AdminDashboard() {
  const hydrated = useHydrated();
  const localOrders = useLocalOrders();

  const [statusOverrides, setStatusOverrides] = useState<Record<string, OrderStatus>>({});
  const [stockDeltas, setStockDeltas] = useState<Record<string, number>>({});
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "All">("All");
  const [invQuery, setInvQuery] = useState("");
  const [invFilter, setInvFilter] = useState<"All" | "in" | "low" | "out">("All");
  const [message, setMessage] = useState("");

  const orders: DemoOrder[] = useMemo(
    () =>
      [...localOrders, ...SEED_ORDERS]
        .map((o) => ({ ...o, status: statusOverrides[o.number] ?? o.status }))
        .sort((a, b) => b.placedAt.localeCompare(a.placedAt)),
    [localOrders, statusOverrides],
  );

  const inventory = products.map((p) => ({
    ...p,
    stock: Math.max(0, p.inventory + (stockDeltas[p.slug] ?? 0)),
  }));

  const counted = orders.filter((o) => o.status !== "Cancelled");
  const revenue = counted.reduce((s, o) => s + o.total, 0);
  const aov = counted.length ? revenue / counted.length : 0;
  const lowStock = inventory.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).length;

  // Revenue for the 14 days ending on the most recent order.
  const chart = useMemo(() => {
    const latest = orders.reduce((m, o) => (o.placedAt > m ? o.placedAt : m), "2026-10-14T00:00:00Z");
    const end = new Date(`${dayKey(latest)}T00:00:00Z`).getTime();
    const days = Array.from({ length: 14 }, (_, i) =>
      new Date(end - (13 - i) * 86400000).toISOString().slice(0, 10),
    );
    const totals = new Map(days.map((d) => [d, 0]));
    for (const o of orders) {
      if (o.status === "Cancelled") continue;
      const k = dayKey(o.placedAt);
      if (totals.has(k)) totals.set(k, (totals.get(k) ?? 0) + o.total);
    }
    return days.map((d) => ({ day: d, total: totals.get(d) ?? 0 }));
  }, [orders]);
  const chartMax = Math.max(1, ...chart.map((c) => c.total));

  const q = orderQuery.trim().toLowerCase();
  const filteredOrders = orders.filter((o) => {
    if (orderStatus !== "All" && o.status !== orderStatus) return false;
    if (!q) return true;
    return [o.number, o.customerName, o.email, o.address.city].join(" ").toLowerCase().includes(q);
  });

  const iq = invQuery.trim().toLowerCase();
  const filteredInventory = inventory.filter((p) => {
    if (invFilter !== "All" && stockState(p.stock) !== invFilter) return false;
    return !iq || `${p.name} ${p.category} ${p.id}`.toLowerCase().includes(iq);
  });

  function advance(order: DemoOrder, next: OrderStatus) {
    setStatusOverrides((s) => ({ ...s, [order.number]: next }));
    setMessage(`${order.number} marked ${next.toLowerCase()}.`);
  }

  function adjust(slug: string, name: string, delta: number) {
    setStockDeltas((s) => ({ ...s, [slug]: (s[slug] ?? 0) + delta }));
    setMessage(`${name} stock ${delta > 0 ? "increased" : "decreased"} by ${Math.abs(delta)}.`);
  }

  function reset() {
    setStatusOverrides({});
    setStockDeltas({});
    setOrderQuery("");
    setOrderStatus("All");
    setInvQuery("");
    setInvFilter("All");
    setMessage("Dashboard reset to its original data.");
  }

  const hasChanges = Object.keys(statusOverrides).length > 0 || Object.keys(stockDeltas).length > 0;

  return (
    <div className="wrap py-10 lg:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Merchant view</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={!hasChanges}
          className="btn btn-outline self-start md:self-auto"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset dashboard
        </button>
      </div>

      <div
        role="note"
        className="mt-6 flex items-start gap-3 border border-clay-deep/40 bg-[#f3e4dc] px-4 py-3.5 text-sm"
      >
        <Info className="mt-0.5 size-5 shrink-0 text-clay-deep" aria-hidden="true" />
        <p>
          <strong className="font-semibold">{ADMIN_NOTICE}</strong> Changes you make stay in this browser tab.
        </p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
      {message && (
        <p className="mt-4 border-l-2 border-olive bg-paper-deep px-4 py-3 text-sm" aria-hidden="true">
          {message}
        </p>
      )}

      <dl className="mt-10 grid gap-px border border-stone/70 bg-stone/70 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Revenue"
          value={formatPrice(Math.round(revenue))}
          note={`${counted.length} orders, excluding cancelled`}
        />
        <Stat
          label="Orders"
          value={String(orders.length)}
          note={`${orders.length - counted.length} cancelled`}
        />
        <Stat label="Average order value" value={formatMoney(aov)} note="Per completed or open order" />
        <Stat
          label="Low-stock items"
          value={String(lowStock)}
          note={`${LOW_STOCK_THRESHOLD} units or fewer, including sold out`}
        />
      </dl>

      <section aria-labelledby="chart-heading" className="mt-10 border border-stone/70 p-5 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="chart-heading" className="display text-3xl">
            Revenue, last 14 days
          </h2>
          <p className="text-sm text-muted">Peak day {formatMoney(chartMax)}</p>
        </div>
        <figure className="mt-6">
          <svg
            viewBox="0 0 700 180"
            role="img"
            aria-label={`Bar chart of daily revenue over 14 days. Highest day: ${formatMoney(chartMax)}.`}
            className="h-44 w-full"
            preserveAspectRatio="none"
          >
            {[0.25, 0.5, 0.75, 1].map((t) => (
              <line
                key={t}
                x1={0}
                x2={700}
                y1={150 - t * 140}
                y2={150 - t * 140}
                stroke="#C9C2B5"
                strokeOpacity={0.6}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {chart.map((c, i) => {
              const h = (c.total / chartMax) * 140;
              return (
                <rect
                  key={c.day}
                  x={i * 50 + 10}
                  y={150 - h}
                  width={30}
                  height={Math.max(h, c.total > 0 ? 2 : 0)}
                  fill="#39483B"
                >
                  <title>{`${formatDate(c.day)}: ${formatMoney(c.total)}`}</title>
                </rect>
              );
            })}
            <line
              x1={0}
              x2={700}
              y1={150}
              y2={150}
              stroke="#191B19"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div
            className="mt-2 grid grid-cols-14 text-center text-[0.65rem] text-muted sm:text-xs"
            aria-hidden="true"
          >
            {chart.map((c, i) => (
              <span key={c.day} className={i % 2 === 0 ? "" : "invisible sm:visible"}>
                {Number(c.day.slice(8))}
              </span>
            ))}
          </div>
          <figcaption className="mt-3 text-xs text-muted">
            Day of month (October 2026). Hover a bar for exact figures.
          </figcaption>
        </figure>
      </section>

      {/* Orders */}
      <section aria-labelledby="orders-heading" className="mt-16">
        <h2 id="orders-heading" className="display text-4xl">
          Recent orders
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:flex-1">
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="order-search"
              type="search"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Search by order number, customer or city"
              className="field pl-10"
            />
          </div>
          <div className="sm:w-56">
            <label htmlFor="order-status" className="sr-only">
              Filter by status
            </label>
            <select
              id="order-status"
              className="field"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus | "All")}
            >
              <option value="All">All statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="relative mt-4 overflow-x-auto border border-stone/70"
          tabIndex={0}
          role="region"
          aria-label="Orders table, scrollable"
        >
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="bg-paper-deep text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Order
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Items
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Fulfillment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/60">
              {!hydrated ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted">
                    Loading orders…
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted">
                    No orders match those filters.{" "}
                    <button
                      type="button"
                      className="font-semibold text-clay-deep underline underline-offset-4"
                      onClick={() => {
                        setOrderQuery("");
                        setOrderStatus("All");
                      }}
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const next = NEXT_STATUS[o.status];
                  const canCancel = o.status === "Processing" || o.status === "Packed";
                  const units = o.lines.reduce((s, l) => s + l.qty, 0);
                  return (
                    <tr key={o.number} className="align-top transition-colors hover:bg-paper-deep/50">
                      <th scope="row" className="whitespace-nowrap px-4 py-4 font-semibold">
                        {o.number}
                        {o.local && (
                          <span className="ml-2 border border-clay-deep px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-clay-deep">
                            New
                          </span>
                        )}
                      </th>
                      <td className="whitespace-nowrap px-4 py-4 text-muted">{formatDate(o.placedAt)}</td>
                      <td className="px-4 py-4">
                        <span className="block">{o.customerName}</span>
                        <span className="block text-xs text-muted">
                          {o.address.city}, {o.address.state}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {o.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}
                        <span className="sr-only">
                          {" "}
                          ({units} {units === 1 ? "unit" : "units"})
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums">
                        {formatMoney(o.total)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {next && (
                            <button
                              type="button"
                              onClick={() => advance(o, next.next)}
                              className="inline-flex min-h-11 items-center border border-ink px-3.5 text-xs font-semibold transition-colors hover:bg-ink hover:text-paper"
                              aria-label={`${next.label} for order ${o.number}`}
                            >
                              {next.label}
                            </button>
                          )}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => advance(o, "Cancelled")}
                              className="inline-flex min-h-11 items-center px-3 text-xs font-semibold text-clay-deep underline underline-offset-4 hover:text-ink"
                              aria-label={`Cancel order ${o.number}`}
                            >
                              Cancel
                            </button>
                          )}
                          {!next && !canCancel && <span className="py-1.5 text-xs text-muted">—</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Showing {filteredOrders.length} of {orders.length} orders. Orders you place in the{" "}
          <Link href="/shop" className="underline underline-offset-2 hover:text-clay-deep">
            checkout
          </Link>{" "}
          appear here, marked New.
        </p>
      </section>

      {/* Inventory */}
      <section aria-labelledby="inventory-heading" className="mt-20">
        <h2 id="inventory-heading" className="display text-4xl">
          Inventory
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:flex-1">
            <label htmlFor="inv-search" className="sr-only">
              Search inventory
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="inv-search"
              type="search"
              value={invQuery}
              onChange={(e) => setInvQuery(e.target.value)}
              placeholder="Search products"
              className="field pl-10"
            />
          </div>
          <div className="sm:w-56">
            <label htmlFor="inv-filter" className="sr-only">
              Filter by stock level
            </label>
            <select
              id="inv-filter"
              className="field"
              value={invFilter}
              onChange={(e) => setInvFilter(e.target.value as typeof invFilter)}
            >
              <option value="All">All stock levels</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
        </div>

        <div
          className="relative mt-4 overflow-x-auto border border-stone/70"
          tabIndex={0}
          role="region"
          aria-label="Inventory table, scrollable"
        >
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-paper-deep text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  On hand
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Adjust stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/60">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    No products match those filters.{" "}
                    <button
                      type="button"
                      className="font-semibold text-clay-deep underline underline-offset-4"
                      onClick={() => {
                        setInvQuery("");
                        setInvFilter("All");
                      }}
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((p) => {
                  const st = stockState(p.stock);
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-paper-deep/50">
                      <th scope="row" className="px-4 py-4 font-semibold">
                        <Link href={`/products/${p.slug}`} className="hover:text-clay-deep hover:underline">
                          {p.name}
                        </Link>
                        <span className="block text-xs font-normal text-muted">{p.id.toUpperCase()}</span>
                      </th>
                      <td className="px-4 py-4 text-muted">{p.category}</td>
                      <td className="px-4 py-4 text-right tabular-nums">{formatPrice(p.price)}</td>
                      <td className="px-4 py-4 text-right font-semibold tabular-nums">{p.stock}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${STOCK_STYLES[st]}`}
                        >
                          {st !== "in" && <AlertTriangle className="size-3" aria-hidden="true" />}
                          {STOCK_LABELS[st]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => adjust(p.slug, p.name, -1)}
                            disabled={p.stock <= 0}
                            aria-label={`Remove one ${p.name} from stock`}
                            className="grid size-11 place-items-center border border-stone transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => adjust(p.slug, p.name, 10)}
                            aria-label={`Restock ten ${p.name}`}
                            className="inline-flex h-11 items-center gap-1.5 border border-ink px-3.5 text-xs font-semibold transition-colors hover:bg-ink hover:text-paper"
                          >
                            <Plus className="size-3.5" aria-hidden="true" />
                            Restock 10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
