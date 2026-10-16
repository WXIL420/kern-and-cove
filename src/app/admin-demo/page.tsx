import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin demonstration",
  description: "A merchant dashboard demonstration using fictional Kern & Cove store data.",
  robots: { index: false },
};

export default function AdminDemoPage() {
  return <AdminDashboard />;
}
