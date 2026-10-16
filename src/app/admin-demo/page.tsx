import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin demonstration",
  description:
    "A merchant dashboard with revenue, orders and inventory, built on fictional Kern & Cove store data.",
  alternates: { canonical: "/admin-demo" },
  robots: { index: false },
};

export default function AdminDemoPage() {
  return <AdminDashboard />;
}
