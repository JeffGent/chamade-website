// Bouwt chamade.be/persmap/ opnieuw op uit persmap-bron/.
//
//   node tools/persmap-bouw.mjs <wachtwoord>
//
// 1. maakt de factsheets: persmap/chamade-factsheet.pdf (nl) en
//    persmap/chamade-factsheet-en.pdf (en), uit persmap-bron/factsheet*.html
// 2. maakt persmap/chamade-persmap.zip (foto's, logo's, beide factsheets)
// 3. versleutelt de pagina's met het wachtwoord:
//    persmap-bron/index.html    -> persmap/index.html    (nl)
//    persmap-bron/index-en.html -> persmap/en/index.html (en)
//
// persmap-bron/ staat in .gitignore: de repo is openbaar, dus de leesbare
// versie mag er nooit in. Kwijt? Open de live pagina met het wachtwoord en
// bewaar de pagina, dat is dezelfde inhoud.
//
// Let op: alleen de pagina is versleuteld. De foto's, de zip en de pdf zijn
// gewone bestanden; wie het exacte adres kent, kan ze zonder wachtwoord openen.

import { readFileSync, writeFileSync, rmSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { webcrypto as crypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bron = path.join(root, 'persmap-bron');
const uit = path.join(root, 'persmap');
const ITERATIONS = 600000;

// Eén regel per taal. Beide talen krijgen hetzelfde wachtwoord.
const TALEN = [
  { factsheetBron: 'factsheet.html', factsheet: 'chamade-factsheet.pdf', pagina: 'index.html', slot: 'persmap-slot.html', doel: 'index.html' },
  { factsheetBron: 'factsheet-en.html', factsheet: 'chamade-factsheet-en.pdf', pagina: 'index-en.html', slot: 'persmap-slot-en.html', doel: 'en/index.html' },
];

const password = process.argv[2];
if (!password) {
  console.error('Geef het wachtwoord mee: node tools/persmap-bouw.mjs <wachtwoord>');
  process.exit(1);
}
for (const f of TALEN.flatMap((t) => [t.pagina, t.factsheetBron])) {
  if (!existsSync(path.join(bron, f))) {
    console.error(`persmap-bron/${f} ontbreekt. Zie de uitleg bovenaan dit script.`);
    process.exit(1);
  }
}

// 1. factsheets
const browser = await chromium.launch();
try {
  for (const t of TALEN) {
    const page = await browser.newPage();
    await page.goto('file://' + path.join(bron, t.factsheetBron), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(uit, t.factsheet), format: 'A4', printBackground: true });
    await page.close();
  }
} finally {
  await browser.close();
}

// 2. zip (zonder de kleine voorbeeldversies)
const zip = path.join(uit, 'chamade-persmap.zip');
rmSync(zip, { force: true });
execFileSync('zip', ['-q', '-r', '-X', zip, 'beelden', 'logo', ...TALEN.map((t) => t.factsheet), '-x', 'beelden/klein/*', '*.DS_Store'], { cwd: uit });
const zipMb = (statSync(zip).size / 1e6).toFixed(0);

// 3. versleutelen
const b64 = (u) => Buffer.from(u).toString('base64');
for (const t of TALEN) {
  const html = readFileSync(path.join(bron, t.pagina), 'utf8').replaceAll('{{ZIP_MB}}', zipMb);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
  );
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(html)));

  const wrapper = readFileSync(path.join(root, 'tools', t.slot), 'utf8')
    .replace('{{PAYLOAD}}', JSON.stringify({ salt: b64(salt), iv: b64(iv), iterations: ITERATIONS, data: b64(data) }));
  mkdirSync(path.dirname(path.join(uit, t.doel)), { recursive: true });
  writeFileSync(path.join(uit, t.doel), wrapper);
}

console.log(`Klaar: ${TALEN.map((t) => 'persmap/' + t.doel).join(' en ')} (versleuteld), factsheets, zip ${zipMb} MB.`);
