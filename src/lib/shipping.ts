export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_RATE = 9;
export const DEMO_TAX_RATE = 0.07;

export type ShippingMethodId = "standard" | "expedited" | "overnight";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  eta: string;
  rate: number;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: "standard", label: "Standard", eta: "5–7 business days", rate: STANDARD_SHIPPING_RATE },
  { id: "expedited", label: "Expedited", eta: "2–3 business days", rate: 18 },
  { id: "overnight", label: "Overnight", eta: "Next business day", rate: 32 },
];

export function shippingCost(subtotal: number, method: ShippingMethodId = "standard"): number {
  if (subtotal <= 0) return 0;
  const m = SHIPPING_METHODS.find((s) => s.id === method) ?? SHIPPING_METHODS[0];
  if (m.id === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return m.rate;
}

export function estimateTax(subtotal: number): number {
  return Math.round(subtotal * DEMO_TAX_RATE * 100) / 100;
}
