import { IS_PIXEL_ART_V1 } from './artProfile.js';

const VIEWPORT_WIDTH = 640;
const VIEWPORT_HEIGHT = 360;
const LEGACY_SCALE = VIEWPORT_WIDTH / 1536;

const profile = IS_PIXEL_ART_V1
  ? Object.freeze({ tileScale: 1, tilePositionY: 0, overlayAlpha: 0.1 })
  : Object.freeze({ tileScale: LEGACY_SCALE, tilePositionY: 80, overlayAlpha: 0.18 });

export const BACKGROUND_LAYOUTS = Object.freeze({
  bakery: Object.freeze([
    Object.freeze({ id: 'bakeryBackgroundFar', key: 'bakery-bg-1', factor: 0.06, pixelAlpha: 1, legacyAlpha: 0.78, depth: 0 }),
    Object.freeze({ id: 'bakeryBackgroundMid', key: 'bakery-bg-2', factor: 0.18, pixelAlpha: 0.58, legacyAlpha: 0.58, depth: 1 }),
    Object.freeze({ id: 'bakeryBackgroundNear', key: 'bakery-bg-3', factor: 0.34, pixelAlpha: 0.76, legacyAlpha: 0.34, depth: 3 }),
  ]),
  market: Object.freeze([
    Object.freeze({ id: 'marketBackgroundFar', key: 'market-bg-1', factor: 0.05, pixelAlpha: 1, legacyAlpha: 0.8, depth: 0 }),
    Object.freeze({ id: 'marketBackgroundMid', key: 'market-bg-2', factor: 0.16, pixelAlpha: 0.52, legacyAlpha: 0.5, depth: 1 }),
    Object.freeze({ id: 'marketBackgroundNear', key: 'market-bg-3', factor: 0.32, pixelAlpha: 0.68, legacyAlpha: 0.3, depth: 3 }),
  ]),
});

export function createParallaxBackground(scene, {
  worldWidth,
  worldHeight,
  baseColor,
  overlayColor,
  layers,
  resolveTexture,
}) {
  scene.add.rectangle(0, 0, worldWidth, worldHeight, baseColor).setOrigin(0).setDepth(-1);
  layers.forEach((layer) => {
    const texture = resolveTexture(layer);
    if (!texture || !scene.textures.exists(texture)) return;
    const tile = scene.add.tileSprite(0, 0, worldWidth + VIEWPORT_WIDTH, VIEWPORT_HEIGHT, texture)
      .setOrigin(0)
      .setScrollFactor(layer.factor, 0)
      .setAlpha(IS_PIXEL_ART_V1 ? layer.pixelAlpha : layer.legacyAlpha)
      .setDepth(layer.depth);
    tile.setTileScale(profile.tileScale, profile.tileScale);
    tile.tilePositionY = profile.tilePositionY;
  });
  scene.add.rectangle(0, 0, worldWidth, worldHeight, overlayColor, profile.overlayAlpha)
    .setOrigin(0)
    .setDepth(2);
}
