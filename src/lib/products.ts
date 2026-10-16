export type Category = "Desk" | "Organization" | "Stationery" | "Carry" | "Bundles";

export const CATEGORIES: Category[] = ["Desk", "Organization", "Stationery", "Carry", "Bundles"];

export type ArtView = "studio" | "tonal" | "detail" | "workspace";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  view: ArtView;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  shortDescription: string;
  longDescription: string;
  benefits: [string, string, string];
  materials: string[];
  dimensions: string[];
  colors: ProductColor[];
  inventory: number;
  featured: boolean;
  bestSellerRank?: number;
  includes?: string[];
  images: ProductImage[];
  recommendedIds: string[];
}

const views = (subject: string): ProductImage[] => [
  { view: "studio", alt: `${subject} photographed alone on a warm studio backdrop` },
  { view: "tonal", alt: `${subject} against a deep olive background` },
  { view: "detail", alt: `Close detail of the ${subject}` },
  { view: "workspace", alt: `${subject} in a quiet, organized workspace` },
];

export const LOW_STOCK_THRESHOLD = 8;

export const products: Product[] = [
  {
    id: "kc-001",
    slug: "ridge-desk-mat",
    name: "Ridge Desk Mat",
    category: "Desk",
    price: 89,
    shortDescription: "A felt-topped mat with a ribbed grip that anchors the whole desk.",
    longDescription:
      "The Ridge Desk Mat gives your keyboard, mouse and elbows a calm, consistent surface. A dense wool-blend felt top softens the sound of every keystroke, while a fine ribbed pattern in the weave gives it a tactile, architectural character. The underside is a natural rubber grip that stays put without adhesive, and the edges are bound and stitched by hand so they never curl.",
    benefits: [
      "Dampens keyboard and mouse noise for quieter hours",
      "Natural rubber underside grips without leaving residue",
      "Bound edges lie flat and resist fraying",
    ],
    materials: ["Wool-blend felt top", "Natural rubber base", "Bound and stitched edges"],
    dimensions: ["31.5 × 15.7 in (80 × 40 cm)", "0.12 in (3 mm) thick", "1.4 lb (0.6 kg)"],
    colors: [
      { name: "Charcoal", hex: "#2B2D2B" },
      { name: "Deep Olive", hex: "#4A5B4D" },
      { name: "Oat", hex: "#D6CDBB" },
    ],
    inventory: 42,
    featured: true,
    bestSellerRank: 2,
    images: views("Ridge Desk Mat"),
    recommendedIds: ["kc-004", "kc-002", "kc-008"],
  },
  {
    id: "kc-002",
    slug: "axis-laptop-stand",
    name: "Axis Laptop Stand",
    category: "Desk",
    price: 119,
    shortDescription: "A sculpted aluminum stand that lifts your screen to eye level.",
    longDescription:
      "Axis raises a laptop to a healthier viewing height and opens up the desk underneath for a keyboard, a notebook or nothing at all. It is machined from a single run of anodized aluminum, with a slim profile that reads as furniture rather than equipment. Silicone pads cradle the laptop without marking it, and the stand folds flat in under a second for travel days.",
    benefits: [
      "Raises the screen toward eye level to reduce neck strain",
      "Folds flat to under half an inch for carrying",
      "Open frame keeps the laptop cooler under load",
    ],
    materials: ["Anodized aluminum frame", "Silicone contact pads", "Brushed matte finish"],
    dimensions: ["10.2 × 9.4 in (26 × 24 cm) open", "Folds to 0.4 in (1 cm)", "Supports up to 22 lb (10 kg)"],
    colors: [
      { name: "Raw Aluminum", hex: "#BDBBB4" },
      { name: "Graphite", hex: "#3B3D3C" },
    ],
    inventory: 18,
    featured: true,
    bestSellerRank: 1,
    images: views("Axis Laptop Stand"),
    recommendedIds: ["kc-001", "kc-005", "kc-008"],
  },
  {
    id: "kc-003",
    slug: "arc-monitor-shelf",
    name: "Arc Monitor Shelf",
    category: "Desk",
    price: 149,
    shortDescription: "A bridge-shaped shelf that frees the desk beneath your display.",
    longDescription:
      "Arc is a low bridge for your monitor, with a generous archway below for a keyboard to slide away when you are thinking rather than typing. The top is solid oak with a hand-rubbed oil finish; the legs are powder-coated steel with felt feet. It adds just enough height to bring a display up to eye level and gives the lamp, the plant and the notebook somewhere to live.",
    benefits: [
      "Archway stores a keyboard or notebook out of sight",
      "Lifts a display 4.5 in to a comfortable viewing height",
      "Oiled oak surface ages gracefully with use",
    ],
    materials: ["Solid white oak top", "Powder-coated steel legs", "Felt-lined feet"],
    dimensions: [
      "22 × 8.5 × 4.5 in (56 × 21.5 × 11.5 cm)",
      "Supports up to 44 lb (20 kg)",
      "6.2 lb (2.8 kg)",
    ],
    colors: [
      { name: "Natural Oak", hex: "#B99A72" },
      { name: "Charcoal", hex: "#2F312F" },
    ],
    inventory: 7,
    featured: true,
    bestSellerRank: 5,
    images: views("Arc Monitor Shelf"),
    recommendedIds: ["kc-002", "kc-005", "kc-001"],
  },
  {
    id: "kc-004",
    slug: "cove-valet-tray",
    name: "Cove Valet Tray",
    category: "Organization",
    price: 54,
    shortDescription: "A shallow, curved tray for the small things you reach for daily.",
    longDescription:
      "Cove is a soft-edged tray for keys, a watch, earbuds and the pen you keep losing. The shallow basin is molded from a dense, matte-finished composite that feels closer to ceramic than plastic, and the rubberized underside keeps it quiet on any surface. It is small enough to live on a desk and elegant enough to move to an entryway.",
    benefits: [
      "Gives small essentials a single, consistent home",
      "Shallow curve makes items easy to see and grab",
      "Rubberized base will not slide or clatter",
    ],
    materials: ["Matte mineral composite", "Rubberized base", "Hand-finished rim"],
    dimensions: ["9.8 × 6.3 × 0.9 in (25 × 16 × 2.3 cm)", "1.1 lb (0.5 kg)"],
    colors: [
      { name: "Clay", hex: "#B45F43" },
      { name: "Charcoal", hex: "#2B2D2B" },
      { name: "Stone", hex: "#B9B1A2" },
    ],
    inventory: 31,
    featured: true,
    bestSellerRank: 4,
    images: views("Cove Valet Tray"),
    recommendedIds: ["kc-005", "kc-006", "kc-001"],
  },
  {
    id: "kc-005",
    slug: "line-cable-dock",
    name: "Line Cable Dock",
    category: "Organization",
    price: 34,
    shortDescription: "A weighted dock that keeps charging cables exactly where you left them.",
    longDescription:
      "Line is a small, weighted block with three precision-cut channels that hold charging cables upright and ready. No more reaching behind the desk or watching a cable slip to the floor. The base is heavy enough to stay put when you pull a cable free with one hand, and a rubber ring underneath protects whatever surface it sits on.",
    benefits: [
      "Three channels hold cables in place for one-handed use",
      "Weighted body stays put when you unplug",
      "Fits USB-C, Lightning and micro-USB connectors",
    ],
    materials: ["Powder-coated zinc alloy", "Silicone channel inserts", "Rubber base ring"],
    dimensions: ["3.4 × 1.6 × 1.0 in (8.6 × 4 × 2.5 cm)", "0.9 lb (0.4 kg)"],
    colors: [
      { name: "Charcoal", hex: "#2B2D2B" },
      { name: "Stone", hex: "#B9B1A2" },
    ],
    inventory: 0,
    featured: false,
    bestSellerRank: 6,
    images: views("Line Cable Dock"),
    recommendedIds: ["kc-004", "kc-002", "kc-007"],
  },
  {
    id: "kc-006",
    slug: "field-notebook-set",
    name: "Field Notebook Set",
    category: "Stationery",
    price: 28,
    shortDescription: "Three pocket notebooks with a pencil, bound for ideas away from the screen.",
    longDescription:
      "The Field Notebook Set is made for the thoughts that arrive when you are not at your desk. Each of the three notebooks has 48 pages of heavy, fountain-pen-friendly paper with a faint dot grid, sewn into a soft cover that bends without cracking. A cedar pencil and an elastic closure keep everything together in a coat pocket or bag.",
    benefits: [
      "Dot grid supports lists, sketches and diagrams alike",
      "Lay-flat binding is comfortable to write on",
      "Three notebooks let you separate projects cleanly",
    ],
    materials: ["100 gsm acid-free paper", "Soft linen-textured cover", "Cedar pencil"],
    dimensions: ["3.5 × 5.5 in (9 × 14 cm) each", "48 pages per notebook", "0.3 lb (0.15 kg) for the set"],
    colors: [
      { name: "Deep Olive", hex: "#4A5B4D" },
      { name: "Clay", hex: "#B45F43" },
      { name: "Oat", hex: "#D6CDBB" },
    ],
    inventory: 64,
    featured: false,
    bestSellerRank: 3,
    images: views("Field Notebook Set"),
    recommendedIds: ["kc-004", "kc-007", "kc-001"],
  },
  {
    id: "kc-007",
    slug: "carry-tech-pouch",
    name: "Carry Tech Pouch",
    category: "Carry",
    price: 68,
    shortDescription: "A structured zip pouch that keeps chargers and small tools in order.",
    longDescription:
      "Carry holds the contents of a tangled bag drawer in one tidy shape. A softly structured body protects chargers, adapters, earbuds and a mouse, while a pair of elastic loops and a flat interior pocket give each item its place. The water-resistant waxed canvas exterior is tough but quiet, and the oversized zipper pull is easy to find without looking.",
    benefits: [
      "Interior loops and pocket keep every cable separate",
      "Waxed canvas shrugs off rain and daily wear",
      "Holds its shape so it is easy to pack and unpack",
    ],
    materials: ["Waxed cotton canvas", "Recycled twill lining", "Metal zipper with leather pull"],
    dimensions: ["9.4 × 5.9 × 2.4 in (24 × 15 × 6 cm)", "0.5 lb (0.23 kg)"],
    colors: [
      { name: "Deep Olive", hex: "#4A5B4D" },
      { name: "Charcoal", hex: "#2B2D2B" },
      { name: "Sand", hex: "#C9B99B" },
    ],
    inventory: 5,
    featured: false,
    bestSellerRank: 7,
    images: views("Carry Tech Pouch"),
    recommendedIds: ["kc-005", "kc-006", "kc-002"],
  },
  {
    id: "kc-008",
    slug: "focus-workspace-bundle",
    name: "Focus Workspace Bundle",
    category: "Bundles",
    price: 219,
    shortDescription: "Our core desk set, chosen to work together and priced to be simple.",
    longDescription:
      "The Focus Workspace Bundle brings together four pieces that make a desk feel finished: the Ridge Desk Mat, the Axis Laptop Stand, the Cove Valet Tray and the Field Notebook Set. Colors are coordinated so everything reads as one calm palette. Purchased separately the set would be $290; as a bundle it is $219, a saving of $71.",
    benefits: [
      "Four coordinated pieces in a single, consistent palette",
      "Saves $71 compared with buying each item separately",
      "Everything you need for a quiet, organized desk",
    ],
    materials: ["Wool-blend felt", "Anodized aluminum", "Mineral composite", "Acid-free paper"],
    dimensions: [
      "Desk mat 31.5 × 15.7 in (80 × 40 cm)",
      "Stand folds to 0.4 in (1 cm)",
      "Tray 9.8 × 6.3 in (25 × 16 cm)",
    ],
    colors: [
      { name: "Charcoal & Stone", hex: "#2B2D2B" },
      { name: "Olive & Oat", hex: "#4A5B4D" },
    ],
    inventory: 12,
    featured: true,
    bestSellerRank: 8,
    includes: ["Ridge Desk Mat", "Axis Laptop Stand", "Cove Valet Tray", "Field Notebook Set"],
    images: views("Focus Workspace Bundle"),
    recommendedIds: ["kc-003", "kc-005", "kc-007"],
  },
];

export const BUNDLE_SEPARATE_TOTAL = 89 + 119 + 54 + 28;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export type StockState = "in" | "low" | "out";

export function stockState(inventory: number): StockState {
  if (inventory <= 0) return "out";
  if (inventory <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}
