import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "A checkout demonstration with validated contact and shipping fields. No payment is collected and no order is submitted.",
  alternates: { canonical: "/checkout" },
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
