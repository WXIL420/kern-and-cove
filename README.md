# Kern & Cove

**A quieter way to work.** Kern & Cove is a fictional premium desk-accessory and workspace-organization brand, built as a portfolio e-commerce project.

> **This is a portfolio demonstration, not a real store.** No payment is ever collected, no order is fulfilled, the testimonials are fictional, and the admin data is invented. Nothing is sent to a server.

## What is inside

| Route | Purpose |
| --- | --- |
| `/` | Homepage: hero, featured products, best sellers, bundle feature, philosophy, fictional testimonials, email signup |
| `/shop` | Product grid with search, category and in-stock filters, price sorting, active filter chips, mobile filter drawer, empty state. Filters live in the URL (`?category=Desk&stock=1&sort=price-asc&q=felt`) |
| `/products/[slug]` | Gallery, color and quantity selectors, stock state, benefits, specs, shipping/returns accordion, recommendations, sticky mobile purchase bar |
| `/cart` | Full cart with quantity controls, free-shipping progress, estimated shipping and tax. A cart drawer is available site-wide |
| `/checkout` | Demo checkout with validated contact and shipping fields, shipping methods, and a deliberately disabled payment presentation |
| `/order-confirmation` | Confirmation for a fictional order number (`KC-######`) |
| `/about` | Brand story, shipping and returns, and notes on how the project is built |
| `/admin-demo` | Merchant dashboard on fictional data: revenue, order count, AOV, low-stock count, searchable and filterable orders and inventory, mock fulfillment actions |

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS v4 with a custom palette (warm off-white `#F4F1EA`, charcoal `#191B19`, deep olive `#39483B`, stone `#C9C2B5`, clay `#B45F43`)
- Newsreader (headings) and Hanken Grotesk (interface) via `next/font`
- Lucide icons
- Local TypeScript data in `src/lib/products.ts` and `src/lib/admin-data.ts`
- Cart state in a small external store (`src/lib/cart-store.ts`) read with `useSyncExternalStore` and persisted to `localStorage`
- Product imagery is original SVG illustration (`src/components/ProductArt.tsx`), so the project has no image licensing or hosting dependencies
- No Supabase, Stripe, CMS or database

## How the demo behaves

- **Cart** is saved to `localStorage` (`kern-cove-cart-v1`) and survives a refresh. Quantities are capped by inventory (and 10 per line).
- **Checkout** validates email, name, street address, city, state and ZIP. Payment inputs are disabled and cannot receive card data. On submit, a fictional order is saved to `localStorage` in the same browser (`kern-cove-orders-v1`) and the cart is cleared. Nothing leaves the browser.
- **Admin demo** merges orders you place in the demo checkout with a set of fictional seed orders. Fulfillment actions and stock adjustments change browser state only and reset on refresh ("Reset demo data" restores the originals).
- One product (Line Cable Dock) is intentionally sold out, and two are low stock, to exercise those states.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm start
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel choose **Add New → Project**, import the repository, and accept the detected Next.js settings. No environment variables are required.
3. Deploy.

Or from the command line:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

Optional: set `NEXT_PUBLIC_SITE_URL` (for example `https://your-domain.com`) so canonical and Open Graph URLs use your custom domain. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used automatically when it is not set.

## Project structure

```
src/
  app/            Routes, metadata, favicon (icon.svg), Open Graph image, sitemap, robots
  components/     UI components (header, drawers, product cards, checkout, admin, art)
  lib/            Product and order data, cart store, validation, shipping rules, formatting
```

## Accessibility notes

Skip link, labelled form controls with inline errors and an error summary, focus-trapped drawers with Escape to close, `aria-current` navigation, a live region for cart and admin actions, visible focus styles, and reduced-motion support.
