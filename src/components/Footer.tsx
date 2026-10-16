import Link from "next/link";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper on-dark">
      <div className="wrap py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo className="text-paper [&_span]:text-stone" />
            <p className="display mt-5 text-2xl italic text-stone">A quieter way to work.</p>
            <p className="mt-6 text-sm leading-6 text-paper/65">
              Considered desk accessories and workspace organization, designed to make the
              hours you spend at your desk feel calmer.
            </p>
          </div>

          <nav aria-label="Shop categories">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">Shop</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link className="text-paper/85 transition-colors hover:text-white hover:underline" href="/shop">
                  All products
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    className="text-paper/85 transition-colors hover:text-white hover:underline"
                    href={`/shop?category=${c}`}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">Company</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link className="text-paper/85 transition-colors hover:text-white hover:underline" href="/about">
                  Our approach
                </Link>
              </li>
              <li>
                <Link className="text-paper/85 transition-colors hover:text-white hover:underline" href="/about#shipping-returns">
                  Shipping &amp; returns
                </Link>
              </li>
              <li>
                <Link className="text-paper/85 transition-colors hover:text-white hover:underline" href="/about#about-this-project">
                  About this project
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Portfolio">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">Portfolio</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link className="text-paper/85 transition-colors hover:text-white hover:underline" href="/admin-demo">
                  Admin demonstration
                </Link>
              </li>
              <li>
                <Link className="text-paper/85 transition-colors hover:text-white hover:underline" href="/cart">
                  Cart
                </Link>
              </li>
              <li>
                <Link className="text-paper/85 transition-colors hover:text-white hover:underline" href="/checkout">
                  Demo checkout
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-8 text-xs leading-5 text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Kern &amp; Cove. A fictional brand for portfolio purposes.</p>
          <p>Portfolio demonstration — no payment is collected and no order is ever fulfilled.</p>
        </div>
      </div>
    </footer>
  );
}
