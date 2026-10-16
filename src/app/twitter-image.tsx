import { renderOg } from "@/lib/og";

export const alt = "Kern & Cove — A quieter way to work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg();
}
