# Kern & Cove

A custom e-commerce portfolio demonstration built to showcase product discovery, filtering, merchandising, cart state, checkout UX and merchant-facing administration.

Kern & Cove is a fictional desk-accessory and workspace-organization brand. **It is not a real store:** nothing is for sale, no payment is collected, no order is submitted or fulfilled, and the admin data is invented. The storefront is built from scratch and does not use a commerce platform, payment provider, database or CMS.

## Routes

| Route                 | What it shows                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                   | Hero, featured products, best sellers, bundle feature, brand philosophy, use cases, email signup                                     |
| `/shop`               | Search, category and in-stock filters, price sorting, active-filter chips, mobile filter drawer, empty state. State lives in the URL |
| `/products/[slug]`    | Gallery, color and quantity selection, stock state, specs, accordion, recommendations, sticky mobile purchase bar, JSON-LD           |
| `/cart`               | Quantity controls, free-shipping progress, estimated shipping and tax. A cart drawer is available site-wide                          |
| `/checkout`           | Validated contact and shipping fields, shipping methods, disabled payment presentation, order summary                                |
| `/order-confirmation` | Generated order number and summary                                                                                                   |
| `/about`              | Brand thinking, shipping and returns, how the project is built                                                                       |
| `/admin-demo`         | Revenue, orders, average order value, low-stock count, searchable and filterable order and inventory tables, mock fulfillment        |

`/shop` accepts `?category=Desk`, `?stock=1`, `?sort=price-asc|price-desc|name` and `?q=felt`, so filtered views can be linked.

## Technology

- Next.js (App Router), React and TypeScript
- Tailwind CSS v4 with a custom palette: off-white `#F4F1EA`, charcoal `#191B19`, deep olive `#39483B`, stone `#C9C2B5`, clay `#B45F43`
- Three.js, Playwright and Sharp (offline image rendering only; none are shipped to the browser)
- Newsreader (headings) and Hanken Grotesk (interface) through `next/font`
- Lucide icons
- ESLint and Prettier

## Local setup

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
npm run format       # Prettier (format:check to verify only)
npm run lint
npm run typecheck
npm run build && npm start
```

## Product data

Catalog data is plain TypeScript in `src/lib/products.ts`. Each `Product` has:

```ts
{
  id, slug, name, category, price,
  shortDescription, longDescription,
  benefits: [string, string, string],
  materials: string[], dimensions: string[],
  colors: { name, hex }[],          // 2–3 variants
  inventory: number,                // 0 = sold out, 1–8 = low stock
  featured: boolean, bestSellerRank?: number,
  includes?: string[],              // bundles only
  images: { view, alt }[],          // three views: studio, side, detail
  recommendedIds: string[],
}
```

Shipping rules (`src/lib/shipping.ts`) and the seeded admin orders (`src/lib/admin-data.ts`) are also local. Seed order totals are computed with the same shipping and tax functions the checkout uses.

## Cart state

`src/lib/cart-store.ts` is a small external store read with `useSyncExternalStore`:

- State is a list of `{ slug, color, qty }` lines, persisted to `localStorage` (`kern-cove-cart-v1`) and synced across tabs through the `storage` event.
- The server snapshot is empty, so the first client render matches the server HTML; the real cart appears after hydration (`useHydrated` gates empty states to avoid a flash).
- Everything read from storage is sanitized: unknown products, sold-out products, non-numeric or negative quantities and unknown variants are dropped or clamped, duplicate lines merge, and quantity is capped by inventory (and 10 per line).
- Totals, shipping and counts are derived from lines and the catalog, never stored.

Placed demo orders are saved separately in `localStorage` (`kern-cove-orders-v1`) so the confirmation page and admin dashboard can show them.

## Demo limitations

- No payment is collected. The payment fields are disabled and cannot receive card details. No data leaves the browser.
- Orders exist only in the browser that created them. Admin actions (fulfillment, restocking) change browser state and reset on refresh; they do not affect the storefront.
- Shipping rates, tax (a flat 7%) and delivery estimates are illustrative.
- Inventory is static data, not a live stock system.

## Images

There is no photography and no stock imagery. Every product image is a 3D render produced from code in this repository:

- `scripts/render/scene.js` is a small Three.js studio. It models each product (felt, oak, anodized aluminum, mineral composite, waxed canvas and linen) with procedural textures, physically based materials, a soft key light, a rim light and an environment map, and renders it on a seamless warm backdrop with soft contact shadows.
- `scripts/render-products.mjs` drives it with headless Chromium (Playwright), renders three views of every colourway (three-quarter, low side angle and a close detail) plus the homepage desk scene, and writes WebP files with Sharp.
- Output lives in `public/products/<slug>/<colour>-<view>.webp` and `public/images/hero-desk.webp`. Next.js then serves AVIF or WebP at the right size through `next/image`, and every image container reserves its aspect ratio, so there is no layout shift.

To regenerate:

```bash
npm run render:images                                   # all products and views (~15 minutes)
node scripts/render-products.mjs --only ridge-desk-mat   # one product
node scripts/render-products.mjs --size 700 --out /tmp/preview   # quick low-res preview
```

The renders are CGI, not photographs, and the catalogue is not real merchandise. Image models or photography were not used.

## SEO

Per-page titles, descriptions and canonical URLs; Open Graph and Twitter metadata with generated images (site and per product); favicon (`src/app/icon.svg`); `sitemap.xml` and `robots.txt`; and `Product` JSON-LD on each product page. The structured data states the price and availability and includes a line marking it as a portfolio demonstration product. It contains no ratings or reviews.

## Deployment

1. Push the repository to GitHub.
2. In Vercel choose **Add New → Project**, import the repository and accept the detected Next.js settings. No environment variables are required.
3. Deploy.

Or from the CLI: `vercel` (preview) and `vercel --prod` (production).

Optionally set `NEXT_PUBLIC_SITE_URL` (for example `https://your-domain.com`) so canonical, sitemap and Open Graph URLs use your domain. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used automatically when it is not set.

## Accessibility

Skip link; labelled form controls with inline errors and an error summary; focus-trapped drawers that return focus and close on Escape; `aria-current` navigation; live regions for cart and admin actions; a visible focus ring; colour choices that show a check mark and name, not colour alone; and reduced-motion support.
