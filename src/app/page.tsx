import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroScene, ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { AddBundleButton } from "@/components/AddBundleButton";
import { BUNDLE_SEPARATE_TOTAL, getProduct, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";

const featured = products.filter((p) => p.featured && p.slug !== "focus-workspace-bundle").slice(0, 4);
const bestSellers = products
  .filter((p) => p.bestSellerRank && p.bestSellerRank <= 4)
  .sort((a, b) => (a.bestSellerRank ?? 0) - (b.bestSellerRank ?? 0));

const principles = [
  {
    n: "01",
    title: "Fewer, better objects",
    body: "Every piece earns its place on the desk. We design a small range that works together instead of a catalog that competes for your attention.",
  },
  {
    n: "02",
    title: "Materials you can feel",
    body: "Felt, oak, aluminum and waxed canvas. Honest materials with a considered finish, chosen because they age well and quiet a room.",
  },
  {
    n: "03",
    title: "Calm by design",
    body: "Soft edges, muted color and no logos shouting from the surface. A workspace should help you disappear into the work.",
  },
];

const useCases = [
  {
    n: "01",
    title: "Start with the surface",
    body: "A considered desk mat gives the workspace a visual boundary while softening the contact points used throughout the day.",
    slug: "ridge-desk-mat",
    view: "detail" as const,
  },
  {
    n: "02",
    title: "Lift the screen",
    body: "A raised laptop or monitor supports a clearer viewing position and creates useful space underneath.",
    slug: "arc-monitor-shelf",
    view: "workspace" as const,
  },
  {
    n: "03",
    title: "Give small objects a home",
    body: "A dedicated tray and cable dock keep the items used repeatedly from drifting across the desk.",
    slug: "cove-valet-tray",
    view: "tonal" as const,
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const bundle = getProduct("focus-workspace-bundle")!;
  const [lead, ...rest] = bestSellers;

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="border-b border-stone/70">
        <div className="wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-16 lg:py-0">
          <div className="fade-up flex flex-col justify-center lg:py-24">
            <p className="eyebrow">Desk accessories &amp; workspace organization</p>
            <h1 id="hero-heading" className="display mt-6 text-[3.4rem] sm:text-7xl xl:text-[6.5rem]">
              A quieter way to work.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-muted">
              Considered tools for the desk you return to every day. Soft materials, calm color and a small
              collection built to disappear into your routine.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                Shop the collection <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/about" className="btn btn-outline">
                Our approach
              </Link>
            </div>
          </div>
          <div className="fade-up relative aspect-[5/6] w-full overflow-hidden border-x border-stone/50 [animation-delay:120ms] lg:aspect-auto lg:min-h-[44rem]">
            <HeroScene className="absolute inset-0 size-full" />
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section aria-label="Our promises" className="border-b border-stone/70">
        <ul className="wrap grid divide-y divide-stone/70 text-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["Free shipping over $150", "Standard U.S. delivery in 5–7 business days."],
            ["30-day returns", "Unused pieces can be returned for a full refund."],
            ["Built to last", "Materials chosen to improve with daily use."],
          ].map(([title, body]) => (
            <li key={title} className="px-0 py-5 sm:px-8 sm:first:pl-0 sm:last:pr-0">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured products */}
      <section aria-labelledby="featured-heading" className="wrap pt-20 lg:pt-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 id="featured-heading" className="display mt-4 text-5xl sm:text-6xl">
              The essentials
            </h2>
          </div>
          <Link
            href="/shop"
            className="link-underline inline-flex items-center gap-2 self-start pb-1 text-sm font-semibold sm:self-auto"
          >
            Shop all products <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 min-[520px]:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Best-selling collection */}
      <section aria-labelledby="best-heading" className="wrap pt-24 lg:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">Best-selling collection</p>
            <h2 id="best-heading" className="display mt-4 text-5xl sm:text-6xl">
              Most chosen, <span className="italic">most used</span>
            </h2>
            <p className="mt-6 max-w-sm leading-7 text-muted">
              The four pieces most often placed on a new desk first. If you are starting from a blank desk,
              begin here.
            </p>
            <Link href="/shop?sort=featured" className="btn btn-outline mt-8">
              See the full range
            </Link>
          </div>
          <div>
            <Link
              href={`/products/${lead.slug}`}
              className="group grid gap-6 border border-stone/70 bg-paper-deep/50 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] sm:items-center sm:p-6"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <ProductArt
                  slug={lead.slug}
                  color={lead.colors[0].hex}
                  view="workspace"
                  alt={lead.images[3].alt}
                  className="absolute inset-0 size-full"
                />
              </div>
              <div className="sm:pr-4">
                <p className="display text-6xl italic text-clay-deep">1</p>
                <h3 className="display mt-2 text-3xl group-hover:text-clay-deep">{lead.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{lead.shortDescription}</p>
                <p className="mt-5 flex items-center justify-between text-sm font-semibold">
                  {formatPrice(lead.price)}
                  <span className="inline-flex items-center gap-1.5 text-clay-deep">
                    View <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </p>
              </div>
            </Link>
            <ol className="mt-2 divide-y divide-stone/70 border-b border-stone/70">
              {rest.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}`} className="group flex items-center gap-4 py-5 sm:gap-6">
                    <span
                      className="display w-8 text-4xl italic text-stone group-hover:text-clay-deep sm:w-12"
                      aria-label={`Rank ${p.bestSellerRank}`}
                    >
                      {p.bestSellerRank}
                    </span>
                    <span className="relative size-20 shrink-0 overflow-hidden border border-stone/60 sm:size-24">
                      <ProductArt
                        slug={p.slug}
                        color={p.colors[0].hex}
                        alt=""
                        className="absolute inset-0 size-full"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="display block text-2xl leading-tight group-hover:text-clay-deep">
                        {p.name}
                      </span>
                      <span className="mt-1 block truncate text-sm text-muted">{p.shortDescription}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{formatPrice(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Focus Workspace Bundle */}
      <section aria-labelledby="bundle-heading" className="mt-24 bg-olive text-paper on-dark lg:mt-32">
        <div className="wrap grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-24">
          <div className="relative aspect-square w-full overflow-hidden lg:order-2">
            <ProductArt
              slug={bundle.slug}
              color={bundle.colors[1].hex}
              view="tonal"
              alt={bundle.images[1].alt}
              className="absolute inset-0 size-full"
            />
          </div>
          <div className="lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">Featured bundle</p>
            <h2 id="bundle-heading" className="display mt-4 text-5xl sm:text-6xl">
              The Focus Workspace Bundle
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-paper/80">
              Four pieces that make a desk feel finished, in a single coordinated palette. Everything you need
              to clear the noise and settle in.
            </p>
            <ul className="mt-8 grid max-w-lg gap-px border border-paper/20 bg-paper/20 sm:grid-cols-2">
              {bundle.includes?.map((item) => (
                <li key={item} className="bg-olive px-4 py-3.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="display text-5xl">{formatPrice(bundle.price)}</span>
              <span className="text-paper/60 line-through">{formatPrice(BUNDLE_SEPARATE_TOTAL)}</span>
              <span className="text-sm font-semibold text-stone">
                Save {formatPrice(BUNDLE_SEPARATE_TOTAL - bundle.price)}
              </span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddBundleButton product={bundle} />
              <Link href={`/products/${bundle.slug}`} className="btn btn-outline-light">
                See what is included
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-heading" className="wrap pt-24 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Brand philosophy</p>
          <h2 id="philosophy-heading" className="display mt-5 text-4xl sm:text-6xl lg:text-7xl">
            Work is loud enough. <span className="italic text-olive">Your desk does not have to be.</span>
          </h2>
        </div>
        <div className="mt-16 grid gap-px border-y border-stone/70 bg-stone/70 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.n} className="bg-paper px-0 py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0">
              <p className="display text-3xl italic text-clay-deep">{p.n}</p>
              <h3 className="display mt-6 text-3xl">{p.title}</h3>
              <p className="mt-4 leading-7 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/about"
            className="link-underline inline-flex items-center gap-2 pb-1 text-sm font-semibold"
          >
            Read the full story <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </p>
      </section>

      {/* Use cases */}
      <section aria-labelledby="use-heading" className="wrap pt-24 lg:pt-32">
        <div className="max-w-3xl">
          <p className="eyebrow">How it is used</p>
          <h2 id="use-heading" className="display mt-4 text-4xl sm:text-6xl">
            Built around the way a desk is actually used.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
          {useCases.map((u) => {
            const product = getProduct(u.slug)!;
            return (
              <article key={u.n}>
                <div className="relative aspect-[4/3] overflow-hidden border border-stone/60">
                  <ProductArt
                    slug={u.slug}
                    color={product.colors[0].hex}
                    view={u.view}
                    alt={`${product.name} shown as an example for “${u.title}”`}
                    className="absolute inset-0 size-full"
                  />
                </div>
                <p className="display mt-6 text-2xl italic text-clay-deep">{u.n}</p>
                <h3 className="display mt-2 text-3xl">{u.title}</h3>
                <p className="mt-3 leading-7 text-muted">{u.body}</p>
                <Link
                  href={`/products/${u.slug}`}
                  className="link-underline mt-4 inline-flex items-center gap-2 pb-1 text-sm font-semibold"
                >
                  {product.name} <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Email signup */}
      <section aria-labelledby="signup-heading" className="wrap pt-24 lg:pt-32">
        <div className="grid gap-10 border border-stone/70 bg-paper-deep/60 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-20 lg:p-16">
          <div>
            <p className="eyebrow">The quiet letter</p>
            <h2 id="signup-heading" className="display mt-4 text-4xl sm:text-5xl">
              Notes on working well, sent rarely.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-muted">
              Occasional essays on desk setups, focus and the objects that help. Nothing more.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
