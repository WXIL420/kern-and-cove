import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const base =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/about", "/cart"].map((path) => ({ url: `${base}${path}` }));
  const items = products.map((p) => ({ url: `${base}/products/${p.slug}` }));
  return [...pages, ...items];
}
