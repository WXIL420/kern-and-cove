"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getProduct, type Product, type ProductColor } from "./products";
import { shippingCost, FREE_SHIPPING_THRESHOLD } from "./shipping";

const STORAGE_KEY = "kern-cove-cart-v1";
export const MAX_PER_LINE = 10;

export interface CartLine {
  slug: string;
  color: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
}

const EMPTY: CartState = { lines: [], open: false };

let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

export function maxQty(product: Product): number {
  return Math.max(0, Math.min(product.inventory, MAX_PER_LINE));
}

function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { slug, color, qty } = entry as Partial<CartLine>;
    if (typeof slug !== "string" || typeof qty !== "number") continue;
    const product = getProduct(slug);
    if (!product) continue;
    const limit = maxQty(product);
    if (limit === 0) continue;
    const colorName =
      typeof color === "string" && product.colors.some((c) => c.name === color)
        ? color
        : product.colors[0].name;
    const q = Math.min(limit, Math.max(1, Math.floor(qty)));
    const existing = out.find((l) => l.slug === slug && l.color === colorName);
    if (existing) existing.qty = Math.min(limit, existing.qty + q);
    else out.push({ slug, color: colorName, qty: q });
  }
  return out;
}

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = { lines: readStorage(), open: false };
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    state = { ...state, lines: readStorage() };
    emit();
  });
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: CartState, persist: boolean) {
  state = next;
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.lines));
    } catch {
      /* storage unavailable — the cart still works for this session */
    }
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CartState {
  ensureLoaded();
  return state;
}

function getServerSnapshot(): CartState {
  return EMPTY;
}

export function addToCart(slug: string, color: string, qty = 1, openDrawer = true) {
  ensureLoaded();
  const product = getProduct(slug);
  if (!product) return;
  const limit = maxQty(product);
  if (limit === 0) return;
  const lines = state.lines.map((l) => ({ ...l }));
  const existing = lines.find((l) => l.slug === slug && l.color === color);
  if (existing) existing.qty = Math.min(limit, existing.qty + qty);
  else lines.push({ slug, color, qty: Math.min(limit, Math.max(1, qty)) });
  commit({ lines, open: openDrawer ? true : state.open }, true);
}

export function setLineQty(slug: string, color: string, qty: number) {
  ensureLoaded();
  const product = getProduct(slug);
  if (!product) return;
  const limit = maxQty(product);
  const lines = state.lines
    .map((l) =>
      l.slug === slug && l.color === color ? { ...l, qty: Math.min(limit, Math.floor(qty)) } : l,
    )
    .filter((l) => l.qty > 0);
  commit({ ...state, lines }, true);
}

export function removeLine(slug: string, color: string) {
  ensureLoaded();
  commit({ ...state, lines: state.lines.filter((l) => !(l.slug === slug && l.color === color)) }, true);
}

export function clearCart() {
  ensureLoaded();
  commit({ ...state, lines: [] }, true);
}

export function openCart() {
  ensureLoaded();
  commit({ ...state, open: true }, false);
}

export function closeCart() {
  ensureLoaded();
  if (!state.open) return;
  commit({ ...state, open: false }, false);
}

export interface CartItem {
  product: Product;
  color: ProductColor;
  qty: number;
  lineTotal: number;
}

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    const items: CartItem[] = [];
    for (const line of snapshot.lines) {
      const product = getProduct(line.slug);
      if (!product) continue;
      const color = product.colors.find((c) => c.name === line.color) ?? product.colors[0];
      items.push({ product, color, qty: line.qty, lineTotal: product.price * line.qty });
    }
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const shipping = shippingCost(subtotal, "standard");
    return {
      items,
      count,
      subtotal,
      shipping,
      remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      open: snapshot.open,
    };
  }, [snapshot]);
}

const noopSubscribe = () => () => {};

/** True once the client has hydrated — avoids flashing empty states from the server snapshot. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
