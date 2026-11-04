import { cpSync, mkdirSync, rmSync } from 'node:fs';

const out = 'dist-cloudflare/metronome';
const files = ['index.html', 'css.css', 'poly.js', 'assets'];

rmSync('dist-cloudflare', { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const file of files) {
  cpSync(file, `${out}/${file}`, { recursive: true });
}
console.log(`copied ${files.join(', ')} to ${out}/`);
