import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient, ShopSkeleton } from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Browse the Kern & Cove collection of desk mats, laptop stands, trays, notebooks and bundles. Filter by category, search, and sort by price.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopClient />
    </Suspense>
  );
}
