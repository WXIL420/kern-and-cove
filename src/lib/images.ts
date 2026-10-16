import type { ArtView } from "./products";

/** File-name slug for a colour, e.g. "Charcoal & Stone" -> "charcoal-stone". Mirrors scripts/render-products.mjs. */
export function colorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function productImageSrc(slug: string, colorName: string, view: ArtView): string {
  return `/products/${slug}/${colorSlug(colorName)}-${view}.webp`;
}

export const HERO_IMAGE = { src: "/images/hero-desk.webp", width: 1000, height: 1200 };
