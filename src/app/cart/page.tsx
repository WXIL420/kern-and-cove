import type { Metadata } from "next";
import { CartPageClient } from "@/components/CartPageClient";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your Kern & Cove demonstration cart.",
};

export default function CartPage() {
  return <CartPageClient />;
}
