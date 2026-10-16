import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductArt } from "@/components/ProductArt";
import { Accordion } from "@/components/Accordion";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Kern & Cove, a fictional desk-accessory brand, and how this portfolio project was built.",
};

const values = [
  ["Edit ruthlessly", "We would rather make eight excellent things than eighty adequate ones. If a product does not make the desk calmer, it does not ship."],
  ["Choose honest materials", "Wool felt, white oak, anodized aluminum and waxed canvas. Materials that look better at year three than day one."],
  ["Design for the whole day", "A desk is lived at from early morning to late evening. Everything we make should feel as good at 8 a.m. as it does at 8 p.m."],
];

const stack = [
  "Next.js App Router with TypeScript",
  "Tailwind CSS v4 and Lucide icons",
  "Local TypeScript product and order data",
  "Cart state in a small external store, persisted to localStorage",
  "Original SVG product illustrations, no stock photography",
  "No payment provider, database or CMS — by design",
];

export default function AboutPage() {
  return (
    <>
      <section className="wrap pt-12 lg:pt-20" aria-labelledby="about-heading">
        <p className="eyebrow">About Kern &amp; Cove</p>
        <h1 id="about-heading" className="display mt-5 max-w-5xl text-5xl sm:text-7xl lg:text-8xl">
          We make the desk <span className="italic text-olive">disappear</span>, so the work can show up.
        </h1>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden border border-stone/60">
            <ProductArt
              slug="axis-laptop-stand"
              color="#BDBBB4"
              view="workspace"
              alt="An aluminum laptop stand on a warm oak desk beside a mug and a small plant"
              className="absolute inset-0 size-full"
            />
          </div>
          <div className="space-y-6 text-lg leading-8 text-muted lg:pt-4">
            <p>
              Kern &amp; Cove began with a simple observation: the people who work from home spend more
              waking hours at their desks than anywhere else, yet the objects on those desks are often an
              afterthought.
            </p>
            <p>
              A <em>kern</em> is the small space between letters, adjusted so a line of type reads
              effortlessly. A <em>cove</em> is a sheltered curve of calm water. Our products aim for both:
              the quiet precision of good spacing and the feeling of a protected place to think.
            </p>
            <p>
              Everything we design is meant to sit unobtrusively in your day — to organize without
              demanding attention.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap pt-24 lg:pt-32" aria-labelledby="values-heading">
        <h2 id="values-heading" className="display text-4xl sm:text-5xl">
          What we believe
        </h2>
        <div className="mt-10 grid gap-px border-y border-stone/70 bg-stone/70 md:grid-cols-3">
          {values.map(([title, body], i) => (
            <div key={title} className="bg-paper py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="display text-3xl italic text-clay-deep">0{i + 1}</p>
              <h3 className="display mt-5 text-3xl">{title}</h3>
              <p className="mt-4 leading-7 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="shipping-returns" className="wrap scroll-mt-28 pt-24 lg:pt-32" aria-labelledby="ship-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Policies</p>
            <h2 id="ship-heading" className="display mt-4 text-4xl sm:text-5xl">
              Shipping &amp; returns
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-muted">
              Illustrative policies, written as a real store might present them.
            </p>
          </div>
          <Accordion
            defaultOpen={0}
            items={[
              {
                title: "Shipping rates and times",
                content: (
                  <p>
                    Standard shipping within the U.S. is $9 and free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}, arriving in
                    5–7 business days. Expedited shipping is $18 (2–3 business days) and overnight shipping is
                    $32 (next business day).
                  </p>
                ),
              },
              {
                title: "Returns and exchanges",
                content: (
                  <p>
                    Unused pieces can be returned within 30 days for a full refund to the original payment
                    method. Exchanges for another color are always free of charge.
                  </p>
                ),
              },
              {
                title: "Damaged or defective items",
                content: (
                  <p>
                    If something arrives damaged, send a photo and we will replace it at no cost, with no need
                    to return the original.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section id="about-this-project" className="mt-24 scroll-mt-20 bg-olive text-paper on-dark lg:mt-32" aria-labelledby="project-heading">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">About this project</p>
            <h2 id="project-heading" className="display mt-4 text-4xl sm:text-5xl">
              A portfolio project, not a real store
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-paper/80">
              Kern &amp; Cove is fictional. No payment is ever collected, no order is fulfilled, and the
              testimonials and admin data are invented for demonstration. The shop exists to show what a
              considered e-commerce front end can feel like.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-light">
                Explore the shop <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/admin-demo" className="btn btn-outline-light">
                Open the admin demo
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone">How it is built</h3>
            <ul className="mt-5 divide-y divide-paper/20 border-y border-paper/20">
              {stack.map((s) => (
                <li key={s} className="py-3.5 text-paper/90">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
