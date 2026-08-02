import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { emptyImage, readPng, writePng } from './pixel-art-png.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const source = (...parts) => resolve(ROOT, 'art-source', 'pixel-art', 'v1', ...parts);
const target = (...parts) => resolve(ROOT, 'assets', 'pixel-art', 'v1', ...parts);

const CHARACTER_PALETTE = [
  [5, 15, 31], [9, 31, 58], [16, 49, 86], [34, 76, 119],
  [50, 29, 31], [78, 43, 31], [116, 62, 8], [166, 91, 7],
  [216, 132, 12], [247, 177, 39], [178, 157, 111], [218, 199, 150],
  [249, 235, 190], [5, 145, 188], [56, 205, 235], [255, 255, 255],
];

const EFFECT_PALETTE = [
  [5, 15, 31], [78, 43, 31], [139, 69, 5], [216, 121, 7],
  [255, 169, 20], [255, 211, 79], [255, 239, 177], [255, 255, 255],
];

const bigotesRows = [
  ['idle', 6], ['swim', 8], ['jump', 3], ['fall', 4],
  ['attack', 8], ['hurt', 4], ['defeat', 6], ['interact', 4],
];

const isChroma = (red, green, blue) => red > 90
  && blue > 90
  && Math.min(red, blue) - green > 45
  && Math.abs(red - blue) < 125;

const segmentFrames = (image, count, adaptiveCuts = false) => {
  const columnInk = Array.from({ length: image.width }, (_, x) => {
    let ink = 0;
    for (let y = 0; y < image.height; y += 1) {
      const offset = (y * image.width + x) * 4;
      if (!isChroma(image.pixels[offset], image.pixels[offset + 1], image.pixels[offset + 2])) ink += 1;
    }
    return ink;
  });
  const emptyRuns = [];
  for (let start = 0; start < columnInk.length;) {
    if (columnInk[start] !== 0) {
      start += 1;
      continue;
    }
    let end = start;
    while (end + 1 < columnInk.length && columnInk[end + 1] === 0) end += 1;
    if (end - start >= 3) emptyRuns.push({ start, end, center: Math.round((start + end) / 2) });
    start = end + 1;
  }
  const nominalWidth = image.width / count;
  const cuts = Array.from({ length: count - 1 }, (_, index) => {
    const expected = nominalWidth * (index + 1);
    if (!adaptiveCuts) return Math.round(expected);
    const candidates = emptyRuns.filter((run) => Math.abs(run.center - expected) <= nominalWidth * 0.42);
    if (!candidates.length) return Math.round(expected);
    return candidates.reduce((best, run) => (
      Math.abs(run.center - expected) < Math.abs(best.center - expected) ? run : best
    )).center;
  });
  const boundaries = [0, ...cuts, image.width];
  return Array.from({ length: count }, (_, index) => {
    const left = boundaries[index];
    const right = boundaries[index + 1];
    const width = right - left;
    const pixels = new Uint8Array(width * image.height * 4);
    for (let y = 0; y < image.height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const sourceOffset = (y * image.width + left + x) * 4;
        const targetOffset = (y * width + x) * 4;
        const red = image.pixels[sourceOffset];
        const green = image.pixels[sourceOffset + 1];
        const blue = image.pixels[sourceOffset + 2];
        const transparent = isChroma(red, green, blue);
        pixels[targetOffset] = red;
        pixels[targetOffset + 1] = green;
        pixels[targetOffset + 2] = blue;
        pixels[targetOffset + 3] = transparent ? 0 : 255;
      }
    }
    return { width, height: image.height, pixels };
  });
};

const bounds = (image) => {
  let left = image.width;
  let top = image.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (image.pixels[(y * image.width + x) * 4 + 3] === 0) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  return right < left ? null : { left, top, width: right - left + 1, height: bottom - top + 1 };
};

const nearestColor = (red, green, blue, palette) => palette.reduce((best, color) => {
  const distance = (red - color[0]) ** 2 + (green - color[1]) ** 2 + (blue - color[2]) ** 2;
  return distance < best.distance ? { color, distance } : best;
}, { color: palette[0], distance: Infinity }).color;

