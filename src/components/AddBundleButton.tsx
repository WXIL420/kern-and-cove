"use client";

import { ShoppingBag } from "lucide-react";
import { addToCart } from "@/lib/cart-store";
import type { Product } from "@/lib/products";

export function AddBundleButton({ product }: { product: Product }) {
  const soldOut = product.inventory <= 0;
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => addToCart(product.slug, product.colors[0].name, 1)}
      className="btn btn-light"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      {soldOut ? "Sold out" : "Add the bundle to cart"}
    </button>
  );
}
