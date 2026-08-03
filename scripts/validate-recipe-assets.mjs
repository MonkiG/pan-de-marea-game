import { resolve } from 'node:path';
import { readPng } from './pixel-art-png.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const specs = [
  ['baguette-torpedo-item.png', 64, 32, 1, 16],
  ['baguette-torpedo-projectile.png', 288, 24, 6, 16],
  ['recipe-icons.png', 192, 48, 4, 16],
  ['baguette-impact.png', 288, 48, 6, 8],
  ['icon-baguette-torpedo.png', 48, 48, 1, 16],
  ['icon-future-oxygen.png', 48, 48, 1, 16],
  ['icon-future-shield.png', 48, 48, 1, 16],
  ['icon-lock.png', 48, 48, 1, 16],
];
const errors = [];

for (const [file, width, height, cells, maxColors] of specs) {
  const relative = `assets/pixel-art/v1/recipes/${file}`;
  try {
    const image = await readPng(resolve(ROOT, relative));
    if (image.width !== width || image.height !== height) errors.push(`${file}: ${image.width}x${image.height}, esperado ${width}x${height}`);
    const colors = new Set();
    let invalidAlpha = 0;
    const visiblePerCell = Array(cells).fill(0);
    const frameWidth = width / cells;
    for (let index = 0; index < image.pixels.length; index += 4) {
      const alpha = image.pixels[index + 3];
      if (![0, 255].includes(alpha)) invalidAlpha += 1;
      if (alpha === 255) {
        colors.add(`${image.pixels[index]},${image.pixels[index + 1]},${image.pixels[index + 2]}`);
        const pixel = index / 4;
        visiblePerCell[Math.floor((pixel % width) / frameWidth)] += 1;
      }
    }
    if (invalidAlpha) errors.push(`${file}: ${invalidAlpha} píxeles con alpha no binario`);
    if (colors.size > maxColors) errors.push(`${file}: ${colors.size} colores, máximo ${maxColors}`);
    visiblePerCell.forEach((visible, cell) => {
      if (visible < 4) errors.push(`${file}: celda ${cell} sin contenido suficiente`);
    });
    console.info(`PASS ${relative}: ${width}x${height}, ${colors.size} colores, ${cells} celdas`);
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

if (errors.length) {
  errors.forEach((error) => console.error(`FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.info('Assets de recetas válidos.');
}
