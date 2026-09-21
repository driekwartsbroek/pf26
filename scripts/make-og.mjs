// Generates public/og.png, the image shown when the site is shared. Run: node scripts/make-og.mjs
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const W = 1200;
const H = 630;
const portrait = readdirSync(join(ROOT, 'src/assets')).find((f) => f.startsWith('portrait.'));
const marksDir = join(ROOT, 'src/content/companies/marks');
const marks = readdirSync(marksDir).filter((f) => /\.(png|jpe?g|webp|svg)$/.test(f));

const dots = [];
for (let y = 11; y < H; y += 22) for (let x = 11; x < W; x += 22) dots.push(`<circle cx="${x}" cy="${y}" r="1.3" fill="#d6d6d3"/>`);

const base = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#f4f4f3"/>
  ${dots.join('')}
  <rect x="96" y="135" width="620" height="360" rx="28" fill="#fff"/>
  <rect x="96.5" y="135.5" width="619" height="359" rx="27.5" fill="none" stroke="rgba(0,0,0,0.08)"/>
  <text x="136" y="330" font-family="Inter, Helvetica Neue, Helvetica, Arial" font-size="44" font-weight="700" fill="#1e1e1e" letter-spacing="-1">Bert Selleslagh</text>
  <text x="136" y="376" font-family="Inter, Helvetica Neue, Helvetica, Arial" font-size="26" fill="#7a7a78">Product Designer, Brussels</text>
  <text x="136" y="440" font-family="Inter, Helvetica Neue, Helvetica, Arial" font-size="22" fill="#1e1e1e">SaaS product design, close to the team that builds it.</text>
</svg>`);

const shadow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><filter id="s" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-opacity="0.16"/></filter></defs>
  <rect x="96" y="135" width="620" height="360" rx="28" fill="#fff" filter="url(#s)"/>
</svg>`);

const size = 112;
const round = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);
const avatar = await sharp(join(ROOT, 'src/assets', portrait)).resize(size, size).composite([{ input: round, blend: 'dest-in' }]).png().toBuffer();
const ring = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size + 12}" height="${size + 12}"><circle cx="${(size + 12) / 2}" cy="${(size + 12) / 2}" r="${(size + 10) / 2}" fill="#fff" stroke="rgba(0,0,0,0.1)"/></svg>`);

// Company marks as stickers, scattered on the right.
const spots = [
  [790, 150, -8], [950, 105, 6], [1045, 290, -4], [830, 335, 9], [960, 455, -10],
];
const stickers = [];
for (const [i, f] of marks.slice(0, spots.length).entries()) {
  const [x, y, r] = spots[i];
  const img = await sharp(join(marksDir, f), { density: 300 }).resize(120, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const outlined = await sharp({ create: { width: 140, height: 140, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: img, left: 10, top: 10 }])
    .png()
    .toBuffer();
  stickers.push({ input: await sharp(outlined).rotate(r, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), left: x, top: y });
}

await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"/>`))
  .composite([
    { input: base, left: 0, top: 0 },
    { input: shadow, left: 0, top: 0, blend: 'multiply' },
    { input: base, left: 0, top: 0 },
    { input: ring, left: 130, top: 163 },
    { input: avatar, left: 136, top: 169 },
    ...stickers,
  ])
  .png()
  .toFile(join(ROOT, 'public/og.png'));
console.log('public/og.png written');
