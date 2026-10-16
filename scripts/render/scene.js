// Kern & Cove product renders: a small Three.js studio, driven by URL parameters.
//   ?product=ridge-desk-mat&color=%232B2D2B&view=studio&w=1200&h=1200
// The orchestrator (scripts/render-products.mjs) waits for window.__done, then reads the canvas.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const q = new URLSearchParams(location.search);
const PRODUCT = q.get("product") ?? "ridge-desk-mat";
const COLOR = q.get("color") ?? "#2B2D2B";
const VIEW = q.get("view") ?? "studio";
const W = Number(q.get("w") ?? 1200);
const H = Number(q.get("h") ?? 1200);

/* ------------------------------------------------------------------ */
/* Deterministic randomness so every render is reproducible.           */
/* ------------------------------------------------------------------ */
let seed = 1337;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

/* ------------------------------------------------------------------ */
/* Procedural textures                                                  */
/* ------------------------------------------------------------------ */
function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
}

function toTexture(c, { srgb = true, repeat = null } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

function speckle(ctx, w, h, count, alpha, size = 1.4) {
  for (let i = 0; i < count; i++) {
    const light = rand() > 0.5;
    ctx.fillStyle = light ? `rgba(255,255,255,${alpha * rand()})` : `rgba(0,0,0,${alpha * rand()})`;
    ctx.fillRect(rand() * w, rand() * h, size, size);
  }
}

function noiseBump(size = 512, grain = 0.5, scale = 1) {
  const [c, ctx] = canvas(size, size);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  speckle(ctx, size, size, size * size * 0.35 * scale, grain, 2);
  return toTexture(c, { srgb: false, repeat: [2, 2] });
}

function weaveBump(size = 512, step = 6) {
  const [c, ctx] = canvas(size, size);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < size; i += step) {
    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.fillRect(i, 0, step * 0.45, size);
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.fillRect(0, i, size, step * 0.45);
  }
  speckle(ctx, size, size, 30000, 0.25, 1.5);
  return toTexture(c, { srgb: false, repeat: [3, 3] });
}

function woodTexture(hex, w = 1024, h = 512) {
  const base = new THREE.Color(hex);
  const [c, ctx] = canvas(w, h);
  ctx.fillStyle = `#${base.getHexString()}`;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 220; i++) {
    const y = rand() * h;
    const thick = 0.6 + rand() * 3.5;
    const dark = rand() > 0.45;
    ctx.strokeStyle = dark
      ? `rgba(60,38,18,${0.05 + rand() * 0.16})`
      : `rgba(255,240,210,${0.04 + rand() * 0.09})`;
    ctx.lineWidth = thick;
    ctx.beginPath();
    ctx.moveTo(0, y);
    const wob = 2 + rand() * 7;
    const freq = 0.003 + rand() * 0.006;
    for (let x = 0; x <= w; x += 16) ctx.lineTo(x, y + Math.sin(x * freq + i) * wob);
    ctx.stroke();
  }
  speckle(ctx, w, h, 9000, 0.07, 1.2);
  return toTexture(c);
}

function ridgeTexture(hex, w = 2048, h = 1024) {
  const base = new THREE.Color(hex);
  const dark = base.clone().multiplyScalar(0.6);
  const light = base.clone().lerp(new THREE.Color("#ffffff"), 0.22);
  const [c, ctx] = canvas(w, h);
  ctx.fillStyle = `#${base.getHexString()}`;
  ctx.fillRect(0, 0, w, h);
  const [bc, bctx] = canvas(w, h);
  bctx.fillStyle = "#808080";
  bctx.fillRect(0, 0, w, h);
  const step = 30;
  for (let y = 70; y < h - 60; y += step) {
    ctx.fillStyle = `rgba(${dark.r * 255},${dark.g * 255},${dark.b * 255},.55)`;
    ctx.fillRect(60, y, w - 120, 6);
    ctx.fillStyle = `rgba(${light.r * 255},${light.g * 255},${light.b * 255},.35)`;
    ctx.fillRect(60, y + 7, w - 120, 4);
    bctx.fillStyle = "#101010";
    bctx.fillRect(60, y, w - 120, 6);
    bctx.fillStyle = "#e8e8e8";
    bctx.fillRect(60, y + 7, w - 120, 5);
  }
  // fine felt fibres
  speckle(ctx, w, h, 160000, 0.09, 1.6);
  speckle(bctx, w, h, 140000, 0.3, 1.6);
  // stitched border
  ctx.strokeStyle = `#${light.getHexString()}`;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 12]);
  ctx.strokeRect(34, 34, w - 68, h - 68);
  ctx.globalAlpha = 1;
  return [toTexture(c), toTexture(bc, { srgb: false })];
}

