import { mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';

const target = process.argv[2];
if (!target || !['chrome', 'firefox'].includes(target)) {
  console.error('Usage: node scripts/build.mjs <chrome|firefox>');
  process.exit(1);
}

const root = process.cwd();
const distDir = path.join(root, 'dist', target);

const manifestPath = path.join(root, 'manifest.json');
const contentJsPath = path.join(root, 'content.js');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (target === 'firefox') {
  manifest.browser_specific_settings = {
    gecko: {
      id: 'youtube-shorts-no-scroll@example.com',
      strict_min_version: '109.0'
    }
  };
}

if (target === 'chrome') {
  delete manifest.browser_specific_settings;
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await writeFile(path.join(distDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await copyFile(contentJsPath, path.join(distDir, 'content.js'));

console.log(`Built ${target}: ${distDir}`);
