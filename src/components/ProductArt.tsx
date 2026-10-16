import type { ArtView } from "@/lib/products";

/* ------------------------------------------------------------------ */
/* Original vector illustrations for every product.                    */
/* Each product is drawn once in a 600 × 600 space, then shown against */
/* four consistent backdrops (studio, tonal, detail, workspace).       */
/* ------------------------------------------------------------------ */

export function shade(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  const mix = (v: number) => Math.round(v + (target - v) * t);
  return `#${[mix(r), mix(g), mix(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/* Shared lighting, texture and shadow definitions. Light comes from the upper left. */
function ArtDefs() {
  return (
    <defs>
      <filter id="kc-lit" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feSpecularLighting
          in="blur"
          surfaceScale="3.2"
          specularConstant="0.75"
          specularExponent="24"
          lightingColor="#ffffff"
          result="spec"
        >
          <feDistantLight azimuth="235" elevation="46" />
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="noise" />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.2 -0.02"
          result="grain"
        />
        <feComposite in="grain" in2="SourceAlpha" operator="in" result="grainIn" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="grainIn" />
          <feMergeNode in="specIn" />
        </feMerge>
      </filter>
      <filter id="kc-wood" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.5" numOctaves="3" seed="8" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.16  0 0 0 0 0.08  0 0 0 1.5 -0.55" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
      <filter id="kc-felt" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="2" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.28" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
      <filter id="kc-blur-s" x="-20%" y="-200%" width="140%" height="500%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="kc-blur-l" x="-20%" y="-300%" width="140%" height="700%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
      <linearGradient id="kc-shade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.2" />
      </linearGradient>
      <radialGradient id="kc-room" cx="0.28" cy="0.15" r="0.95">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Shadow({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse
        cx={cx + 16}
        cy={cy + 5}
        rx={rx}
        ry={ry * 1.7}
        fill="#1b1a17"
        opacity={0.17}
        filter="url(#kc-blur-l)"
      />
      <ellipse
        cx={cx + 7}
        cy={cy}
        rx={rx * 0.95}
        ry={ry * 0.6}
        fill="#1b1a17"
        opacity={0.4}
        filter="url(#kc-blur-s)"
      />
    </g>
  );
}

const SHADOWS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  "ridge-desk-mat": { cx: 315, cy: 414, rx: 245, ry: 7 },
  "axis-laptop-stand": { cx: 315, cy: 432, rx: 190, ry: 8 },
  "arc-monitor-shelf": { cx: 300, cy: 431, rx: 215, ry: 8 },
  "cove-valet-tray": { cx: 300, cy: 424, rx: 190, ry: 7 },
  "line-cable-dock": { cx: 300, cy: 436, rx: 115, ry: 6 },
  "field-notebook-set": { cx: 300, cy: 444, rx: 175, ry: 7 },
  "carry-tech-pouch": { cx: 300, cy: 432, rx: 185, ry: 7 },
  "focus-workspace-bundle": { cx: 315, cy: 434, rx: 245, ry: 7 },
};

/** Bounding box of each drawing, used to frame every product identically. */
const BOX: Record<string, { x0: number; x1: number; y0: number; y1: number }> = {
  "ridge-desk-mat": { x0: 56, x1: 574, y0: 283, y1: 421 },
  "axis-laptop-stand": { x0: 118, x1: 508, y0: 80, y1: 436 },
  "arc-monitor-shelf": { x0: 80, x1: 520, y0: 160, y1: 432 },
  "cove-valet-tray": { x0: 100, x1: 500, y0: 322, y1: 430 },
  "line-cable-dock": { x0: 170, x1: 442, y0: 190, y1: 438 },
  "field-notebook-set": { x0: 104, x1: 492, y0: 225, y1: 447 },
  "carry-tech-pouch": { x0: 110, x1: 490, y0: 268, y1: 436 },
  "focus-workspace-bundle": { x0: 60, x1: 565, y0: 135, y1: 445 },
};

const PAPER = "#EFEAE0";
const INK = "#191B19";
const LEATHER = "#A9794D";

type ItemProps = { c: string };

function Mat({ c }: ItemProps) {
  const dark = shade(c, -0.25);
  const light = shade(c, 0.25);
  const ridges = Array.from({ length: 11 }, (_, i) => {
    const t = (i + 1) / 12;
    const y = 290 + 110 * t;
    const xl = 130 - 60 * t + 12;
    const xr = 500 + 60 * t - 12;
    return (
      <g key={i}>
        <line x1={xl} y1={y} x2={xr} y2={y} stroke={dark} strokeOpacity={0.55} strokeWidth={2.2} />
        <line
          x1={xl}
          y1={y + 2.6}
          x2={xr}
          y2={y + 2.6}
          stroke={light}
          strokeOpacity={0.45}
          strokeWidth={1.4}
        />
      </g>
    );
  });
  return (
    <g>
      <path
        d="M70 400 L560 400 L560 413 L70 413 Z"
        fill={dark}
        stroke={dark}
        strokeWidth={14}
        strokeLinejoin="round"
      />
      <path
        d="M130 290 L500 290 L560 400 L70 400 Z"
        fill={c}
        stroke={c}
        strokeWidth={14}
        strokeLinejoin="round"
      />
      <path
        d="M130 290 L500 290 L560 400 L70 400 Z"
        fill="#000"
        stroke="#000"
        strokeWidth={14}
        strokeLinejoin="round"
        filter="url(#kc-felt)"
      />
      <path
        d="M130 290 L500 290 L560 400 L70 400 Z"
        fill="url(#kc-shade)"
        stroke="url(#kc-shade)"
        strokeWidth={14}
        strokeLinejoin="round"
      />
      {ridges}
      <path
        d="M142 298 L488 298 L544 394 L86 394 Z"
        fill="none"
        stroke={light}
        strokeOpacity={0.7}
        strokeWidth={1.6}
        strokeDasharray="4 6"
        strokeLinejoin="round"
      />
    </g>
  );
}

function luma(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}

function Stand({ c }: ItemProps) {
  const dark = shade(c, -0.3);
  const lightStand = luma(c) > 0.5;
  const lapBase = lightStand ? "#4B4D4A" : "#D9D7D0";
  const lapKeys = lightStand ? "#343634" : "#B5B3AB";
  const lapLid = lightStand ? "#5A5C58" : "#CFCDC6";
  return (
    <g>
      <path d="M175 336 L150 428 M425 306 L470 428" stroke={dark} strokeWidth={16} strokeLinecap="round" />
      <path
        d="M125 430 L185 430 M445 430 L500 430"
        stroke={shade(c, -0.45)}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path d="M140 338 L455 300" stroke={c} strokeWidth={18} strokeLinecap="round" />
      <path d="M140 338 L138 316" stroke={c} strokeWidth={10} strokeLinecap="round" />
      <path
        d="M150 340 L452 304"
        stroke={shade(c, 0.35)}
        strokeOpacity={0.6}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <g transform="translate(152 326) rotate(-6.9)">
        <rect x={0} y={-13} width={290} height={13} rx={4} fill={lapBase} />
        <rect x={14} y={-10} width={262} height={2.5} rx={1} fill={lapKeys} />
        <g transform="translate(290 -13) rotate(-96)">
          <rect x={0} y={-10} width={205} height={10} rx={4} fill={lapLid} />
          <rect x={9} y={-8} width={187} height={6} rx={2} fill="#232523" />
        </g>
      </g>
    </g>
  );
}

function Shelf({ c }: ItemProps) {
  const dark = shade(c, -0.22);
  const light = shade(c, 0.14);
  return (
    <g>
      <path d="M200 430 A100 100 0 0 1 400 430 Z" fill="#000" fillOpacity={0.13} />
      <path d="M90 294 H510 V430 H400 A100 100 0 0 0 200 430 H90 Z" fill={dark} />
      <rect x={80} y={268} width={440} height={28} rx={4} fill={light} />
      <rect x={80} y={268} width={440} height={28} rx={4} fill="#000" filter="url(#kc-wood)" />
      <path d="M90 294 H510 V430 H400 A100 100 0 0 0 200 430 H90 Z" fill="url(#kc-shade)" />
      <rect x={80} y={288} width={440} height={8} rx={2} fill={c} />
      {/* books */}
      <rect x={118} y={244} width={96} height={24} rx={2} fill="#D6CDBB" />
      <rect x={128} y={222} width={80} height={22} rx={2} fill="#B45F43" />
      <rect x={134} y={202} width={68} height={20} rx={2} fill="#39483B" />
      {/* plant */}
      <path d="M410 268 L450 268 L444 232 L416 232 Z" fill="#C9C2B5" />
      <ellipse cx={430} cy={228} rx={30} ry={6} fill="#B5AD9E" />
      <ellipse cx={414} cy={196} rx={9} ry={30} fill="#4F6B4F" transform="rotate(-24 414 196)" />
      <ellipse cx={432} cy={188} rx={9} ry={36} fill="#5C7A5C" />
      <ellipse cx={450} cy={200} rx={9} ry={28} fill="#4F6B4F" transform="rotate(26 450 200)" />
    </g>
  );
}

function Tray({ c }: ItemProps) {
  const dark = shade(c, -0.28);
  const inner = shade(c, -0.14);
  return (
    <g>
      <path
        d="M110 410 L490 410 L486 424 L114 424 Z"
        fill={dark}
        stroke={dark}
        strokeWidth={12}
        strokeLinejoin="round"
      />
      <path
        d="M172 330 L428 330 L492 410 L108 410 Z"
        fill={c}
        stroke={c}
        strokeWidth={16}
        strokeLinejoin="round"
      />
      <path
        d="M172 330 L428 330 L492 410 L108 410 Z"
        fill="url(#kc-shade)"
        stroke="url(#kc-shade)"
        strokeWidth={16}
        strokeLinejoin="round"
      />
      <path
        d="M204 346 L396 346 L448 396 L152 396 Z"
        fill={inner}
        stroke={inner}
        strokeWidth={10}
        strokeLinejoin="round"
      />
      <path d="M156 398 L444 398" stroke={shade(c, 0.4)} strokeOpacity={0.45} strokeWidth={2} />
      {/* watch */}
      <rect x={256} y={346} width={22} height={52} rx={6} fill={shade("#2B2D2B", 0.1)} />
      <circle cx={267} cy={372} r={17} fill={PAPER} stroke="#2B2D2B" strokeWidth={4} />
      <path d="M267 372 V362 M267 372 L274 376" stroke="#2B2D2B" strokeWidth={2} strokeLinecap="round" />
      {/* key */}
      <circle cx={338} cy={364} r={10} fill="none" stroke="#B8B2A5" strokeWidth={4} />
      <path d="M346 370 L376 384 M368 380 L372 372" stroke="#B8B2A5" strokeWidth={5} strokeLinecap="round" />
      {/* coin */}
      <ellipse cx={402} cy={378} rx={11} ry={8} fill="#C8B88F" />
    </g>
  );
}

function Dock({ c }: ItemProps) {
  const dark = shade(c, -0.3);
  const light = shade(c, 0.12);
  return (
    <g>
      <path
        d="M205 350 L395 350 L410 382 L190 382 Z"
        fill={light}
        stroke={light}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <rect x={190} y={382} width={220} height={50} rx={8} fill={c} />
      <rect x={190} y={382} width={220} height={50} rx={8} fill="url(#kc-shade)" />
      <rect x={200} y={430} width={200} height={7} rx={3} fill="#1F201F" />
      {[222, 282, 342].map((x) => (
        <rect key={x} x={x} y={359} width={36} height={10} rx={5} fill={shade(c, -0.6)} />
      ))}
      <path
        d="M240 362 C240 300 205 282 182 226"
        fill="none"
        stroke="#E9E4D8"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path
        d="M300 362 C300 292 300 262 332 212"
        fill="none"
        stroke="#8E9A8F"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path
        d="M360 362 C360 312 408 292 430 248"
        fill="none"
        stroke="#B45F43"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <rect x={172} y={206} width={20} height={26} rx={5} fill={dark} transform="rotate(-24 182 219)" />
      <rect x={322} y={192} width={20} height={26} rx={5} fill={dark} transform="rotate(30 332 205)" />
      <rect x={420} y={228} width={20} height={26} rx={5} fill={dark} transform="rotate(28 430 241)" />
      <text
        x={300}
        y={414}
        textAnchor="middle"
        fontSize={11}
        letterSpacing={3}
        fill={shade(c, 0.45)}
        fontFamily="sans-serif"
      >
        LINE
      </text>
    </g>
  );
}

function Notebook({ x, y, rot, color }: { x: number; y: number; rot: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-72} y={-102} width={144} height={204} rx={7} fill={color} />
      <rect x={-72} y={-102} width={12} height={204} rx={5} fill={shade(color, -0.22)} />
      <rect x={42} y={-102} width={6} height={204} fill={shade(color, -0.45)} />
      <rect x={-34} y={-66} width={66} height={50} rx={2} fill={PAPER} />
      <rect x={-26} y={-54} width={34} height={3} fill="#8A877E" />
      <rect x={-26} y={-44} width={48} height={2} fill="#B5B0A4" />
      <rect x={-26} y={-37} width={40} height={2} fill="#B5B0A4" />
    </g>
  );
}

function Notebooks({ c }: ItemProps) {
  return (
    <g>
      <Notebook x={186} y={344} rot={-9} color={shade(c, 0.28)} />
      <Notebook x={412} y={346} rot={8} color={shade(c, -0.28)} />
      <Notebook x={300} y={334} rot={0} color={c} />
      <g transform="translate(300 440) rotate(-3)">
        <rect x={-160} y={-5} width={290} height={10} rx={2} fill="#C9A66B" />
        <path d="M130 -5 L162 0 L130 5 Z" fill="#E7D3AA" />
        <path d="M152 -2 L162 0 L152 2 Z" fill={INK} />
        <rect x={-160} y={-5} width={22} height={10} rx={2} fill="#B45F43" />
      </g>
    </g>
  );
}

function Pouch({ c }: ItemProps) {
  const dark = shade(c, -0.3);
  const light = shade(c, 0.3);
  return (
    <g>
      <rect x={110} y={270} width={380} height={162} rx={46} fill={c} />
      <rect x={110} y={270} width={380} height={162} rx={46} fill="url(#kc-shade)" />
      <path
        d="M110 330 Q300 350 490 330 L490 386 Q490 432 444 432 H156 Q110 432 110 386 Z"
        fill={dark}
        fillOpacity={0.22}
      />
      <rect
        x={124}
        y={284}
        width={352}
        height={134}
        rx={34}
        fill="none"
        stroke={light}
        strokeOpacity={0.5}
        strokeWidth={1.6}
        strokeDasharray="5 6"
      />
      <path d="M150 308 H448" stroke={dark} strokeWidth={6} strokeLinecap="round" strokeDasharray="2.5 4" />
      <rect x={428} y={299} width={36} height={18} rx={9} fill={LEATHER} />
      <rect x={452} y={310} width={12} height={40} rx={5} fill={LEATHER} />
      <rect x={374} y={378} width={72} height={28} rx={3} fill={dark} />
      <text
        x={410}
        y={396}
        textAnchor="middle"
        fontSize={9}
        letterSpacing={2.5}
        fill={light}
        fontFamily="sans-serif"
      >
        KERN &amp; COVE
      </text>
    </g>
  );
}

export interface BundlePalette {
  mat: string;
  stand: string;
  tray: string;
  notebooks: string;
}

export const BUNDLE_PALETTES: Record<string, BundlePalette> = {
  "#2B2D2B": { mat: "#2B2D2B", stand: "#BDBBB4", tray: "#B9B1A2", notebooks: "#D6CDBB" },
  "#4A5B4D": { mat: "#4A5B4D", stand: "#BDBBB4", tray: "#D6CDBB", notebooks: "#B45F43" },
};

function Bundle({ c }: ItemProps) {
  const p = BUNDLE_PALETTES[c] ?? BUNDLE_PALETTES["#2B2D2B"];
  return (
    <g>
      <g transform="translate(0 20)">
        <Mat c={p.mat} />
      </g>
      <g transform="translate(118 92) scale(0.6)">
        <Stand c={p.stand} />
      </g>
      <g transform="translate(70 262) scale(0.36)">
        <Notebooks c={p.notebooks} />
      </g>
      <g transform="translate(334 240) scale(0.4)">
        <Tray c={p.tray} />
      </g>
    </g>
  );
}

const ITEMS: Record<string, (props: ItemProps) => React.ReactElement> = {
  "ridge-desk-mat": Mat,
  "axis-laptop-stand": Stand,
  "arc-monitor-shelf": Shelf,
  "cove-valet-tray": Tray,
  "line-cable-dock": Dock,
  "field-notebook-set": Notebooks,
  "carry-tech-pouch": Pouch,
  "focus-workspace-bundle": Bundle,
};

/** Point each detail crop looks at, in the 600 × 600 drawing space. */
const FOCUS: Record<string, { x: number; y: number; zoom: number }> = {
  "ridge-desk-mat": { x: 420, y: 380, zoom: 2.3 },
  "axis-laptop-stand": { x: 190, y: 360, zoom: 2.2 },
  "arc-monitor-shelf": { x: 250, y: 360, zoom: 2 },
  "cove-valet-tray": { x: 300, y: 372, zoom: 2.2 },
  "line-cable-dock": { x: 300, y: 330, zoom: 2.1 },
  "field-notebook-set": { x: 300, y: 300, zoom: 2 },
  "carry-tech-pouch": { x: 420, y: 330, zoom: 2.3 },
  "focus-workspace-bundle": { x: 270, y: 340, zoom: 1.7 },
};

function Mug({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={4} rx={26} ry={5} fill="#000" fillOpacity={0.12} />
      <rect x={-20} y={-44} width={40} height={46} rx={7} fill="#F4F1EA" />
      <path d="M20 -34 q16 2 14 16 q-2 12 -14 12" fill="none" stroke="#F4F1EA" strokeWidth={6} />
      <ellipse cx={0} cy={-44} rx={20} ry={5} fill="#3A2A22" />
    </g>
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={4} rx={24} ry={5} fill="#000" fillOpacity={0.12} />
      <path d="M-18 0 L18 0 L14 -34 L-14 -34 Z" fill="#B45F43" />
      <ellipse cx={-14} cy={-62} rx={8} ry={28} fill="#4F6B4F" transform="rotate(-26 -14 -62)" />
      <ellipse cx={0} cy={-72} rx={8} ry={34} fill="#5C7A5C" />
      <ellipse cx={15} cy={-60} rx={8} ry={26} fill="#4F6B4F" transform="rotate(28 15 -60)" />
    </g>
  );
}

export interface ProductArtProps {
  slug: string;
  color: string;
  view?: ArtView;
  alt: string;
  className?: string;
}

export function ProductArt({ slug, color, view = "studio", alt, className }: ProductArtProps) {
  const Item = ITEMS[slug] ?? Mat;
  const focus = FOCUS[slug] ?? { x: 300, y: 340, zoom: 2 };
  const box = BOX[slug] ?? { x0: 60, x1: 540, y0: 200, y1: 440 };
  const shadow = SHADOWS[slug];
  const tonal = view === "tonal";
  const workspace = view === "workspace";
  const bg = tonal ? "#39483B" : view === "detail" ? "#DAD3C4" : "#E9E4D8";

  // Every product is scaled to fit one frame and sits on the same floor line.
  const fit = Math.min(1.1, 430 / (box.x1 - box.x0), 335 / (box.y1 - box.y0));
  const frame = (bottom: number, extra = 1) => {
    const k = fit * extra;
    return `translate(${300 - (k * (box.x0 + box.x1)) / 2} ${bottom - k * box.y1}) scale(${k})`;
  };

  let transform: string;
  if (view === "detail") {
    transform = `translate(${300 - focus.x * focus.zoom} ${300 - focus.y * focus.zoom}) scale(${focus.zoom})`;
  } else if (tonal) {
    transform = frame(446, 0.94);
  } else if (workspace) {
    transform = frame(484, 0.82);
  } else {
    transform = frame(450);
  }

  return (
    <svg
      viewBox="0 0 600 600"
      width={600}
      height={600}
      preserveAspectRatio="xMidYMid slice"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={className}
    >
      <ArtDefs />
      <rect width={600} height={600} fill={bg} />
      {tonal ? (
        <circle cx={300} cy={320} r={230} fill="#435346" />
      ) : (
        <rect width={600} height={600} fill="url(#kc-room)" />
      )}
      {workspace && (
        <>
          <rect y={0} width={600} height={330} fill="#E4DED1" />
          <path d="M360 0 H520 L430 330 H270 Z" fill="#FFFFFF" fillOpacity={0.35} />
          <rect y={330} width={600} height={270} fill="#CDBB9E" />
          <rect y={330} width={600} height={3} fill="#000" fillOpacity={0.08} />
          <Mug x={64} y={390} />
          <Plant x={548} y={380} />
        </>
      )}
      <g transform={transform}>
        {shadow && <Shadow {...shadow} />}
        <g filter="url(#kc-lit)">
          <Item c={color} />
        </g>
      </g>
    </svg>
  );
}

function HeroItem({ slug, c, t }: { slug: string; c: string; t: string }) {
  const Item = ITEMS[slug];
  const shadow = SHADOWS[slug];
  return (
    <g transform={t}>
      <Shadow {...shadow} />
      <g filter="url(#kc-lit)">
        <Item c={c} />
      </g>
    </g>
  );
}

/* A wide editorial scene for the homepage hero. */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 960"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A calm, organized desk with a laptop on a stand, a felt desk mat, a valet tray, notebooks and a small plant, lit by soft window light"
      className={className}
    >
      <ArtDefs />
      <rect width={800} height={960} fill="#E4DED1" />
      <path d="M430 0 H690 L560 520 H300 Z" fill="#FFFFFF" fillOpacity={0.38} />
      <path d="M540 0 H600 L470 520 H420 Z" fill="#FFFFFF" fillOpacity={0.22} />
      <rect y={500} width={800} height={460} fill="#CDBB9E" />
      <rect y={500} width={800} height={4} fill="#000" fillOpacity={0.08} />
      <HeroItem slug="arc-monitor-shelf" c="#B99A72" t="translate(-10 350) scale(0.7)" />
      <HeroItem slug="ridge-desk-mat" c="#39483B" t="translate(90 330) scale(1.1)" />
      <HeroItem slug="axis-laptop-stand" c="#BDBBB4" t="translate(166 378) scale(0.75)" />
      <HeroItem slug="cove-valet-tray" c="#B45F43" t="translate(548 566) scale(0.36)" />
      <HeroItem slug="field-notebook-set" c="#D6CDBB" t="translate(86 628) scale(0.34)" />
      <Mug x={700} y={610} />
    </svg>
  );
}
