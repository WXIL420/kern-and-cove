"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { Drawer } from "./Drawer";
import { openCart, useCart } from "@/lib/cart-store";
import { CATEGORIES } from "@/lib/products";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Bundles", label: "Bundles" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    const path = href.split("?")[0];
    if (href.includes("?")) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone/70 bg-paper">
      <div className="wrap flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <div className="flex flex-1 items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 grid size-11 place-items-center transition-colors hover:text-clay-deep"
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>

        <Logo className="lg:mr-4" />

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-clay-deep ${
                isActive(item.href)
                  ? "text-ink underline decoration-clay decoration-2 underline-offset-[10px]"
                  : "text-ink/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 lg:flex-none">
          <Link
            href="/admin-demo"
            className="mr-3 hidden text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay-deep xl:inline"
          >
            Admin demo
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative -mr-2 grid size-11 place-items-center transition-colors hover:text-clay-deep"
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <ShoppingBag className="size-[1.4rem]" aria-hidden="true" />
            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-0 top-1 grid min-w-[1.1rem] place-items-center rounded-full bg-clay-deep px-1 text-[0.65rem] font-bold leading-[1.1rem] text-white"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu" side="left" width="max-w-sm">
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-6">
          <Logo className="mb-10" />
          <nav aria-label="Mobile" className="flex flex-col">
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="display flex items-center justify-between border-b border-stone/70 py-4 text-3xl"
            >
              Shop all <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/shop?category=${c}`}
                onClick={() => setMenuOpen(false)}
                className="border-b border-stone/40 py-3.5 text-base text-ink/85 transition-colors hover:text-clay-deep"
              >
                {c}
              </Link>
            ))}
            <Link href="/about" onClick={() => setMenuOpen(false)} className="display mt-6 text-3xl">
              About
            </Link>
            <Link
              href="/admin-demo"
              onClick={() => setMenuOpen(false)}
              className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted"
            >
              Admin demo
            </Link>
          </nav>
          <span className="mt-auto" />
        </div>
      </Drawer>
    </header>
  );
}