function labelTexture(text, bg = "#EFEAE0", fg = "#3b3a36", w = 512, h = 256, small = "") {
  const [c, ctx] = canvas(w, h);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  speckle(ctx, w, h, 4000, 0.06, 1.5);
  ctx.fillStyle = fg;
  ctx.font = "600 44px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(text, w / 2, h / 2 + 4);
  if (small) {
    ctx.font = "500 20px sans-serif";
    ctx.fillStyle = "rgba(60,58,54,.6)";
    ctx.fillText(small, w / 2, h / 2 + 50);
  }
  return toTexture(c);
}

function screenTexture() {
  const [c, ctx] = canvas(1024, 640);
  ctx.fillStyle = "#1c1f1d";
  ctx.fillRect(0, 0, 1024, 640);
  ctx.fillStyle = "#2a2e2b";
  ctx.fillRect(60, 60, 904, 520);
  ctx.fillStyle = "rgba(201,194,181,.7)";
  ctx.fillRect(110, 120, 300, 22);
  ctx.fillStyle = "rgba(201,194,181,.35)";
  ctx.fillRect(110, 170, 620, 12);
  ctx.fillRect(110, 200, 520, 12);
  ctx.fillRect(110, 230, 580, 12);
  ctx.fillStyle = "rgba(180,95,67,.85)";
  ctx.fillRect(110, 320, 220, 160);
  ctx.fillStyle = "rgba(201,194,181,.18)";
  ctx.fillRect(370, 320, 460, 160);
  return toTexture(c);
}

/* ------------------------------------------------------------------ */
/* Materials                                                            */
/* ------------------------------------------------------------------ */
function fabric(hex, { rough = 0.92, bump = 0.6 } = {}) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: rough,
    metalness: 0,
    bumpMap: noiseBump(512, 0.6, 1),
    bumpScale: bump,
  });
}

function canvasMat(hex) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: 0.78,
    metalness: 0,
    bumpMap: weaveBump(),
    bumpScale: 1.4,
  });
}

function paint(hex, { rough = 0.5, metal = 0.0 } = {}) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: rough,
    metalness: metal,
    bumpMap: noiseBump(256, 0.25, 0.6),
    bumpScale: 0.25,
  });
}

function anodized(hex) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: 0.38,
    metalness: 0.95,
    bumpMap: noiseBump(512, 0.35, 0.8),
    bumpScale: 0.2,
  });
}

function rubber(hex = "#1d1e1d") {
  return new THREE.MeshStandardMaterial({ color: hex, roughness: 0.85, metalness: 0 });
}

function woodMat(hex) {
  return new THREE.MeshStandardMaterial({
    map: woodTexture(hex),
    roughness: 0.62,
    metalness: 0,
    bumpMap: noiseBump(512, 0.2, 0.5),
    bumpScale: 0.15,
  });
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                     */
/* ------------------------------------------------------------------ */
function shadowed(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function rbox(w, h, d, r, mat, seg = 4) {
  return shadowed(
    new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)),
      mat,
    ),
  );
}

function strut(p1, p2, w, t, mat) {
  const a = new THREE.Vector3(...p1);
  const b = new THREE.Vector3(...p2);
  const len = a.distanceTo(b);
  const m = rbox(w, len, t, Math.min(w, t) * 0.4, mat, 3);
  m.position.copy(a.clone().add(b).multiplyScalar(0.5));
  const dir = b.clone().sub(a).normalize();
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return m;
}

function roundedRectShape(w, d, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + d - r);
  s.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + d);
  s.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

function extrudeShape(shape, depth, bevel = 0.25) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 28,
  });
  return geo;
}

function tone(hex, l) {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + l)));
  return `#${c.getHexString()}`;
}

function luma(hex) {
  const c = new THREE.Color(hex);
  return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
}

/* ------------------------------------------------------------------ */
/* Products (units: centimetres, resting on y = 0)                      */
/* ------------------------------------------------------------------ */
function buildMat(c) {
  const g = new THREE.Group();
  const T = 0.5;
  const body = rbox(80, T, 40, 0.22, fabric(c, { bump: 0.3 }), 5);
  body.position.y = T / 2;
  g.add(body);
  const [map, bump] = ridgeTexture(c);
  const top = shadowed(
    new THREE.Mesh(
      new THREE.PlaneGeometry(79.4, 39.4),
      new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 2.2, roughness: 1 }),
    ),
  );
  top.rotation.x = -Math.PI / 2;
  top.position.y = T + 0.005;
  g.add(top);
  g.userData.focus = { at: [0.32, 0.5, 0.2], zoom: 3.4, az: -30, el: 34 };
  return g;
}

