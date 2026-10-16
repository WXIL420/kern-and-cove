import type { Metadata } from "next";
import { CartPageClient } from "@/components/CartPageClient";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the pieces in your cart, adjust quantities and see your free-shipping progress.",
  alternates: { canonical: "/cart" },
  robots: { index: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
