// Renders the product catalogue to WebP with the Three.js studio in scripts/render.
//   node scripts/render-products.mjs                   # everything
//   node scripts/render-products.mjs --only ridge-desk-mat --views studio --size 800
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";
import { products } from "../src/lib/products.ts";
import { serve } from "./render/serve.mjs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const only = opt("only", "");
const views = opt("views", "studio,side,detail").split(",");
const size = Number(opt("size", 1200));
const quality = Number(opt("quality", 84));
const out = opt("out", "public/products");

export const colorSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const server = await serve(4173);
const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
  ],
});
const page = await browser.newPage({ viewport: { width: size, height: size } });
page.on("pageerror", (e) => console.error("page error:", e.message));
page.on("console", (m) => m.type() === "error" && console.error("console:", m.text()));

async function renderOne({ query, file, w, h }) {
  const params = new URLSearchParams({ ...query, w: String(w), h: String(h) });
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`http://localhost:4173/scripts/render/index.html?${params}`);
  await page.waitForFunction(() => window.__done === true, null, { timeout: 120000 });
  const png = await page.locator("canvas").screenshot({ type: "png" });
  await sharp(png).webp({ quality, effort: 5 }).toFile(file);
}

try {
  if (!only || only === "hero") {
    await mkdir("public/images", { recursive: true });
    const file = "public/images/hero-desk.webp";
    await renderOne({
      query: { product: "hero", color: "#39483B", view: "studio" },
      file,
      w: Math.round((size * 5) / 6),
      h: size,
    });
    console.log(file);
  }
  for (const p of products) {
    if (only && p.slug !== only) continue;
    await mkdir(`${out}/${p.slug}`, { recursive: true });
    for (const color of p.colors) {
      for (const view of views) {
        const file = `${out}/${p.slug}/${colorSlug(color.name)}-${view}.webp`;
        const t = Date.now();
        await renderOne({ query: { product: p.slug, color: color.hex, view }, file, w: size, h: size });
        console.log(`${file} (${Date.now() - t} ms)`);
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}