function buildStand(c, laptop = true) {
  const g = new THREE.Group();
  const metal = anodized(c);
  const plate = new THREE.Group();
  plate.position.set(0, 9.2, 0);
  plate.rotation.x = 0.245; // rear edge raised
  g.add(plate);
  const deck = rbox(26, 0.9, 24, 0.35, metal);
  plate.add(deck);
  const lip = rbox(26, 1.5, 0.9, 0.3, metal);
  lip.position.set(0, 0.9, 11.6);
  plate.add(lip);
  // slim silicone pads
  for (const [x, z] of [
    [-9, -7],
    [9, -7],
    [-9, 8],
    [9, 8],
  ]) {
    const pad = rbox(3.2, 0.25, 3.2, 0.12, rubber("#2a2b2a"), 2);
    pad.position.set(x, 0.55, z);
    plate.add(pad);
  }
  // legs
  const legMat = anodized(tone(c, -0.06));
  for (const x of [-10.5, 10.5]) {
    g.add(strut([x, 7.4, 9.6], [x, 0.6, 12.8], 1.7, 1.1, legMat));
    g.add(strut([x, 10.4, -9.5], [x, 0.6, -15.2], 1.7, 1.1, legMat));
    const footA = rbox(1.9, 0.7, 5.6, 0.3, legMat, 3);
    footA.position.set(x, 0.35, 12.6);
    g.add(footA);
    const footB = rbox(1.9, 0.7, 5.6, 0.3, legMat, 3);
    footB.position.set(x, 0.35, -15);
    g.add(footB);
  }
  if (laptop) {
    const dark = luma(c) > 0.45;
    const lapMat = dark
      ? new THREE.MeshStandardMaterial({ color: "#3a3c3b", roughness: 0.4, metalness: 0.85 })
      : new THREE.MeshStandardMaterial({ color: "#cfcdc6", roughness: 0.35, metalness: 0.9 });
    const lap = new THREE.Group();
    lap.position.set(0, 0.45 + 0.46, 0.4);
    plate.add(lap);
    const base = rbox(21.5, 0.92, 15, 0.38, lapMat);
    lap.add(base);
    const keys = shadowed(
      new THREE.Mesh(
        new THREE.PlaneGeometry(18.6, 6.6),
        new THREE.MeshStandardMaterial({ color: dark ? "#161817" : "#8f8e89", roughness: 0.5 }),
      ),
    );
    keys.rotation.x = -Math.PI / 2;
    keys.position.set(0, 0.47, -2.6);
    lap.add(keys);
    const pad = shadowed(
      new THREE.Mesh(
        new THREE.PlaneGeometry(7, 4.4),
        new THREE.MeshStandardMaterial({
          color: dark ? "#2f3231" : "#b9b7b0",
          roughness: 0.3,
          metalness: 0.5,
        }),
      ),
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, 0.47, 4.2);
    lap.add(pad);
    const hinge = new THREE.Group();
    hinge.position.set(0, 0.46, -7.5);
    hinge.rotation.x = -1.83;
    lap.add(hinge);
    const lid = rbox(21.5, 0.7, 14.8, 0.3, lapMat);
    lid.position.set(0, 0.35, 7.4);
    hinge.add(lid);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(20.4, 13.6),
      new THREE.MeshStandardMaterial({
        map: screenTexture(),
        emissiveMap: screenTexture(),
        emissive: "#ffffff",
        emissiveIntensity: 0.45,
        roughness: 0.15,
      }),
    );
    screen.rotation.x = Math.PI / 2;
    screen.position.set(0, -0.01, 7.4);
    hinge.add(screen);
  }
  g.userData.focus = { at: [0.5, 0.45, 0.5], zoom: 4.0, az: -38, el: 20 };
  return g;
}

