export const ASSET_MANIFEST = Object.freeze([
  { key: 'bigotes-sheet', file: 'bigotes-assets.png', width: 1024, height: 1536 },
  { key: 'crawler-sheet', file: 'rastrero-de-salmuera.png', width: 1536, height: 1024 },
  { key: 'yeast-sheet', file: 'golden-bubble-yeast.png', width: 1536, height: 1024 },
  { key: 'gate-sheet', file: 'rusty-undewater-portal.png', width: 1536, height: 1024 },
  { key: 'bakery-bg-1', file: 'panaderia-undida-bg-1.png', width: 1536, height: 1024 },
  { key: 'bakery-bg-2', file: 'panaderia-undida-bg-2.png', width: 1536, height: 1024 },
  { key: 'bakery-bg-3', file: 'panaderia-undida-bg-3.png', width: 1536, height: 1024 },
  { key: 'tileset', file: 'tileset.png', width: 1536, height: 1024 },
]);

const makeRow = (prefix, count, x, y, width, height, step = width) =>
  Array.from({ length: count }, (_, index) => ({
    name: `${prefix}-${index}`,
    x: x + step * index,
    y,
    width,
    height,
  }));

export const FRAME_MANIFEST = Object.freeze({
  'bigotes-sheet': [
    ...makeRow('bigotes-idle', 6, 16, 40, 160, 180, 166),
    ...makeRow('bigotes-swim', 6, 16, 230, 160, 180, 166),
    ...makeRow('bigotes-attack', 6, 16, 415, 160, 180, 166),
    ...makeRow('bigotes-hurt', 4, 16, 600, 190, 180, 205),
    ...makeRow('bigotes-defeat', 6, 16, 800, 170, 175, 166),
  ],
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
});

export function registerManifestFrames(scene) {
  Object.entries(FRAME_MANIFEST).forEach(([textureKey, frames]) => {
    if (!scene.textures.exists(textureKey)) {
      console.warn(`[Assets] Falta ${textureKey}; sus animaciones usarán fallback.`);
      return;
    }
    const texture = scene.textures.get(textureKey);
    frames.forEach(({ name, x, y, width, height }) => {
      if (x < 0 || y < 0 || x + width > texture.source[0].width || y + height > texture.source[0].height) {
        console.warn(`[Assets] Recorte inválido ${name}; se omite.`);
        return;
      }
      if (!texture.has(name)) texture.add(name, 0, x, y, width, height);
    });
  });
}
