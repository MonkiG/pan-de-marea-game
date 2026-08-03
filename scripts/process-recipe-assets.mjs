import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { emptyImage, readPng, writePng } from './pixel-art-png.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const source = (file) => resolve(ROOT, 'art-source', 'pixel-art', 'v1', 'recipes', file);
const target = (file) => resolve(ROOT, 'assets', 'pixel-art', 'v1', 'recipes', file);

const RECIPE_PALETTE = [
  [5, 15, 31], [9, 31, 58], [16, 49, 86], [34, 76, 119],
  [78, 43, 31], [116, 62, 8], [166, 91, 7], [216, 132, 12],
  [247, 177, 39], [255, 211, 79], [218, 199, 150], [249, 235, 190],
  [5, 145, 188], [56, 205, 235], [225, 255, 244], [255, 255, 255],
];

const IMPACT_PALETTE = [
  [5, 15, 31], [78, 43, 31], [166, 91, 7], [216, 132, 12],
  [247, 177, 39], [255, 211, 79], [56, 205, 235], [255, 255, 255],
];

const isChroma = (red, green, blue) => red > 155
  && blue > 140
  && green < 145
  && Math.min(red, blue) - green > 45;

const nearestColor = (red, green, blue, palette) => {
  let best = palette[0];
  let distance = Infinity;
  for (const color of palette) {
    const candidate = (red - color[0]) ** 2 + (green - color[1]) ** 2 + (blue - color[2]) ** 2;
    if (candidate < distance) {
      best = color;
      distance = candidate;
    }
  }
  return best;
};

function findBox(image, startX, endX) {
  let minX = endX;
  let minY = image.height;
  let maxX = startX - 1;
  let maxY = -1;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const offset = (y * image.width + x) * 4;
      if (isChroma(image.pixels[offset], image.pixels[offset + 1], image.pixels[offset + 2])) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) throw new Error('Celda de receta sin contenido visible');
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function drawNearest(sourceImage, output, box, destination, palette) {
  for (let y = 0; y < destination.height; y += 1) {
    const sourceY = box.y + Math.min(box.height - 1, Math.floor((y / destination.height) * box.height));
    for (let x = 0; x < destination.width; x += 1) {
      const sourceX = box.x + Math.min(box.width - 1, Math.floor((x / destination.width) * box.width));
      const sourceOffset = (sourceY * sourceImage.width + sourceX) * 4;
      const red = sourceImage.pixels[sourceOffset];
      const green = sourceImage.pixels[sourceOffset + 1];
      const blue = sourceImage.pixels[sourceOffset + 2];
      if (isChroma(red, green, blue)) continue;
      const [targetRed, targetGreen, targetBlue] = nearestColor(red, green, blue, palette);
      const targetX = destination.x + x;
      const targetY = destination.y + y;
      if (targetX < 0 || targetY < 0 || targetX >= output.width || targetY >= output.height) continue;
      const targetOffset = (targetY * output.width + targetX) * 4;
      output.pixels[targetOffset] = targetRed;
      output.pixels[targetOffset + 1] = targetGreen;
      output.pixels[targetOffset + 2] = targetBlue;
      output.pixels[targetOffset + 3] = 255;
    }
  }
}

async function processRow({ input, output, count, frameWidth, frameHeight, palette, padding = 2, uniformScale = true }) {
  const image = await readPng(source(input));
  const boxes = Array.from({ length: count }, (_, index) => {
    const startX = Math.floor((index * image.width) / count);
    const endX = Math.floor(((index + 1) * image.width) / count);
    return findBox(image, startX, endX);
  });
  const maxWidth = Math.max(...boxes.map((box) => box.width));
  const maxHeight = Math.max(...boxes.map((box) => box.height));
  const commonScale = Math.min(
    (frameWidth - padding * 2) / maxWidth,
    (frameHeight - padding * 2) / maxHeight,
  );
  const result = emptyImage(frameWidth * count, frameHeight);

  boxes.forEach((box, index) => {
    const scale = uniformScale ? commonScale : Math.min(
      (frameWidth - padding * 2) / box.width,
      (frameHeight - padding * 2) / box.height,
    );
    const width = Math.max(1, Math.round(box.width * scale));
    const height = Math.max(1, Math.round(box.height * scale));
    drawNearest(image, result, box, {
      x: index * frameWidth + Math.floor((frameWidth - width) / 2),
      y: Math.floor((frameHeight - height) / 2),
      width,
      height,
    }, palette);
  });

  const outputPath = target(output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writePng(outputPath, result);
  console.info(`WROTE ${outputPath.replace(`${ROOT}\\`, '')}`);
  return result;
}

async function writeIconCells(sheet) {
  const names = ['icon-baguette-torpedo.png', 'icon-future-oxygen.png', 'icon-future-shield.png', 'icon-lock.png'];
  for (let cell = 0; cell < names.length; cell += 1) {
    const icon = emptyImage(48, 48);
    for (let y = 0; y < 48; y += 1) {
      const start = (y * sheet.width + cell * 48) * 4;
      icon.pixels.set(sheet.pixels.subarray(start, start + 48 * 4), y * 48 * 4);
    }
    const outputPath = target(names[cell]);
    await writePng(outputPath, icon);
    console.info(`WROTE ${outputPath.replace(`${ROOT}\\`, '')}`);
  }
}

await processRow({
  input: 'baguette-torpedo-master-chroma.png', output: 'baguette-torpedo-item.png',
  count: 1, frameWidth: 64, frameHeight: 32, palette: RECIPE_PALETTE, padding: 2,
});
await processRow({
  input: 'baguette-torpedo-flight-chroma.png', output: 'baguette-torpedo-projectile.png',
  count: 6, frameWidth: 48, frameHeight: 24, palette: RECIPE_PALETTE, padding: 1,
});
const iconSheet = await processRow({
  input: 'recipe-icons-chroma.png', output: 'recipe-icons.png',
  count: 4, frameWidth: 48, frameHeight: 48, palette: RECIPE_PALETTE, padding: 3, uniformScale: false,
});
await writeIconCells(iconSheet);
await processRow({
  input: 'baguette-impact-chroma.png', output: 'baguette-impact.png',
  count: 6, frameWidth: 48, frameHeight: 48, palette: IMPACT_PALETTE, padding: 2,
});