function buildShelf(c) {
  const g = new THREE.Group();
  const oak = new THREE.Color(c).getHSL({}).l > 0.35;
  const bodyMat = oak ? woodMat(c) : paint(c, { rough: 0.55 });
  const shape = new THREE.Shape();
  shape.moveTo(-28, 0);
  shape.lineTo(-9.2, 0);
  shape.absarc(0, 0, 9.2, Math.PI, 0, true);
  shape.lineTo(28, 0);
  shape.lineTo(28, 9.3);
  shape.lineTo(-28, 9.3);
  shape.closePath();
  const geo = extrudeShape(shape, 20, 0.3);
  geo.translate(0, 0, -10);
  const body = shadowed(new THREE.Mesh(geo, bodyMat));
  g.add(body);
  const top = rbox(56.6, 2.3, 21.4, 0.45, woodMat(oak ? tone(c, 0.02) : "#7a5a3a"), 5);
  top.position.y = 9.3 + 0.3 + 1.15;
  g.add(top);
  const topY = 9.3 + 0.3 + 2.3;
  // books
  const bookColors = ["#D6CDBB", "#B45F43", "#39483B"];
  bookColors.forEach((bc, i) => {
    const b = rbox(17 - i * 1.4, 2.3, 12 - i * 0.6, 0.25, paint(bc, { rough: 0.8 }), 3);
    b.position.set(-17 + i * 0.4, topY + 1.15 + i * 2.3, 0.5);
    b.rotation.y = (i - 1) * 0.08;
    g.add(b);
  });
  // plant
  const pot = shadowed(
    new THREE.Mesh(new THREE.CylinderGeometry(3.4, 2.6, 5.6, 40), paint("#C9C2B5", { rough: 0.7 })),
  );
  pot.position.set(18, topY + 2.8, 1);
  g.add(pot);
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.3, 32), rubber("#2b2118"));
  soil.position.set(18, topY + 5.5, 1);
  g.add(soil);
  const leafMat = new THREE.MeshStandardMaterial({
    color: "#4F6B4F",
    roughness: 0.55,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < 7; i++) {
    const leaf = shadowed(new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), leafMat));
    leaf.scale.set(0.9, 4.2 + rand() * 1.6, 0.22);
    const a = (i / 7) * Math.PI * 2;
    leaf.position.set(18 + Math.cos(a) * 1.3, topY + 9.3, 1 + Math.sin(a) * 1.3);
    leaf.rotation.set(Math.sin(a) * 0.45, a, -Math.cos(a) * 0.45);
    g.add(leaf);
  }
  g.userData.focus = { at: [0.64, 0.82, 0.5], zoom: 3.8, az: -30, el: 14 };
  return g;
}

function buildTray(c, items = true) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: c,
    roughness: 0.52,
    metalness: 0,
    bumpMap: noiseBump(512, 0.3, 0.8),
    bumpScale: 0.25,
  });
  const outer = roundedRectShape(25, 16, 3.6);
  const hole = new THREE.Path();
  const inner = roundedRectShape(22.2, 13.2, 2.4);
  hole.setFromPoints(inner.getPoints(40));
  outer.holes.push(hole);
  const rimGeo = extrudeShape(outer, 1.5, 0.35);
  rimGeo.rotateX(-Math.PI / 2);
  const rim = shadowed(new THREE.Mesh(rimGeo, mat));
  g.add(rim);
  const floorGeo = extrudeShape(roundedRectShape(25, 16, 3.6), 0.5, 0.35);
  floorGeo.rotateX(-Math.PI / 2);
  const floor = shadowed(new THREE.Mesh(floorGeo, mat));
  g.add(floor);
  const basin = shadowed(
    new THREE.Mesh(
      extrudeShape(roundedRectShape(22.8, 13.8, 2.6), 0.01, 0.12),
      new THREE.MeshStandardMaterial({ color: tone(c, -0.06), roughness: 0.6 }),
    ),
  );
  basin.geometry.rotateX(-Math.PI / 2);
  basin.position.y = 1.05;
  g.add(basin);
  if (items) {
    // watch
    const strapMat = rubber("#262826");
    const wg = new THREE.Group();
    wg.position.set(-5.4, 1.05 + 0.45, 0.2);
    wg.rotation.y = 0.35;
    const band = shadowed(new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.5, 14, 40), strapMat));
    band.rotation.x = Math.PI / 2;
    band.scale.set(1, 1.25, 1);
    wg.add(band);
    const head = shadowed(
      new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 1.9, 0.9, 48),
        new THREE.MeshStandardMaterial({ color: "#c9c8c2", metalness: 0.9, roughness: 0.3 }),
      ),
    );
    head.position.y = 0.9;
    wg.add(head);
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 48),
      new THREE.MeshStandardMaterial({ color: "#EFEAE0", roughness: 0.4 }),
    );
    face.rotation.x = -Math.PI / 2;
    face.position.y = 1.36;
    wg.add(face);
    for (const [w, h, ang] of [
      [0.14, 1.0, 0],
      [0.12, 0.7, 1.3],
    ]) {
      const hand = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.05, h),
        new THREE.MeshStandardMaterial({ color: "#191B19" }),
      );
      hand.rotation.y = ang;
      hand.position.set(Math.sin(ang) * h * 0.4, 1.4, Math.cos(ang) * h * 0.4);
      wg.add(hand);
    }
    g.add(wg);
    // key
    const keyG = new THREE.Group();
    keyG.position.set(3.6, 1.05 + 0.2, -0.8);
    keyG.rotation.y = -0.6;
    const keyMat = new THREE.MeshStandardMaterial({ color: "#b9b4a6", metalness: 0.95, roughness: 0.3 });
    const ring = shadowed(new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.22, 12, 32), keyMat));
    ring.rotation.x = Math.PI / 2;
    keyG.add(ring);
    const shaft = rbox(0.5, 0.3, 4.6, 0.12, keyMat, 2);
    shaft.position.set(0, 0, 3.1);
    keyG.add(shaft);
    const teeth = rbox(0.9, 0.3, 0.6, 0.1, keyMat, 2);
    teeth.position.set(0.5, 0, 4.9);
    keyG.add(teeth);
    g.add(keyG);
    // coins
    for (const [x, z, y] of [
      [7.4, 2.6, 0],
      [8.1, 3.4, 0.14],
      [6.6, -2.4, 0],
    ]) {
      const coin = shadowed(
        new THREE.Mesh(
          new THREE.CylinderGeometry(1.0, 1.0, 0.14, 36),
          new THREE.MeshStandardMaterial({ color: "#c8b88f", metalness: 0.85, roughness: 0.35 }),
        ),
      );
      coin.position.set(x, 1.05 + 0.07 + y, z);
      g.add(coin);
    }
  }
  g.userData.focus = { at: [0.5, 0.2, 0.5], zoom: 2.8, az: -28, el: 36 };
  return g;
}

