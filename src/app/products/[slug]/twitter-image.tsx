import { notFound } from "next/navigation";
import { renderOg } from "@/lib/og";
import { getProduct, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export const alt = "Kern & Cove product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return renderOg({
    title: product.name,
    kicker: `${product.category} · ${formatPrice(product.price)} · ${product.colors.map((c) => c.name).join(", ")}`,
    footerLeft: "Kern & Cove",
    footerRight: "Portfolio demonstration · Not for sale",
  });
}
