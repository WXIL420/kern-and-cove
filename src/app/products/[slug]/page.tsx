import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct, products, type Product } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };
  const title = `${product.name} — ${product.category}`;
  return {
    title,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      siteName: "Kern & Cove",
      title: `${product.name} — Kern & Cove`,
      description: product.shortDescription,
      url: `/products/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Kern & Cove`,
      description: product.shortDescription,
    },
  };
}

function productJsonLd(product: Product, baseUrl: string) {
  const url = `${baseUrl}/products/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: product.id.toUpperCase(),
    category: product.category,
    color: product.colors.map((c) => c.name),
    material: product.materials.join(", "),
    brand: { "@type": "Brand", name: "Kern & Cove" },
    url,
    // Marks this as demonstration merchandise so it is never read as a live listing.
    disambiguatingDescription:
      "Portfolio demonstration product from the fictional Kern & Cove brand. Not available for purchase.",
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      url,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD must be injected as a string; the data is static and escaped for "<".
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product, base)).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetail product={product} />
    </>
  );
}
