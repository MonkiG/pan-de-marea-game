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

const CRAWLER_PALETTE = [
  [5, 15, 31], [9, 31, 58], [22, 45, 79], [48, 61, 104],
  [83, 72, 122], [101, 91, 55], [151, 127, 67], [218, 190, 112],
  [249, 235, 190], [116, 62, 8], [198, 91, 7], [247, 128, 13],
  [47, 107, 91], [5, 145, 166], [56, 205, 213], [225, 255, 244],
];

const SPITTER_PALETTE = [
  [5, 15, 31], [14, 27, 46], [35, 39, 52], [64, 61, 67],
  [101, 91, 93], [154, 143, 136], [7, 69, 42], [10, 111, 45],
  [20, 154, 44], [83, 190, 42], [158, 222, 50], [224, 246, 112],
  [5, 145, 166], [56, 205, 213], [225, 255, 244], [166, 91, 7],
];

const SENTINEL_PALETTE = [
  [5, 15, 31], [12, 25, 44], [27, 39, 58], [48, 61, 75],
  [72, 88, 91], [94, 119, 110], [137, 158, 130], [187, 198, 151],
  [5, 85, 72], [5, 145, 116], [8, 205, 145], [66, 244, 179],
  [92, 255, 210], [116, 62, 8], [198, 91, 7], [235, 133, 30],
];

const EFFECT_PALETTE = [
  [5, 15, 31], [78, 43, 31], [139, 69, 5], [216, 121, 7],
  [255, 169, 20], [255, 211, 79], [255, 239, 177], [255, 255, 255],
];

const BAKERY_BACKGROUND_PALETTE = [
  [5, 15, 31], [5, 27, 48], [7, 42, 67], [8, 57, 83],
  [10, 75, 101], [12, 94, 121], [18, 116, 142], [25, 140, 163],
  [39, 166, 183], [68, 192, 199], [111, 213, 211], [18, 33, 48],
  [28, 49, 61], [44, 69, 75], [65, 91, 91], [94, 119, 110],
  [137, 158, 130], [78, 43, 31], [116, 62, 8], [166, 91, 7],
  [216, 132, 12], [247, 177, 39], [218, 199, 150], [249, 235, 190],
];

const MARKET_BACKGROUND_PALETTE = [
  [5, 15, 31], [5, 30, 46], [5, 45, 58], [5, 61, 70],
  [5, 78, 82], [7, 96, 96], [8, 116, 110], [10, 137, 125],
  [15, 160, 144], [36, 187, 164], [75, 215, 185], [130, 235, 205],
  [12, 25, 44], [27, 39, 58], [48, 61, 75], [72, 88, 91],
  [94, 119, 110], [137, 158, 130], [78, 43, 31], [116, 62, 8],
  [166, 91, 7], [198, 91, 7], [235, 133, 30], [218, 190, 112],
];

const backgroundSpecs = [
  { file: 'panaderia-undida-bg-1.png', palette: BAKERY_BACKGROUND_PALETTE, transparent: false },
  { file: 'panaderia-undida-bg-2.png', palette: BAKERY_BACKGROUND_PALETTE, transparent: false },
  { file: 'panaderia-undida-bg-3.png', palette: BAKERY_BACKGROUND_PALETTE, transparent: true },
  { file: 'mercado-undido-1.png', palette: MARKET_BACKGROUND_PALETTE, transparent: false },
  { file: 'mercado-undido-2.png', palette: MARKET_BACKGROUND_PALETTE, transparent: false },
  { file: 'mercado-undido-3.png', palette: MARKET_BACKGROUND_PALETTE, transparent: true },
];

const bigotesRows = [
  ['idle', 6], ['swim', 8], ['jump', 3], ['fall', 4],
  ['attack', 8], ['hurt', 4], ['defeat', 6], ['interact', 4],
];

const characterSheets = [
  {
    folder: 'rastrero', file: 'brine-crawler.png', width: 640, height: 336,
    frame: [80, 48], palette: CRAWLER_PALETTE,
    rows: [['idle', 6], ['patrol', 8], ['alert', 4], ['attack', 8, false], ['hurt', 4], ['stun', 4], ['defeat', 6]],
  },
  {
    folder: 'escupemasas', file: 'abyssal-spitter.png', width: 640, height: 384,
    frame: [80, 64], palette: SPITTER_PALETTE,
    rows: [['idle', 6], ['move', 6], ['charge', 6], ['shoot', 8], ['hurt', 4], ['defeat', 8]],
  },
  {
    folder: 'sentinela', file: 'black-coral-sentinel.png', width: 768, height: 784,
    frame: [96, 112], palette: SENTINEL_PALETTE,
    rows: [['sleep', 6], ['alert', 4], ['walk', 8], ['attack', 8], ['charge', 8], ['hurt', 4], ['defeat', 8]],
  },
];

