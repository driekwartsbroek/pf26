// Fails the build on em dashes and stock phrases, so prompted edits stay in the house style.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FILES = /\.(md|mdx|astro)$/;
const DASHES = [/—/, /\s–\s/];
const PHRASES = [
  'not just', 'more than just', "isn't just", 'passionate about', 'seamless', 'leverage', 'elevate', 'delve',
  'unlock', 'empower', 'cutting-edge', 'game-changer', 'in today', 'journey', 'crafted', 'pixel-perfect',
  'at the intersection', 'bridging the gap', 'robust', 'holistic', 'synergy',
];

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (FILES.test(f)) out.push(p);
  }
  return out;
}

const problems = [];
for (const file of walk(join(ROOT, 'src'))) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const where = `${relative(ROOT, file)}:${i + 1}`;
    if (DASHES.some((d) => d.test(line))) problems.push(`${where}  dash`);
    const lower = line.toLowerCase();
    for (const p of PHRASES) if (lower.includes(p)) problems.push(`${where}  "${p}"`);
  });
}

if (problems.length) {
  console.error(`Copy check failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('copy: clean');
