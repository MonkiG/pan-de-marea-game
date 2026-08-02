import { IS_PIXEL_ART_V1 } from './artProfile.js';

export const hasPixelTileset = (scene, texture = 'tileset') => IS_PIXEL_ART_V1
  && scene.textures.exists(texture)
  && scene.textures.get(texture).has('tile-platform-center')
  && scene.textures.get(texture).has('tile-floor');

export function createPixelFloor(scene, { texture = 'tileset', worldWidth, top, depth = 8 }) {
  return scene.add.tileSprite(worldWidth / 2, top, worldWidth, 36, texture, 'tile-floor')
    .setOrigin(0.5, 0)
    .setDepth(depth);
}

export function createPixelPlatform(scene, { texture = 'tileset', x, top, width, depth = 8 }) {
  const capWidth = Math.min(32, Math.floor(width / 2));
  const centerWidth = Math.max(0, width - capWidth * 2);
  const left = x - width / 2;
  const pieces = [];
  pieces.push(scene.add.image(left, top, texture, 'tile-platform-left')
    .setOrigin(0, 0)
    .setDisplaySize(capWidth, 12)
    .setDepth(depth));
  if (centerWidth > 0) {
    pieces.push(scene.add.tileSprite(left + capWidth, top, centerWidth, 12, texture, 'tile-platform-center')
      .setOrigin(0, 0)
      .setDepth(depth));
  }
  pieces.push(scene.add.image(left + width, top, texture, 'tile-platform-right')
    .setOrigin(1, 0)
    .setDisplaySize(capWidth, 12)
    .setDepth(depth));
  return pieces;
}

export function playPixelEffect(scene, x, y, type = 'warm') {
  if (!IS_PIXEL_ART_V1) return false;
  const definitions = {
    warm: ['warm-burst-effect', 'warm-burst-effect-animation'],
    pressure: ['pressure-burst-effect', 'pressure-burst-effect-animation'],
    yeast: ['yeast-collect-effect', 'yeast-collect-effect-animation'],
    hit: ['enemy-hit-effect', 'enemy-hit-effect-animation'],
  };
  const [texture, animation] = definitions[type] ?? definitions.warm;
  if (!scene.textures.exists(texture) || !scene.anims.exists(animation)) return false;
  const effect = scene.add.sprite(x, y, texture, `${texture}-0`).setDepth(20);
  effect.play(animation);
  effect.once('animationcomplete', () => effect.destroy());
  return true;
}