const isChroma = (red, green, blue) => red > 90
  && blue > 90
  && Math.min(red, blue) - green > 45
  && Math.abs(red - blue) < 125;

const isBackgroundChroma = (red, green, blue) => red > 170
  && blue > 150
  && green < 110
  && Math.min(red, blue) - green > 85;

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
    return candidates.reduce((best, run) => {
      const width = run.end - run.start + 1;
      const bestWidth = best.end - best.start + 1;
      if (width !== bestWidth) return width > bestWidth ? run : best;
      return Math.abs(run.center - expected) < Math.abs(best.center - expected) ? run : best;
    }).center;
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

const segmentFramesByComponents = (image, count) => {
  const pixelCount = image.width * image.height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  const components = [];

  for (let start = 0; start < pixelCount; start += 1) {
    if (visited[start]) continue;
    visited[start] = 1;
    const sourceOffset = start * 4;
    if (isChroma(
      image.pixels[sourceOffset], image.pixels[sourceOffset + 1], image.pixels[sourceOffset + 2],
    )) continue;

    let head = 0;
    let tail = 1;
    queue[0] = start;
    const points = [];
    let left = image.width;
    let top = image.height;
    let right = -1;
    let bottom = -1;

    while (head < tail) {
      const pixel = queue[head];
      head += 1;
      points.push(pixel);
      const x = pixel % image.width;
      const y = Math.floor(pixel / image.width);
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);

      for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
        for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
          if (deltaX === 0 && deltaY === 0) continue;
          const nextX = x + deltaX;
          const nextY = y + deltaY;
          if (nextX < 0 || nextY < 0 || nextX >= image.width || nextY >= image.height) continue;
          const next = nextY * image.width + nextX;
          if (visited[next]) continue;
          visited[next] = 1;
          const nextOffset = next * 4;
          if (!isChroma(
            image.pixels[nextOffset], image.pixels[nextOffset + 1], image.pixels[nextOffset + 2],
          )) {
            queue[tail] = next;
            tail += 1;
          }
        }
      }
    }
    components.push({ points, left, top, right, bottom, centerX: (left + right) / 2 });
  }

  const mainComponents = [...components]
    .sort((left, right) => right.points.length - left.points.length)
    .slice(0, count)
    .sort((left, right) => left.centerX - right.centerX);
  if (mainComponents.length !== count) {
    throw new Error(`No se encontraron ${count} poses conectadas en la tira`);
  }

  const groups = mainComponents.map((main) => [main]);
  const mainSet = new Set(mainComponents);
  components.forEach((component) => {
    if (mainSet.has(component) || component.points.length < 4) return;
    const nearestIndex = mainComponents.reduce((bestIndex, main, index) => (
      Math.abs(component.centerX - main.centerX)
        < Math.abs(component.centerX - mainComponents[bestIndex].centerX) ? index : bestIndex
    ), 0);
    groups[nearestIndex].push(component);
  });

  return groups.map((group) => {
    const left = Math.min(...group.map((component) => component.left));
    const top = Math.min(...group.map((component) => component.top));
    const right = Math.max(...group.map((component) => component.right));
    const bottom = Math.max(...group.map((component) => component.bottom));
    const frame = emptyImage(right - left + 1, bottom - top + 1);
    group.forEach((component) => component.points.forEach((pixel) => {
      const sourceX = pixel % image.width;
      const sourceY = Math.floor(pixel / image.width);
      const originalOffset = pixel * 4;
      const frameOffset = ((sourceY - top) * frame.width + sourceX - left) * 4;
      frame.pixels.set([
        image.pixels[originalOffset], image.pixels[originalOffset + 1], image.pixels[originalOffset + 2], 255,
      ], frameOffset);
    }));
    return frame;
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

async function processStrip(inputPath, count, frameWidth, frameHeight, palette, alignBottom = true, segmentation = false) {
  const image = await readPng(inputPath);
  const frames = segmentation === 'components'
    ? segmentFramesByComponents(image, count)
    : segmentFrames(image, count, segmentation);
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

async function processCharacter(spec) {
  const [frameWidth, frameHeight] = spec.frame;
  const sheet = emptyImage(spec.width, spec.height);
  for (let row = 0; row < spec.rows.length; row += 1) {
    const [name, count, segmentation = 'components'] = spec.rows[row];
    const frames = await processStrip(
      source(spec.folder, `${spec.folder}-${name}-chroma.png`),
      count,
      frameWidth,
      frameHeight,
      spec.palette,
      true,
      segmentation,
    );
    frames.forEach((frame, column) => blit(frame, sheet, column * frameWidth, row * frameHeight));
  }
  const output = target('characters', spec.file);
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

const sampleBackground = (image, transparent) => {
  const logicalWidth = 320;
  const logicalHeight = 180;
  const cropWidth = Math.min(image.width, Math.floor(image.height * (16 / 9)));
  const cropHeight = Math.min(image.height, Math.floor(cropWidth * (9 / 16)));
  const cropLeft = Math.floor((image.width - cropWidth) / 2);
  const cropTop = Math.floor((image.height - cropHeight) / 2);
  const logical = emptyImage(logicalWidth, logicalHeight);

  for (let y = 0; y < logicalHeight; y += 1) {
    for (let x = 0; x < logicalWidth; x += 1) {
      const sourceX = cropLeft + Math.min(cropWidth - 1, Math.floor((x + 0.5) * cropWidth / logicalWidth));
      const sourceY = cropTop + Math.min(cropHeight - 1, Math.floor((y + 0.5) * cropHeight / logicalHeight));
      const sourceOffset = (sourceY * image.width + sourceX) * 4;
      const targetOffset = (y * logicalWidth + x) * 4;
      const red = image.pixels[sourceOffset];
      const green = image.pixels[sourceOffset + 1];
      const blue = image.pixels[sourceOffset + 2];
      const alpha = transparent && isBackgroundChroma(red, green, blue) ? 0 : 255;
      logical.pixels.set([red, green, blue, alpha], targetOffset);
    }
  }
  return logical;
};

const blendHorizontalSeam = (image, band = 12) => {
  const original = new Uint8Array(image.pixels);
  for (let y = 0; y < image.height; y += 1) {
    for (let distance = 0; distance < band; distance += 1) {
      const leftX = distance;
      const rightX = image.width - 1 - distance;
      const leftOffset = (y * image.width + leftX) * 4;
      const rightOffset = (y * image.width + rightX) * 4;
      const progress = band === 1 ? 1 : distance / (band - 1);
      const smooth = progress * progress * (3 - 2 * progress);
      const leftAlpha = original[leftOffset + 3];
      const rightAlpha = original[rightOffset + 3];
      const pairAlpha = Math.max(leftAlpha, rightAlpha);
      const opaqueOffset = leftAlpha >= rightAlpha ? leftOffset : rightOffset;

      for (let channel = 0; channel < 3; channel += 1) {
        const pairColor = leftAlpha && rightAlpha
          ? Math.round((original[leftOffset + channel] + original[rightOffset + channel]) / 2)
          : original[opaqueOffset + channel];
        image.pixels[leftOffset + channel] = Math.round(pairColor + (original[leftOffset + channel] - pairColor) * smooth);
        image.pixels[rightOffset + channel] = Math.round(pairColor + (original[rightOffset + channel] - pairColor) * smooth);
      }
      image.pixels[leftOffset + 3] = Math.round(pairAlpha + (leftAlpha - pairAlpha) * smooth) >= 128 ? 255 : 0;
      image.pixels[rightOffset + 3] = Math.round(pairAlpha + (rightAlpha - pairAlpha) * smooth) >= 128 ? 255 : 0;
    }
  }
};

const quantizeBackground = (image, palette) => {
  for (let offset = 0; offset < image.pixels.length; offset += 4) {
    if (image.pixels[offset + 3] === 0) {
      image.pixels.set([0, 0, 0, 0], offset);
      continue;
    }
    const color = nearestColor(
      image.pixels[offset], image.pixels[offset + 1], image.pixels[offset + 2], palette,
    );
    image.pixels.set([...color, 255], offset);
  }
};

const upscaleBackground = (logical) => {
  const output = emptyImage(640, 360);
  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const sourceOffset = (Math.floor(y / 2) * logical.width + Math.floor(x / 2)) * 4;
      const targetOffset = (y * output.width + x) * 4;
      output.pixels.set(logical.pixels.subarray(sourceOffset, sourceOffset + 4), targetOffset);
    }
  }
  return output;
};

async function processBackground(spec) {
  const input = source('backgrounds', spec.file.replace('.png', '-source.png'));
  const image = await readPng(input);
  const logical = sampleBackground(image, spec.transparent);
  blendHorizontalSeam(logical);
  quantizeBackground(logical, spec.palette);
  const outputImage = upscaleBackground(logical);
  const output = target('backgrounds', spec.file);
  await mkdir(dirname(output), { recursive: true });
  await writePng(output, outputImage);
  return output;
}

const outputs = [
  await processBigotes(),
  ...await Promise.all(characterSheets.map(processCharacter)),
  await processEffect('player-attack', 6, 32),
  await processEffect('hit-spark', 6, 24),
  ...await Promise.all(backgroundSpecs.map(processBackground)),
];
outputs.forEach((output) => console.log(`Generated ${output}`));
