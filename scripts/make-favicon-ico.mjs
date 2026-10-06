// Regenerates public/favicon.ico (16/32/48, PNG-compressed entries) from
// public/favicon.svg. Run from website/:  node scripts/make-favicon-ico.mjs
// `sharp` is not a direct dependency: it arrives transitively with Astro,
// which is the same route the OG image was produced by. Not part of the build.
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SIZES = [16, 32, 48];
const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url));

const pngs = [];
for (const size of SIZES) {
  // Render at a high density so the small sizes are downsampled, not aliased.
  pngs.push(await sharp(svg, { density: 72 * (512 / size) }).resize(size, size).png().toBuffer());
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(SIZES.length, 4);

let offset = 6 + 16 * SIZES.length;
const entries = SIZES.map((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size, 0); // width
  e.writeUInt8(size, 1); // height
  e.writeUInt8(0, 2); // palette colours
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});

const out = new URL('../public/favicon.ico', import.meta.url);
writeFileSync(out, Buffer.concat([header, ...entries, ...pngs]));
console.log(`wrote favicon.ico (${SIZES.join('/')}), ${offset} bytes`);
