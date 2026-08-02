import { getLoadableAssets } from './assets/assetRegistry.js';
import { IS_PIXEL_ART_V1 } from './art/artProfile.js';

export const ASSET_MANIFEST = Object.freeze(getLoadableAssets().map((asset) => ({
  key: asset.key,
  file: asset.path,
  width: asset.width,
  height: asset.height,
})));

const makeRow = (prefix, count, x, y, width, height, step = width) =>
  Array.from({ length: count }, (_, index) => ({
    name: `${prefix}-${index}`,
    x: x + step * index,
    y,
    width,
    height,
  }));

export const BIGOTES_LEGACY_FRAMES = Object.freeze([
  ...makeRow('bigotes-idle', 6, 16, 40, 160, 180, 166),
  ...makeRow('bigotes-swim', 6, 16, 230, 160, 180, 166),
  ...makeRow('bigotes-attack', 6, 16, 415, 160, 180, 166),
  ...makeRow('bigotes-hurt', 4, 16, 600, 190, 180, 205),
  ...makeRow('bigotes-defeat', 6, 16, 800, 170, 175, 166),
]);

export const BIGOTES_PIXEL_FRAMES = Object.freeze([
  ...makeRow('bigotes-idle', 6, 0, 0, 48, 64),
  ...makeRow('bigotes-swim', 8, 0, 64, 48, 64),
  ...makeRow('bigotes-jump', 3, 0, 128, 48, 64),
  ...makeRow('bigotes-fall', 4, 0, 192, 48, 64),
  ...makeRow('bigotes-attack', 8, 0, 256, 48, 64),
  ...makeRow('bigotes-hurt', 4, 0, 320, 48, 64),
  ...makeRow('bigotes-defeat', 6, 0, 384, 48, 64),
  ...makeRow('bigotes-interact', 4, 0, 448, 48, 64),
]);

export const FRAME_MANIFEST = Object.freeze({
  'bigotes-sheet': [
    ...(IS_PIXEL_ART_V1 ? BIGOTES_PIXEL_FRAMES : BIGOTES_LEGACY_FRAMES),
  ],
  ...(IS_PIXEL_ART_V1 ? {
    'player-attack-effect': makeRow('player-attack-effect', 6, 0, 0, 32, 32),
    'hit-spark': makeRow('hit-spark', 6, 0, 0, 24, 24),
  } : {}),
  'crawler-sheet': [
    ...makeRow('crawler-idle', 6, 205, 45, 195, 145, 195),
    ...makeRow('crawler-patrol', 6, 165, 205, 190, 145, 170),
    ...makeRow('crawler-attack', 6, 165, 340, 200, 150, 195),
    ...makeRow('crawler-hurt', 5, 195, 495, 210, 145, 200),
    ...makeRow('crawler-defeat', 5, 205, 640, 205, 135, 190),
  ],
  'yeast-sheet': [
    ...makeRow('yeast-idle', 6, 275, 80, 165, 175, 170),
    ...makeRow('yeast-attract', 5, 275, 340, 175, 180, 170),
    ...makeRow('yeast-collect', 6, 275, 585, 170, 190, 170),
  ],
  'gate-sheet': [
    ...makeRow('gate-inactive', 6, 0, 35, 256, 290, 256),
    ...makeRow('gate-activate', 6, 0, 330, 256, 290, 256),
    ...makeRow('gate-active', 6, 0, 620, 256, 290, 256),
  ],
  tileset: [
    { name: 'tile-platform-small', x: 45, y: 20, width: 135, height: 90 },
    { name: 'tile-platform-long', x: 45, y: 600, width: 395, height: 110 },
    { name: 'tile-rocks', x: 610, y: 720, width: 305, height: 140 },
    { name: 'tile-coral', x: 1180, y: 720, width: 125, height: 130 },
  ],
  'spitter-sheet': [
    ...makeRow('spitter-idle', 6, 60, 28, 180, 122, 176),
    ...makeRow('spitter-charge', 4, 60, 402, 180, 112, 176),
    ...makeRow('spitter-attack', 5, 60, 278, 180, 124, 176),
    ...makeRow('spitter-hurt', 4, 60, 515, 180, 110, 176),
    ...makeRow('spitter-defeat', 6, 60, 842, 180, 130, 176),
  ],
  'sentinel-sheet': [
    ...makeRow('sentinel-idle', 6, 18, 38, 165, 195, 165),
    ...makeRow('sentinel-walk', 6, 18, 278, 165, 195, 165),
    ...makeRow('sentinel-attack', 6, 18, 485, 165, 215, 165),
    ...makeRow('sentinel-hurt', 6, 18, 735, 165, 185, 165),
    ...makeRow('sentinel-charge', 6, 18, 955, 165, 190, 165),
    ...makeRow('sentinel-defeat', 6, 18, 1185, 165, 200, 165),
  ],
});

export function registerTextureFrames(scene, textureKey, frames) {
  if (!scene.textures.exists(textureKey)) {
    console.warn(`[Assets] Falta ${textureKey}; sus animaciones usarán fallback.`);
    return false;
  }
  const texture = scene.textures.get(textureKey);
  frames.forEach(({ name, x, y, width, height }) => {
    if (x < 0 || y < 0 || x + width > texture.source[0].width || y + height > texture.source[0].height) {
      console.warn(`[Assets] Recorte inválido ${name}; se omite.`);
      return;
    }
    if (!texture.has(name)) texture.add(name, 0, x, y, width, height);
  });
  return true;
}

export function registerManifestFrames(scene) {
  Object.entries(FRAME_MANIFEST).forEach(([textureKey, frames]) => {
    registerTextureFrames(scene, textureKey, frames);
  });
}
