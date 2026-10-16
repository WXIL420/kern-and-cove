import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const sans = Hanken_Grotesk({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

const serif = Newsreader({
  variable: "--font-serif-face",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description =
  "Kern & Cove is a fictional desk-accessory brand: a portfolio e-commerce project. Browse the collection, fill a cart and try a demo checkout. Nothing is for sale.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kern & Cove — A quieter way to work",
    template: "%s — Kern & Cove",
  },
  description,
  applicationName: "Kern & Cove",
  keywords: ["desk accessories", "workspace organization", "portfolio project", "Next.js e-commerce demo"],
  openGraph: {
    type: "website",
    siteName: "Kern & Cove",
    title: "Kern & Cove — A quieter way to work",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kern & Cove — A quieter way to work",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F1EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
