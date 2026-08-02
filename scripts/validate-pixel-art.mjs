import { resolve } from 'node:path';
import { readPng } from './pixel-art-png.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const specs = [
  {
    path: 'assets/pixel-art/v1/characters/bigotes.png',
    width: 384,
    height: 512,
    colors: 16,
    frame: [48, 64],
    usedPerRow: [6, 8, 3, 4, 8, 4, 6, 4],
  },
  {
    path: 'assets/pixel-art/v1/effects/player-attack.png',
    width: 192,
    height: 32,
    colors: 8,
    frame: [32, 32],
    usedPerRow: [6],
  },
  {
    path: 'assets/pixel-art/v1/effects/hit-spark.png',
    width: 144,
    height: 24,
    colors: 8,
    frame: [24, 24],
    usedPerRow: [6],
  },
];

function visiblePixelsInCell(image, frameWidth, frameHeight, column, row) {
  let visible = 0;
  for (let y = row * frameHeight; y < (row + 1) * frameHeight; y += 1) {
    for (let x = column * frameWidth; x < (column + 1) * frameWidth; x += 1) {
      if (image.pixels[(y * image.width + x) * 4 + 3] === 255) visible += 1;
    }
  }
  return visible;
}

let failed = false;
for (const spec of specs) {
  const image = await readPng(resolve(ROOT, spec.path));
  const colors = new Set();
  let partialAlpha = 0;
  let visible = 0;
  for (let index = 0; index < image.pixels.length; index += 4) {
    const alpha = image.pixels[index + 3];
    if (alpha > 0 && alpha < 255) partialAlpha += 1;
    if (alpha === 0) continue;
    visible += 1;
    colors.add(`${image.pixels[index]},${image.pixels[index + 1]},${image.pixels[index + 2]}`);
  }
  const errors = [];
  if (image.width !== spec.width || image.height !== spec.height) errors.push(`dimensiones ${image.width}×${image.height}`);
  if (image.width % spec.frame[0] !== 0 || image.height % spec.frame[1] !== 0) errors.push('cuadrícula irregular');
  if (colors.size > spec.colors) errors.push(`${colors.size} colores (máximo ${spec.colors})`);
  if (partialAlpha > 0) errors.push(`${partialAlpha} píxeles con alpha parcial`);
  if (visible === 0) errors.push('asset vacío');
  const columns = image.width / spec.frame[0];
  const rows = image.height / spec.frame[1];
  if (Number.isInteger(columns) && Number.isInteger(rows)) {
    for (let row = 0; row < rows; row += 1) {
      const used = spec.usedPerRow[row] ?? 0;
      for (let column = 0; column < columns; column += 1) {
        const cellPixels = visiblePixelsInCell(image, spec.frame[0], spec.frame[1], column, row);
        if (column < used && cellPixels === 0) errors.push(`celda requerida vacía ${column},${row}`);
        if (column >= used && cellPixels > 0) errors.push(`contenido inesperado en celda ${column},${row}`);
      }
    }
  }
  if (errors.length) {
    failed = true;
    console.error(`FAIL ${spec.path}: ${errors.join(', ')}`);
  } else {
    console.log(`PASS ${spec.path}: ${image.width}×${image.height}, ${colors.size} colores, alpha binario`);
  }
}

if (failed) process.exitCode = 1;
