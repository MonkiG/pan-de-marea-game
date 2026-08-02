import { FALLBACK_DEFINITIONS } from '../assets/fallbackDefinitions.js';

export class FallbackFactory {
  static createAll(scene) {
    FALLBACK_DEFINITIONS.forEach(({ key, width, height, draw }) => {
      if (scene.textures.exists(key)) return;
      const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
      draw(graphics, width, height);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    });
  }
}
