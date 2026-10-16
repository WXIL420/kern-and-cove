"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Drawer } from "./Drawer";
import { ProductCard } from "./ProductCard";
import { CATEGORIES, products } from "@/lib/products";
import { SORT_OPTIONS, filterProducts, parseCategory, parseSort, type SortKey } from "@/lib/shop";

export function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = parseCategory(params.get("category"));
  const inStock = params.get("stock") === "1";
  const sort = parseSort(params.get("sort"));

  // The search box keeps its own state so typing never fights the URL.
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  function update(next: { q?: string; category?: string; stock?: boolean; sort?: SortKey }) {
    const sp = new URLSearchParams();
    const q = next.q ?? query;
    const cat = next.category ?? category;
    const stock = next.stock ?? inStock;
    const s = next.sort ?? sort;
    if (q.trim()) sp.set("q", q);
    if (cat) sp.set("category", cat);
    if (stock) sp.set("stock", "1");
    if (s !== "featured") sp.set("sort", s);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  const results = filterProducts(products, { q: query, category, inStock, sort });
  const active: { key: string; label: string; clear: () => void }[] = [];
  if (query.trim()) {
    active.push({
      key: "q",
      label: `Search: “${query.trim()}”`,
      clear: () => {
        setQuery("");
        update({ q: "" });
      },
    });
  }
  if (category) active.push({ key: "category", label: category, clear: () => update({ category: "" }) });
  if (inStock) active.push({ key: "stock", label: "In stock", clear: () => update({ stock: false }) });

  const counts = new Map<string, number>(
    CATEGORIES.map((c) => [c, products.filter((p) => p.category === c).length]),
  );

  const filterPanel = (
    <div className="space-y-9">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Category</legend>
        <div className="mt-4 space-y-1">
          {[{ label: "All products", value: "", count: products.length }, ...CATEGORIES.map((c) => ({ label: c, value: c as string, count: counts.get(c) ?? 0 }))].map(
            (opt) => (
              <label
                key={opt.label}
                className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-[0.95rem] transition-colors hover:text-clay-deep has-[:checked]:font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-clay-deep"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="category"
                    value={opt.value}
                    checked={category === opt.value}
                    onChange={() => update({ category: opt.value })}
                    className="size-4 accent-olive"
                  />
                  {opt.label}
                </span>
                <span className="text-xs tabular-nums text-muted">{opt.count}</span>
              </label>
            ),
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Availability</legend>
        <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-[0.95rem] hover:text-clay-deep">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => update({ stock: e.target.checked })}
            className="size-4 accent-olive"
          />
          In stock only
        </label>
      </fieldset>
    </div>
  );

  return (
    <div className="wrap pb-8 pt-10 lg:pt-16">
      <header className="max-w-2xl">
        <p className="eyebrow">The collection</p>
        <h1 className="display mt-4 text-5xl sm:text-7xl">Shop all</h1>
        <p className="mt-5 leading-7 text-muted">
          Eight considered pieces for a calmer desk. Filter by category, search by material or color, and
          sort by price.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div>
          <div className="flex flex-col gap-3 border-y border-stone/70 py-4 sm:flex-row sm:items-center">
            <div className="relative sm:flex-1">
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id="shop-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  update({ q: e.target.value });
                }}
                placeholder="Search by name, material or color"
                className="field pl-10"
                autoComplete="off"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="btn btn-outline flex-1 lg:hidden"
                aria-haspopup="dialog"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filters{active.length > 0 && ` (${active.length})`}
              </button>
              <div className="flex flex-1 items-center gap-2 sm:flex-none">
                <label htmlFor="shop-sort" className="hidden text-sm text-muted sm:block">
                  Sort
                </label>
                <select
                  id="shop-sort"
                  value={sort}
                  onChange={(e) => update({ sort: e.target.value as SortKey })}
                  className="field min-w-0 flex-1 sm:w-52 sm:flex-none"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex min-h-12 flex-wrap items-center gap-2 py-4" aria-label="Active filters">
            <p className="mr-2 text-sm text-muted" role="status" aria-live="polite">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
            {active.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={a.clear}
                className="inline-flex items-center gap-1.5 border border-stone bg-paper-deep px-3 py-1.5 text-sm transition-colors hover:border-ink"
                aria-label={`Remove filter: ${a.label}`}
              >
                {a.label}
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ))}
            {active.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 px-1 py-1.5 text-sm font-semibold text-clay-deep underline underline-offset-4 hover:text-ink"
              >
                Clear all
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center border border-dashed border-stone px-6 py-20 text-center">
              <Search className="size-9 text-stone" strokeWidth={1.25} aria-hidden="true" />
              <h2 className="display mt-5 text-3xl">Nothing matches that yet</h2>
              <p className="mt-3 max-w-sm leading-7 text-muted">
                Try a broader search, a different category, or clear your filters to see the whole collection.
              </p>
              <button type="button" onClick={clearAll} className="btn btn-primary mt-7">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 min-[520px]:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} label="Filters" width="max-w-sm">
        <div className="flex h-full flex-col">
          <div className="border-b border-stone/70 px-6 py-5 pr-16">
            <h2 className="display text-3xl">Filters</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">{filterPanel}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-stone/70 px-6 py-5">
            <button type="button" onClick={clearAll} className="btn btn-outline" disabled={active.length === 0}>
              Clear all
            </button>
            <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-primary">
              Show {results.length}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="wrap pb-8 pt-10 lg:pt-16" aria-busy="true" aria-label="Loading products">
      <div className="skeleton h-5 w-32" />
      <div className="skeleton mt-4 h-16 w-72" />
      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-14 min-[520px]:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5]" />
            <div className="skeleton mt-4 h-6 w-2/3" />
            <div className="skeleton mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