function buildDock(c) {
  const g = new THREE.Group();
  const body = rbox(
    8.8,
    2.6,
    4.2,
    0.6,
    new THREE.MeshStandardMaterial({
      color: c,
      roughness: 0.42,
      metalness: 0.65,
      bumpMap: noiseBump(256, 0.3, 0.7),
      bumpScale: 0.2,
    }),
    6,
  );
  body.position.y = 1.3 + 0.25;
  g.add(body);
  const base = rbox(8.2, 0.3, 3.7, 0.12, rubber(), 2);
  base.position.y = 0.15;
  g.add(base);
  const cableColors = ["#E9E4D8", "#8E9A8F", "#B45F43"];
  const xs = [-2.8, 0, 2.8];
  const heights = [1, 0.8, 1.15];
  xs.forEach((x, i) => {
    const slot = rbox(1.7, 0.5, 2.2, 0.2, rubber("#0d0e0d"), 3);
    slot.position.set(x, 2.7, 0);
    g.add(slot);
    const sgn = i === 1 ? 0.2 : i === 0 ? -1 : 1;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 2.8, 0),
      new THREE.Vector3(x, 5.5 * heights[i], -0.2),
      new THREE.Vector3(x + sgn * 2.5, 9 * heights[i], -1.4),
      new THREE.Vector3(x + sgn * 4.5, 12.2 * heights[i], -3.2),
    ]);
    const tube = shadowed(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.26, 14, false),
        new THREE.MeshStandardMaterial({ color: cableColors[i], roughness: 0.55 }),
      ),
    );
    g.add(tube);
    const tip = rbox(
      0.9,
      1.8,
      0.45,
      0.16,
      new THREE.MeshStandardMaterial({ color: "#2a2c2a", roughness: 0.4, metalness: 0.5 }),
      3,
    );
    const end = curve.getPoint(1);
    const tan = curve.getTangent(1);
    tip.position.copy(end.clone().add(tan.clone().multiplyScalar(0.8)));
    tip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
    g.add(tip);
  });
  g.userData.focus = { at: [0.5, 0.42, 0.5], zoom: 3.9, az: -26, el: 30 };
  return g;
}

