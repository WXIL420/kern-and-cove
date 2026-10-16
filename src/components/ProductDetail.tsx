"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Accordion } from "./Accordion";
import { ProductArt } from "./ProductArt";
import { ProductCard } from "./ProductCard";
import { QuantityStepper } from "./QuantityStepper";
import { addToCart, maxQty } from "@/lib/cart-store";
import { BUNDLE_SEPARATE_TOTAL, getProductById, products, stockState, type Product } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

const VIEW_LABELS = ["Studio", "Tonal", "Detail", "In use"];

export function ProductDetail({ product }: { product: Product }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [colorName, setColorName] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [mainVisible, setMainVisible] = useState(true);
  const buyRef = useRef<HTMLDivElement>(null);

  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0];
  const stock = stockState(product.inventory);
  const limit = maxQty(product);
  const image = product.images[imageIndex];
  const recommended = product.recommendedIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));

  useEffect(() => {
    const node = buyRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setMainVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -80px 0px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2200);
    return () => clearTimeout(t);
  }, [justAdded]);

  function handleAdd() {
    addToCart(product.slug, color.name, qty);
    setJustAdded(true);
  }

  function step(dir: 1 | -1) {
    setImageIndex((i) => (i + dir + product.images.length) % product.images.length);
  }

  const stockLabel =
    stock === "out"
      ? "Sold out — back in stock soon"
      : stock === "low"
        ? `Low stock — only ${product.inventory} left`
        : `In stock — ${product.inventory} available`;

  const addLabel = stock === "out" ? "Sold out" : justAdded ? "Added to cart" : "Add to cart";

  return (
    <div className="wrap pb-28 pt-6 lg:pb-8 lg:pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="hover:text-clay-deep hover:underline">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop?category=${product.category}`} className="hover:text-clay-deep hover:underline">
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square w-full overflow-hidden border border-stone/60 bg-paper-deep">
            <ProductArt
              key={`${imageIndex}-${color.name}`}
              slug={product.slug}
              color={color.hex}
              view={image.view}
              alt={image.alt}
              className="fade-up absolute inset-0 size-full [animation-duration:0.4s]"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-between p-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="grid size-11 place-items-center border border-stone bg-paper text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="grid size-11 place-items-center border border-stone bg-paper text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="Product images">
            {product.images.map((img, i) => (
              <li key={img.view}>
                <button
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`Show image ${i + 1} of ${product.images.length}: ${VIEW_LABELS[i]}`}
                  aria-pressed={i === imageIndex}
                  className={`relative block aspect-square w-full overflow-hidden border transition-colors ${
                    i === imageIndex ? "border-ink" : "border-stone/60 hover:border-ink/60"
                  }`}
                >
                  <ProductArt slug={product.slug} color={color.hex} view={img.view} alt="" className="absolute inset-0 size-full" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Details */}
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{product.name}</h1>
          <p className="mt-5 flex items-baseline gap-4">
            <span className="text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</span>
            {product.slug === "focus-workspace-bundle" && (
              <span className="text-sm text-muted">
                <span className="line-through">{formatPrice(BUNDLE_SEPARATE_TOTAL)}</span> if bought separately
              </span>
            )}
          </p>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-8 text-muted">{product.longDescription}</p>

          <div ref={buyRef} className="mt-9 space-y-7 border-t border-stone/70 pt-8">
            <fieldset>
              <legend className="text-sm font-semibold">
                Color: <span className="font-normal text-muted">{color.name}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
                {product.colors.map((c) => {
                  const selected = c.name === color.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={c.name}
                      title={c.name}
                      onClick={() => setColorName(c.name)}
                      className={`grid size-11 place-items-center rounded-full border transition-colors ${
                        selected ? "border-ink" : "border-transparent hover:border-stone"
                      }`}
                    >
                      <span className="size-8 rounded-full border border-ink/15" style={{ background: c.hex }} />
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <p
                className={`flex items-center gap-2 text-sm font-semibold ${
                  stock === "out" ? "text-clay-deep" : stock === "low" ? "text-clay-deep" : "text-olive"
                }`}
                role="status"
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${stock === "in" ? "bg-olive" : "bg-clay-deep"}`}
                />
                {stockLabel}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {stock !== "out" && (
                <QuantityStepper value={qty} max={limit} onChange={setQty} label={product.name} />
              )}
              <button
                type="button"
                onClick={handleAdd}
                disabled={stock === "out"}
                className="btn btn-primary flex-1"
              >
                {justAdded ? <Check className="size-4" aria-hidden="true" /> : <ShoppingBag className="size-4" aria-hidden="true" />}
                {addLabel}
                {!justAdded && stock !== "out" && <span aria-hidden="true">· {formatPrice(product.price * qty)}</span>}
              </button>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {justAdded ? `${qty} ${product.name} added to your cart.` : ""}
            </p>
            <p className="text-sm text-muted">
              Free standard shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}. Portfolio demonstration —
              nothing is for sale.
            </p>
          </div>

          <section aria-labelledby="benefits-heading" className="mt-10">
            <h2 id="benefits-heading" className="text-sm font-semibold uppercase tracking-[0.14em]">
              Why you will like it
            </h2>
            <ul className="mt-4 space-y-3">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-3 leading-7">
                  <Check className="mt-1.5 size-4 shrink-0 text-olive" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </section>

          {product.includes && (
            <section aria-labelledby="includes-heading" className="mt-10">
              <h2 id="includes-heading" className="text-sm font-semibold uppercase tracking-[0.14em]">
                What is included
              </h2>
              <ul className="mt-4 grid gap-px border border-stone bg-stone sm:grid-cols-2">
                {product.includes.map((name) => {
                  const item = products.find((p) => p.name === name);
                  return (
                    <li key={name} className="bg-paper">
                      {item ? (
                        <Link href={`/products/${item.slug}`} className="flex items-center justify-between px-4 py-3.5 text-sm hover:text-clay-deep">
                          {name}
                          <span className="tabular-nums text-muted">{formatPrice(item.price)}</span>
                        </Link>
                      ) : (
                        <span className="block px-4 py-3.5 text-sm">{name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section aria-labelledby="specs-heading" className="mt-10">
            <h2 id="specs-heading" className="text-sm font-semibold uppercase tracking-[0.14em]">
              Materials &amp; dimensions
            </h2>
            <dl className="mt-4 divide-y divide-stone/70 border-y border-stone/70 text-[0.95rem]">
              <div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <dt className="font-semibold">Materials</dt>
                <dd className="text-muted">{product.materials.join(" · ")}</dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <dt className="font-semibold">Dimensions</dt>
                <dd>
                  <ul className="space-y-1 text-muted">
                    {product.dimensions.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="policies-heading" className="mt-10">
            <h2 id="policies-heading" className="sr-only">
              Shipping and returns
            </h2>
            <Accordion
              defaultOpen={null}
              items={[
                {
                  title: "Shipping",
                  content: (
                    <p>
                      Standard U.S. shipping is $9 and free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}, arriving in
                      5–7 business days. Expedited (2–3 days) and overnight options are available at checkout.
                      Orders are packed in recyclable, plastic-free packaging.
                    </p>
                  ),
                },
                {
                  title: "Returns",
                  content: (
                    <p>
                      Return any unused piece within 30 days for a full refund. We cover the return label on
                      defects, and exchanges for another color are always free.
                    </p>
                  ),
                },
                {
                  title: "About this demonstration",
                  content: (
                    <p>
                      Kern &amp; Cove is a fictional brand built for a portfolio. These policies illustrate how a real
                      store might read — no product ships and no payment is ever taken.
                    </p>
                  ),
                },
              ]}
            />
          </section>
        </div>
      </div>

      {recommended.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-24 border-t border-stone/70 pt-16">
          <h2 id="related-heading" className="display text-4xl sm:text-5xl">
            Pairs well with
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 min-[520px]:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile purchase control */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-stone bg-paper px-4 py-3 transition-transform duration-300 lg:hidden ${
          mainVisible ? "translate-y-full" : "translate-y-0"
        }`}
        inert={mainVisible}
      >
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="truncate text-xs text-muted">
              {color.name} · {formatPrice(product.price)}
            </p>
          </div>
          <button type="button" onClick={handleAdd} disabled={stock === "out"} className="btn btn-primary shrink-0 px-6">
            {stock === "out" ? "Sold out" : justAdded ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

