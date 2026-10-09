import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.resolve(__dirname, 'public/favicon.svg');
const svg = fs.readFileSync(svgPath);

// Also save icon-192 and icon-512 as SVG fallback or generate basic png if needed
fs.copyFileSync(svgPath, path.resolve(__dirname, 'public/icon-192.svg'));
fs.copyFileSync(svgPath, path.resolve(__dirname, 'public/icon-512.svg'));
console.log('Icons generated successfully.');