function buildNotebooks(c, pencil = true) {
  const g = new THREE.Group();
  const specs = [
    { x: 0, z: 0, rot: 0.14, tint: -0.07 },
    { x: 0.5, z: -0.2, rot: -0.1, tint: 0 },
    { x: -0.4, z: 0.2, rot: 0.3, tint: 0.08 },
  ];
  specs.forEach((s, i) => {
    const cover = new THREE.MeshStandardMaterial({
      color: tone(c, s.tint),
      roughness: 0.82,
      bumpMap: weaveBump(256, 5),
      bumpScale: 0.9,
    });
    const nb = new THREE.Group();
    nb.position.set(s.x, 0.55 + i * 1.12, s.z);
    nb.rotation.y = s.rot;
    const body = rbox(9, 1.05, 14, 0.38, cover, 4);
    nb.add(body);
    const pages = rbox(
      8.5,
      0.7,
      13.5,
      0.1,
      new THREE.MeshStandardMaterial({ color: "#ECE6D8", roughness: 0.9 }),
      2,
    );
    pages.position.set(0.2, 0, 0);
    nb.add(pages);
    const spine = rbox(
      0.9,
      1.1,
      14.05,
      0.35,
      new THREE.MeshStandardMaterial({ color: tone(c, s.tint - 0.1), roughness: 0.8 }),
      3,
    );
    spine.position.x = -4.2;
    nb.add(spine);
    const band = rbox(0.45, 1.12, 14.1, 0.12, rubber("#1e1f1e"), 2);
    band.position.x = 3.1;
    nb.add(band);
    if (i === 2) {
      const label = shadowed(
        new THREE.Mesh(
          new THREE.PlaneGeometry(5.2, 3.4),
          new THREE.MeshStandardMaterial({
            map: labelTexture("FIELD NOTES", "#EFEAE0", "#3b3a36", 512, 330, "No. 03"),
            roughness: 0.85,
          }),
        ),
      );
      label.rotation.x = -Math.PI / 2;
      label.position.set(-0.4, 0.54, -3.2);
      nb.add(label);
    }
    g.add(nb);
  });
  if (pencil) {
    const pg = new THREE.Group();
    pg.position.set(-1.5, 0.35, 9.4);
    pg.rotation.y = 0.12;
    const body = shadowed(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 16, 6),
        new THREE.MeshStandardMaterial({ color: "#C9A66B", roughness: 0.6 }),
      ),
    );
    body.rotation.z = Math.PI / 2;
    pg.add(body);
    const cone = shadowed(
      new THREE.Mesh(
        new THREE.ConeGeometry(0.42, 1.6, 6),
        new THREE.MeshStandardMaterial({ color: "#E7D3AA", roughness: 0.7 }),
      ),
    );
    cone.rotation.z = -Math.PI / 2;
    cone.position.x = 8.8;
    pg.add(cone);
    const lead = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: "#191B19" }),
    );
    lead.rotation.z = -Math.PI / 2;
    lead.position.x = 9.75;
    pg.add(lead);
    const cap = shadowed(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.43, 0.43, 1.3, 6),
        new THREE.MeshStandardMaterial({ color: "#B45F43", roughness: 0.5 }),
      ),
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.x = -7.9;
    pg.add(cap);
    g.add(pg);
  }
  g.userData.focus = { at: [0.5, 0.5, 0.35], zoom: 3.2, az: -24, el: 32 };
  return g;
}

function buildPouch(c) {
  const g = new THREE.Group();
  const mat = canvasMat(c);
  const geo = new RoundedBoxGeometry(24, 6.6, 14, 10, 3.0);
  const body = shadowed(new THREE.Mesh(geo, mat));
  body.position.y = 3.3;
  body.scale.set(1, 1, 1);
  g.add(body);
  const dark = tone(c, -0.12);
  // zipper track along the top
  const track = rbox(21.5, 0.34, 0.9, 0.15, rubber(luma(c) > 0.5 ? "#4a4540" : "#0f100f"), 3);
  track.position.set(0, 6.55, 0);
  g.add(track);
  const teeth = shadowed(
    new THREE.Mesh(
      new THREE.PlaneGeometry(21, 0.5),
      new THREE.MeshStandardMaterial({ color: "#b7b2a6", roughness: 0.4, metalness: 0.8 }),
    ),
  );
  teeth.rotation.x = -Math.PI / 2;
  teeth.position.set(0, 6.73, 0);
  g.add(teeth);
  const leather = new THREE.MeshStandardMaterial({
    color: "#A9794D",
    roughness: 0.6,
    bumpMap: noiseBump(256, 0.4, 0.8),
    bumpScale: 0.3,
  });
  const pull = rbox(2.4, 0.45, 1.1, 0.2, leather, 3);
  pull.position.set(8.4, 6.92, 0);
  g.add(pull);
  const strap = rbox(0.9, 0.35, 4.2, 0.15, leather, 3);
  strap.position.set(9.9, 6.7, 1.9);
  strap.rotation.x = 0.35;
  g.add(strap);
  // tag
  const tag = shadowed(
    new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 1.9),
      new THREE.MeshStandardMaterial({
        map: labelTexture("KERN & COVE", dark, "#e9e4d8", 512, 188),
        roughness: 0.8,
      }),
    ),
  );
  tag.position.set(6.5, 2.6, 7.02);
  g.add(tag);
  g.userData.focus = { at: [0.8, 0.95, 0.5], zoom: 2.7, az: -22, el: 30 };
  return g;
}

const BUNDLE_PALETTES = {
  charcoal: { mat: "#2B2D2B", stand: "#BDBBB4", tray: "#B9B1A2", notebooks: "#D6CDBB" },
  olive: { mat: "#4A5B4D", stand: "#BDBBB4", tray: "#D6CDBB", notebooks: "#B45F43" },
};

function bundlePalette(hex) {
  return luma(hex) < 0.2 ? BUNDLE_PALETTES.charcoal : BUNDLE_PALETTES.olive;
}

function buildBundle(c) {
  const p = bundlePalette(c);
  const g = new THREE.Group();
  g.add(buildMat(p.mat));
  const stand = buildStand(p.stand);
  stand.position.set(-8, 0.5, -3);
  stand.rotation.y = 0.12;
  g.add(stand);
  const tray = buildTray(p.tray, true);
  tray.position.set(24, 0.5, 8);
  tray.rotation.y = -0.18;
  g.add(tray);
  const nb = buildNotebooks(p.notebooks, true);
  nb.position.set(-27, 0.5, 9);
  nb.rotation.y = 0.3;
  g.add(nb);
  g.userData.focus = { at: [0.62, 0.25, 0.62], zoom: 3.0, az: -34, el: 30 };
  return g;
}

