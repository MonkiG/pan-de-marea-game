import { resolve } from 'node:path';
import { readPng } from './pixel-art-png.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const specs = [
  {
    path: 'assets/pixel-art/v1/characters/bigotes.png', width: 384, height: 512, colors: 16,
    frame: [48, 64], usedPerRow: [6, 8, 3, 4, 8, 4, 6, 4],
  },
  {
    path: 'assets/pixel-art/v1/characters/brine-crawler.png', width: 640, height: 336, colors: 16,
    frame: [80, 48], usedPerRow: [6, 8, 4, 8, 4, 4, 6],
  },
  {
    path: 'assets/pixel-art/v1/characters/abyssal-spitter.png', width: 640, height: 384, colors: 16,
    frame: [80, 64], usedPerRow: [6, 6, 6, 8, 4, 8],
  },
  {
    path: 'assets/pixel-art/v1/characters/black-coral-sentinel.png', width: 768, height: 784, colors: 16,
    frame: [96, 112], usedPerRow: [6, 4, 8, 8, 8, 4, 8],
  },
  {
    path: 'assets/pixel-art/v1/effects/player-attack.png', width: 192, height: 32, colors: 8,
    frame: [32, 32], usedPerRow: [6],
  },
  {
    path: 'assets/pixel-art/v1/effects/hit-spark.png', width: 144, height: 24, colors: 8,
    frame: [24, 24], usedPerRow: [6],
  },
  ...[
    ['panaderia-undida-bg-1.png', 'opaque'],
    ['panaderia-undida-bg-2.png', 'opaque'],
    ['panaderia-undida-bg-3.png', 'transparent'],
    ['mercado-undido-1.png', 'opaque'],
    ['mercado-undido-2.png', 'opaque'],
    ['mercado-undido-3.png', 'transparent'],
  ].map(([file, alphaMode]) => ({
    path: `assets/pixel-art/v1/backgrounds/${file}`,
    width: 640,
    height: 360,
    colors: 24,
    alphaMode,
    seamless: true,
    pixelBlock: 2,
  })),
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

function validateSeam(image) {
  let mismatches = 0;
  for (let y = 0; y < image.height; y += 1) {
    const left = (y * image.width) * 4;
    const right = (y * image.width + image.width - 1) * 4;
    for (let channel = 0; channel < 4; channel += 1) {
      if (image.pixels[left + channel] !== image.pixels[right + channel]) mismatches += 1;
    }
  }
  return mismatches;
}

function validatePixelBlocks(image, blockSize) {
  let mismatches = 0;
  for (let y = 0; y < image.height; y += blockSize) {
    for (let x = 0; x < image.width; x += blockSize) {
      const anchor = (y * image.width + x) * 4;
      for (let blockY = 0; blockY < blockSize; blockY += 1) {
        for (let blockX = 0; blockX < blockSize; blockX += 1) {
          const sample = ((y + blockY) * image.width + x + blockX) * 4;
          for (let channel = 0; channel < 4; channel += 1) {
            if (image.pixels[anchor + channel] !== image.pixels[sample + channel]) mismatches += 1;
          }
        }
      }
    }
  }
  return mismatches;
}

function centerCoverage(image) {
  let visible = 0;
  let total = 0;
  for (let y = Math.floor(image.height * 0.18); y < Math.ceil(image.height * 0.82); y += 1) {
    for (let x = Math.floor(image.width * 0.2); x < Math.ceil(image.width * 0.8); x += 1) {
      total += 1;
      if (image.pixels[(y * image.width + x) * 4 + 3] === 255) visible += 1;
    }
  }
  return visible / total;
}

let failed = false;
for (const spec of specs) {
  const image = await readPng(resolve(ROOT, spec.path));
  const colors = new Set();
  let partialAlpha = 0;
  let visible = 0;
  let transparent = 0;
  for (let index = 0; index < image.pixels.length; index += 4) {
    const alpha = image.pixels[index + 3];
    if (alpha > 0 && alpha < 255) partialAlpha += 1;
    if (alpha === 0) {
      transparent += 1;
      continue;
    }
    visible += 1;
    colors.add(`${image.pixels[index]},${image.pixels[index + 1]},${image.pixels[index + 2]}`);
  }

  const errors = [];
  if (image.width !== spec.width || image.height !== spec.height) errors.push(`dimensiones ${image.width}x${image.height}`);
  if (spec.frame && (image.width % spec.frame[0] !== 0 || image.height % spec.frame[1] !== 0)) errors.push('cuadricula irregular');
  if (colors.size > spec.colors) errors.push(`${colors.size} colores (maximo ${spec.colors})`);
  if (partialAlpha > 0) errors.push(`${partialAlpha} pixeles con alpha parcial`);
  if (visible === 0) errors.push('asset vacio');

  if (spec.alphaMode === 'opaque' && transparent > 0) errors.push(`${transparent} pixeles transparentes en capa opaca`);
  if (spec.alphaMode === 'transparent') {
    const coverage = visible / (image.width * image.height);
    if (transparent === 0) errors.push('capa cercana sin transparencia');
    if (coverage < 0.02 || coverage > 0.45) errors.push(`cobertura cercana ${(coverage * 100).toFixed(1)}%`);
    if (centerCoverage(image) > 0.12) errors.push('zona central demasiado cubierta');
  }
  if (spec.seamless) {
    const mismatches = validateSeam(image);
    if (mismatches > 0) errors.push(`${mismatches} diferencias en costura horizontal`);
  }
  if (spec.pixelBlock) {
    const mismatches = validatePixelBlocks(image, spec.pixelBlock);
    if (mismatches > 0) errors.push(`${mismatches} diferencias en bloques ${spec.pixelBlock}x${spec.pixelBlock}`);
  }

  if (spec.frame) {
    const columns = image.width / spec.frame[0];
    const rows = image.height / spec.frame[1];
    if (Number.isInteger(columns) && Number.isInteger(rows)) {
      for (let row = 0; row < rows; row += 1) {
        const used = spec.usedPerRow[row] ?? 0;
        for (let column = 0; column < columns; column += 1) {
          const cellPixels = visiblePixelsInCell(image, spec.frame[0], spec.frame[1], column, row);
          if (column < used && cellPixels === 0) errors.push(`celda requerida vacia ${column},${row}`);
          if (column >= used && cellPixels > 0) errors.push(`contenido inesperado en celda ${column},${row}`);
        }
      }
    }
  }

  if (errors.length) {
    failed = true;
    console.error(`FAIL ${spec.path}: ${errors.join(', ')}`);
  } else {
    console.log(`PASS ${spec.path}: ${image.width}x${image.height}, ${colors.size} colores, alpha ${spec.alphaMode ?? 'binario'}`);
  }
}

if (failed) process.exitCode = 1;
