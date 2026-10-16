import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Demo checkout",
  description: "A demonstration checkout for the Kern & Cove portfolio project. No payment is collected.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