/* ------------------------------------------------------------------ */
/* Hero: a composed desk scene for the homepage                         */
/* ------------------------------------------------------------------ */
function buildMug(x, z, rot = 0) {
  const g = new THREE.Group();
  const ceramic = new THREE.MeshStandardMaterial({ color: "#F1EEE6", roughness: 0.28, metalness: 0 });
  const wall = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(4, 3.6, 9, 56, 1, true), ceramic));
  wall.material.side = THREE.DoubleSide;
  wall.position.y = 4.5;
  g.add(wall);
  const bottom = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.4, 48), ceramic));
  bottom.position.y = 0.2;
  g.add(bottom);
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(3.7, 48),
    new THREE.MeshStandardMaterial({ color: "#2b1b12", roughness: 0.2 }),
  );
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 7.6;
  g.add(coffee);
  const handle = shadowed(new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.55, 14, 32, Math.PI), ceramic));
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(4.0, 4.6, 0);
  g.add(handle);
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  return g;
}

function buildHero() {
  const g = new THREE.Group();
  const deckMat = woodMat("#B79E7C");
  deckMat.map.wrapS = deckMat.map.wrapT = THREE.RepeatWrapping;
  deckMat.map.repeat.set(3, 2);
  const deck = rbox(260, 4, 130, 0.5, deckMat, 3);
  deck.position.set(0, -2, 10);
  g.add(deck);
  const wallMat = new THREE.MeshStandardMaterial({
    color: "#D9D1C0",
    roughness: 1,
    bumpMap: noiseBump(512, 0.15, 0.6),
    bumpScale: 0.2,
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(520, 260), wallMat);
  wall.position.set(0, 90, -52);
  wall.receiveShadow = true;
  g.add(wall);
  g.add(buildMat("#39483B"));
  const stand = buildStand("#BDBBB4");
  stand.position.set(-4, 0.5, -3);
  stand.rotation.y = 0.18;
  g.add(stand);
  const tray = buildTray("#B45F43", true);
  tray.position.set(28, 0, 14);
  tray.rotation.y = -0.2;
  g.add(tray);
  const nb = buildNotebooks("#D6CDBB", true);
  nb.position.set(-28, 0.5, 11);
  nb.rotation.y = 0.35;
  g.add(nb);
  g.add(buildMug(52, -8, 0.6));
  const shelf = buildShelf("#B99A72");
  shelf.position.set(38, 0, -30);
  shelf.rotation.y = -0.12;
  g.add(shelf);
  return g;
}

const BUILDERS = {
  "ridge-desk-mat": buildMat,
  "axis-laptop-stand": buildStand,
  "arc-monitor-shelf": buildShelf,
  "cove-valet-tray": buildTray,
  "line-cable-dock": buildDock,
  "field-notebook-set": buildNotebooks,
  "carry-tech-pouch": buildPouch,
  "focus-workspace-bundle": buildBundle,
  hero: buildHero,
};

/* Studio camera framing per product: [azimuth, elevation, fill factor]. */
const STUDIO = {
  "ridge-desk-mat": [-28, 34, 1.0],
  "axis-laptop-stand": [-34, 22, 0.88],
  "arc-monitor-shelf": [-30, 20, 0.88],
  "cove-valet-tray": [-26, 38, 0.88],
  "line-cable-dock": [-30, 26, 0.88],
  "field-notebook-set": [-26, 34, 0.88],
  "carry-tech-pouch": [-26, 28, 0.88],
  "focus-workspace-bundle": [-32, 38, 1.0],
};

const SIDE = {
  "ridge-desk-mat": [58, 26, 1.0],
  "axis-laptop-stand": [88, 6, 0.88],
  "arc-monitor-shelf": [0, 4, 0.88],
  "cove-valet-tray": [0, 14, 0.88],
  "line-cable-dock": [44, 18, 0.88],
  "field-notebook-set": [16, 20, 0.88],
  "carry-tech-pouch": [8, 8, 0.88],
  "focus-workspace-bundle": [52, 28, 1.0],
};

/* ------------------------------------------------------------------ */
/* Studio                                                               */
/* ------------------------------------------------------------------ */
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.6;

// seamless warm backdrop
{
  const [c, ctx] = canvas(1024, 1024);
  const grad = ctx.createRadialGradient(380, 260, 60, 512, 560, 820);
  grad.addColorStop(0, "#F3EFE6");
  grad.addColorStop(0.55, "#E9E4D8");
  grad.addColorStop(1, "#D9D2C2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);
  speckle(ctx, 1024, 1024, 40000, 0.025, 1.2);
  scene.background = toTexture(c);
}

const key = new THREE.DirectionalLight("#fff3e2", 2.1);
key.position.set(-46, 70, 38);
key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
key.shadow.camera.left = -70;
key.shadow.camera.right = 70;
key.shadow.camera.top = 70;
key.shadow.camera.bottom = -70;
key.shadow.camera.near = 10;
key.shadow.camera.far = 220;
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.05;
key.shadow.radius = 5;
scene.add(key);
const rim = new THREE.DirectionalLight("#fff0dc", 1.3);
rim.position.set(48, 36, -58);
scene.add(rim);
const fill = new THREE.DirectionalLight("#dfe6f2", 0.55);
fill.position.set(50, 30, 30);
scene.add(fill);
scene.add(new THREE.HemisphereLight("#fff8ec", "#cfc6b4", 0.3));

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(600, 600),
  new THREE.ShadowMaterial({ opacity: 0.3, color: "#2a2118" }),
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

function aoBlob(w, d, opacity) {
  const [c, ctx] = canvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  g.addColorStop(0, `rgba(30,22,14,${opacity})`);
  g.addColorStop(0.6, `rgba(30,22,14,${opacity * 0.35})`);
  g.addColorStop(1, "rgba(30,22,14,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 1.25, d * 1.4),
    new THREE.MeshBasicMaterial({ map: toTexture(c), transparent: true, depthWrite: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.02;
  return m;
}

const build = BUILDERS[PRODUCT];
if (!build) throw new Error(`unknown product ${PRODUCT}`);
const product = build(COLOR);
scene.add(product);
const HERO = PRODUCT === "hero";
if (HERO) {
  floor.visible = false;
  key.shadow.camera.left = -150;
  key.shadow.camera.right = 150;
  key.shadow.camera.top = 150;
  key.shadow.camera.bottom = -150;
  key.shadow.camera.far = 400;
  key.position.set(-90, 105, 70);
  renderer.toneMappingExposure = 0.78;
}

const box = new THREE.Box3().setFromObject(product);
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());
const blob = aoBlob(size.x, size.z, 0.42);
blob.position.set(center.x, 0.02, center.z);
if (!HERO) scene.add(blob);

const camera = new THREE.PerspectiveCamera(26, W / H, 1, 1000);
const sphereR = box.getBoundingSphere(new THREE.Sphere()).radius;

function aim(target, dist, azDeg, elDeg) {
  const az = THREE.MathUtils.degToRad(azDeg);
  const el = THREE.MathUtils.degToRad(elDeg);
  camera.position.set(
    target.x + dist * Math.sin(az) * Math.cos(el),
    target.y + dist * Math.sin(el),
    target.z + dist * Math.cos(az) * Math.cos(el),
  );
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}

const corners = [];
for (const x of [box.min.x, box.max.x])
  for (const y of [box.min.y, box.max.y])
    for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));

/** Pull the camera back (or in) until the bounding box fills `fillFactor` of the frame. */
function fitDistance(target, azDeg, elDeg, fillFactor) {
  let dist = sphereR * 4;
  for (let i = 0; i < 6; i++) {
    aim(target, dist, azDeg, elDeg);
    let extent = 0;
    for (const c of corners) {
      const p = c.clone().project(camera);
      extent = Math.max(extent, Math.abs(p.x), Math.abs(p.y));
    }
    dist *= extent / fillFactor;
  }
  return dist;
}
const vfov = THREE.MathUtils.degToRad(camera.fov);
const fitDist = (fill) => sphereR / Math.sin(vfov / 2) / (fill * 1.0);

if (HERO) {
  camera.fov = 29;
  camera.updateProjectionMatrix();
  camera.position.set(-84, 92, 150);
  camera.lookAt(new THREE.Vector3(6, 6, 0));
  camera.updateProjectionMatrix();
} else if (VIEW === "detail") {
  const f = product.userData.focus ?? { at: [0.5, 0.5, 0.5], zoom: 2.4, az: -28, el: 28 };
  const target = new THREE.Vector3(
    box.min.x + size.x * f.at[0],
    box.min.y + size.y * f.at[1],
    box.min.z + size.z * f.at[2],
  );
  aim(target, (fitDist(0.8) / f.zoom) * 1.6, f.az, f.el);
} else {
  const [az, el, fillFactor] = (VIEW === "side" ? SIDE : STUDIO)[PRODUCT];
  const target = center.clone();
  target.y = box.min.y + size.y * 0.4;
  aim(target, fitDistance(target, az, el, fillFactor * 0.9), az, el);
}

renderer.render(scene, camera);
window.__done = true;
