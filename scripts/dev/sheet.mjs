import sharp from "sharp";
import { readdirSync } from "node:fs";
const dir = "/tmp/kc-sheet";
const view = process.argv[2] || "studio";
const files = [];
for (const p of readdirSync(dir))
  for (const f of readdirSync(`${dir}/${p}`)) if (f.endsWith(`-${view}.webp`)) files.push(`${dir}/${p}/${f}`);
const first = files
  .filter((f, i, a) => a.findIndex((x) => x.split("/")[3] === f.split("/")[3]) === i)
  .slice(0, 8);
const S = 500;
const comps = [];
for (let i = 0; i < first.length; i++)
  comps.push({
    input: await sharp(first[i]).resize(S, S).toBuffer(),
    left: (i % 4) * S,
    top: Math.floor(i / 4) * S,
  });
await sharp({ create: { width: S * 4, height: S * 2, channels: 3, background: "#fff" } })
  .composite(comps)
  .png()
  .toFile(`/tmp/sheet-${view}.png`);
console.log(first.length);
