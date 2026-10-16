import { CATEGORIES, type Category, type Product } from "./products";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export interface ShopFilters {
  q: string;
  category: Category | "";
  inStock: boolean;
  sort: SortKey;
}

export function parseCategory(value: string | null): Category | "" {
  return CATEGORIES.find((c) => c === value) ?? "";
}

export function parseSort(value: string | null): SortKey {
  return SORT_OPTIONS.find((o) => o.value === value)?.value ?? "featured";
}

export function filterProducts(all: Product[], f: ShopFilters): Product[] {
  const q = f.q.trim().toLowerCase();
  const list = all.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.inStock && p.inventory <= 0) return false;
    if (!q) return true;
    const haystack = [p.name, p.category, p.shortDescription, p.longDescription, ...p.materials, ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((term) => haystack.includes(term));
  });

  const featuredOrder = new Map(all.map((p, i) => [p.id, i]));
  list.sort((a, b) => {
    switch (f.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default: {
        const fa = a.featured ? 0 : 1;
        const fb = b.featured ? 0 : 1;
        return fa - fb || (featuredOrder.get(a.id) ?? 0) - (featuredOrder.get(b.id) ?? 0);
      }
    }
  });
  return list;
}
