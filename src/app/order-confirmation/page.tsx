import { Suspense } from "react";
import type { Metadata } from "next";
import { ConfirmationClient } from "@/components/ConfirmationClient";

export const metadata: Metadata = {
  title: "Order confirmation",
  description: "Your order number and summary from the Kern & Cove checkout demonstration.",
  alternates: { canonical: "/order-confirmation" },
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap py-16" aria-busy="true" aria-label="Loading your order">
          <div className="skeleton h-16 w-96 max-w-full" />
        </div>
      }
    >
      <ConfirmationClient />
    </Suspense>
  );
}
