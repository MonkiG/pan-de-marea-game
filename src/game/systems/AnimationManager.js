import { ANIMATION_DATA } from '../data/animationData.js';

export function createAnimations(scene) {
  ANIMATION_DATA.forEach((definition) => {
    if (scene.anims.exists(definition.key)) return;
    const texture = scene.textures.get(definition.texture);
    const frames = Array.from({ length: definition.count }, (_, index) => ({
      key: definition.texture,
      frame: `${definition.prefix}-${index}`,
    })).filter(({ frame }) => texture?.has(frame));

    if (frames.length === 0) {
      console.warn(`[Animaciones] ${definition.key} no tiene frames; se usará imagen estática.`);
      return;
    }
    scene.anims.create({
      key: definition.key,
      frames,
      frameRate: definition.frameRate,
      repeat: definition.repeat,
    });
  });
}