const renderFrame = (frame, frameBounds, scale, outputWidth, outputHeight, palette, alignBottom) => {
  const output = emptyImage(outputWidth, outputHeight);
  if (!frameBounds) return output;
  const width = Math.max(1, Math.round(frameBounds.width * scale));
  const height = Math.max(1, Math.round(frameBounds.height * scale));
  const offsetX = Math.floor((outputWidth - width) / 2);
  const offsetY = alignBottom ? outputHeight - height - 2 : Math.floor((outputHeight - height) / 2);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceX = frameBounds.left + Math.min(frameBounds.width - 1, Math.floor(x / scale));
      const sourceY = frameBounds.top + Math.min(frameBounds.height - 1, Math.floor(y / scale));
      const sourceOffset = (sourceY * frame.width + sourceX) * 4;
      if (frame.pixels[sourceOffset + 3] === 0) continue;
      const [red, green, blue] = nearestColor(
        frame.pixels[sourceOffset], frame.pixels[sourceOffset + 1], frame.pixels[sourceOffset + 2], palette,
      );
      const targetX = offsetX + x;
      const targetY = offsetY + y;
      if (targetX < 0 || targetX >= outputWidth || targetY < 0 || targetY >= outputHeight) continue;
      const targetOffset = (targetY * outputWidth + targetX) * 4;
      output.pixels.set([red, green, blue, 255], targetOffset);
    }
  }
  return output;
};

const blit = (sourceImage, targetImage, offsetX, offsetY) => {
  for (let y = 0; y < sourceImage.height; y += 1) {
    for (let x = 0; x < sourceImage.width; x += 1) {
      const sourceOffset = (y * sourceImage.width + x) * 4;
      if (sourceImage.pixels[sourceOffset + 3] === 0) continue;
      const targetOffset = ((offsetY + y) * targetImage.width + offsetX + x) * 4;
      targetImage.pixels.set(sourceImage.pixels.subarray(sourceOffset, sourceOffset + 4), targetOffset);
    }
  }
};

async function processStrip(inputPath, count, frameWidth, frameHeight, palette, alignBottom = true, adaptiveCuts = false) {
  const frames = segmentFrames(await readPng(inputPath), count, adaptiveCuts);
  const frameBounds = frames.map(bounds);
  const maxWidth = Math.max(...frameBounds.filter(Boolean).map((value) => value.width));
  const maxHeight = Math.max(...frameBounds.filter(Boolean).map((value) => value.height));
  const scale = Math.min((frameWidth - 2) / maxWidth, (frameHeight - 4) / maxHeight);
  console.log(`${inputPath}: ${frameBounds.map((value) => `${value?.width ?? 0}×${value?.height ?? 0}`).join(', ')}, scale ${scale.toFixed(3)}`);
  return frames.map((frame, index) => renderFrame(
    frame, frameBounds[index], scale, frameWidth, frameHeight, palette, alignBottom,
  ));
}

async function processBigotes() {
  const sheet = emptyImage(384, 512);
  for (let row = 0; row < bigotesRows.length; row += 1) {
    const [name, count] = bigotesRows[row];
    const frames = await processStrip(
      source('bigotes', `bigotes-${name}-chroma.png`), count, 48, 64, CHARACTER_PALETTE, true, name !== 'attack',
    );
    frames.forEach((frame, column) => blit(frame, sheet, column * 48, row * 64));
  }
  const output = target('characters', 'bigotes.png');
  await mkdir(dirname(output), { recursive: true });
  await writePng(output, sheet);
  return output;
}

async function processEffect(name, count, frameSize) {
  const frames = await processStrip(
    source('effects', `${name}-chroma.png`), count, frameSize, frameSize, EFFECT_PALETTE, false,
  );
  const strip = emptyImage(count * frameSize, frameSize);
  frames.forEach((frame, index) => blit(frame, strip, index * frameSize, 0));
  const output = target('effects', `${name}.png`);
  await mkdir(dirname(output), { recursive: true });
  await writePng(output, strip);
  return output;
}

const outputs = [
  await processBigotes(),
  await processEffect('player-attack', 6, 32),
  await processEffect('hit-spark', 6, 24),
];
outputs.forEach((output) => console.log(`Generated ${output}`));
