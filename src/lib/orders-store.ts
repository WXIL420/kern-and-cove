"use client";

import { useSyncExternalStore } from "react";
import type { ShippingMethodId } from "./shipping";

const STORAGE_KEY = "kern-cove-orders-v1";

export type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderLine {
  slug: string;
  name: string;
  color: string;
  qty: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface DemoOrder {
  number: string;
  placedAt: string;
  customerName: string;
  email: string;
  address: ShippingAddress;
  shippingMethod: ShippingMethodId;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  /** True for orders placed through the demo checkout in this browser. */
  local?: boolean;
}

const EMPTY: DemoOrder[] = [];

let cachedRaw: string | null = null;
let cached: DemoOrder[] = EMPTY;
const listeners = new Set<() => void>();
let listening = false;

function read(): DemoOrder[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed) ? (parsed as DemoOrder[]) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!listening && typeof window !== "undefined") {
    listening = true;
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) listeners.forEach((l) => l());
    });
  }
  return () => {
    listeners.delete(listener);
  };
}

export function saveOrder(order: DemoOrder) {
  const next = [{ ...order, local: true }, ...read().filter((o) => o.number !== order.number)].slice(0, 25);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore — confirmation falls back to the not-found state */
  }
  listeners.forEach((l) => l());
}

export function useLocalOrders(): DemoOrder[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function generateOrderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `KC-${n}`;
}
