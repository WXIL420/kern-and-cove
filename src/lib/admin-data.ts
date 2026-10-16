import type { OrderStatus } from "./orders-store";
import type { DemoOrder } from "./orders-store";
import { getProduct } from "./products";
import { estimateTax, shippingCost, type ShippingMethodId } from "./shipping";

type SeedLine = [slug: string, color: string, qty: number];

interface Seed {
  number: string;
  date: string;
  name: string;
  city: string;
  state: string;
  status: OrderStatus;
  method: ShippingMethodId;
  lines: SeedLine[];
}

const SEEDS: Seed[] = [
  { number: "KC-100482", date: "2026-10-14T16:20:00Z", name: "Imani Brooks", city: "Portland", state: "OR", status: "Processing", method: "standard", lines: [["focus-workspace-bundle", "Olive & Oat", 1]] },
  { number: "KC-100481", date: "2026-10-14T11:05:00Z", name: "Theo Lindqvist", city: "Minneapolis", state: "MN", status: "Processing", method: "expedited", lines: [["axis-laptop-stand", "Graphite", 1], ["cove-valet-tray", "Charcoal", 1]] },
  { number: "KC-100480", date: "2026-10-13T19:42:00Z", name: "Priya Raman", city: "Austin", state: "TX", status: "Packed", method: "standard", lines: [["ridge-desk-mat", "Deep Olive", 1], ["field-notebook-set", "Clay", 2]] },
  { number: "KC-100479", date: "2026-10-13T08:15:00Z", name: "Callum Doyle", city: "Boston", state: "MA", status: "Shipped", method: "overnight", lines: [["arc-monitor-shelf", "Natural Oak", 1]] },
  { number: "KC-100478", date: "2026-10-12T17:30:00Z", name: "Noor Haddad", city: "Chicago", state: "IL", status: "Shipped", method: "standard", lines: [["carry-tech-pouch", "Charcoal", 1], ["line-cable-dock", "Stone", 2]] },
  { number: "KC-100477", date: "2026-10-12T09:48:00Z", name: "Gabriel Okafor", city: "Atlanta", state: "GA", status: "Delivered", method: "standard", lines: [["ridge-desk-mat", "Charcoal", 1], ["axis-laptop-stand", "Raw Aluminum", 1]] },
  { number: "KC-100476", date: "2026-10-11T14:12:00Z", name: "Sasha Petrov", city: "Denver", state: "CO", status: "Delivered", method: "expedited", lines: [["focus-workspace-bundle", "Charcoal & Stone", 1], ["carry-tech-pouch", "Deep Olive", 1]] },
  { number: "KC-100475", date: "2026-10-10T20:03:00Z", name: "Lena Whitfield", city: "Seattle", state: "WA", status: "Delivered", method: "standard", lines: [["cove-valet-tray", "Clay", 1]] },
  { number: "KC-100474", date: "2026-10-09T13:27:00Z", name: "Mateo Ruiz", city: "Phoenix", state: "AZ", status: "Cancelled", method: "standard", lines: [["arc-monitor-shelf", "Charcoal", 1], ["field-notebook-set", "Oat", 1]] },
  { number: "KC-100473", date: "2026-10-08T10:50:00Z", name: "Amelia Cho", city: "San Diego", state: "CA", status: "Delivered", method: "standard", lines: [["axis-laptop-stand", "Graphite", 2]] },
  { number: "KC-100472", date: "2026-10-07T18:36:00Z", name: "Jonah Feldman", city: "Brooklyn", state: "NY", status: "Delivered", method: "overnight", lines: [["ridge-desk-mat", "Oat", 1], ["cove-valet-tray", "Stone", 1], ["field-notebook-set", "Deep Olive", 1]] },
  { number: "KC-100471", date: "2026-10-06T15:09:00Z", name: "Rosa Delgado", city: "Nashville", state: "TN", status: "Delivered", method: "standard", lines: [["field-notebook-set", "Clay", 1]] },
  { number: "KC-100470", date: "2026-10-05T12:44:00Z", name: "Anders Nyberg", city: "Madison", state: "WI", status: "Delivered", method: "standard", lines: [["focus-workspace-bundle", "Olive & Oat", 1]] },
  { number: "KC-100469", date: "2026-10-03T09:21:00Z", name: "Kiara Mensah", city: "Raleigh", state: "NC", status: "Delivered", method: "expedited", lines: [["arc-monitor-shelf", "Natural Oak", 1], ["line-cable-dock", "Charcoal", 1]] },
  { number: "KC-100468", date: "2026-10-01T16:58:00Z", name: "Owen Gallagher", city: "Salt Lake City", state: "UT", status: "Delivered", method: "standard", lines: [["carry-tech-pouch", "Sand", 1], ["ridge-desk-mat", "Deep Olive", 1]] },
];

function emailFor(name: string) {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
}

function build(seed: Seed): DemoOrder {
  const lines = seed.lines.map(([slug, color, qty]) => {
    const p = getProduct(slug)!;
    return { slug, name: p.name, color, qty, price: p.price };
  });
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = shippingCost(subtotal, seed.method);
  const tax = estimateTax(subtotal);
  const [first, ...rest] = seed.name.split(" ");
  return {
    number: seed.number,
    placedAt: seed.date,
    customerName: seed.name,
    email: emailFor(seed.name),
    address: {
      firstName: first,
      lastName: rest.join(" "),
      address1: "Fictional address",
      city: seed.city,
      state: seed.state,
      postalCode: "00000",
      country: "United States",
    },
    shippingMethod: seed.method,
    lines,
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    status: seed.status,
  };
}

export const SEED_ORDERS: DemoOrder[] = SEEDS.map(build);

export const ORDER_STATUSES: OrderStatus[] = ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"];

export const NEXT_STATUS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  Processing: { next: "Packed", label: "Mark packed" },
  Packed: { next: "Shipped", label: "Mark shipped" },
  Shipped: { next: "Delivered", label: "Mark delivered" },
};
