import { IS_PIXEL_ART_V1 } from '../art/artProfile.js';

export class ThermalGate {
  constructor(scene, data) {
    this.scene = scene;
    this.x = data.x;
    this.y = data.y;
    this.radius = data.interactionRadius;
    this.state = 'inactive';
    const texture = scene.textures.exists('gate-sheet') ? 'gate-sheet' : 'fallback-gate';
    const frame = scene.textures.get(texture).has('gate-inactive-0') ? 'gate-inactive-0' : undefined;
    this.sprite = scene.add.sprite(this.x, this.y, texture, frame)
      .setOrigin(0.5, IS_PIXEL_ART_V1 && texture === 'gate-sheet' ? 1 : 0.82);
    this.sprite.setScale(texture === 'fallback-gate' || (IS_PIXEL_ART_V1 && texture === 'gate-sheet') ? 1 : 0.54);
    if (scene.anims.exists('gate-inactive')) this.sprite.play('gate-inactive');
  }

  isNearby(player) {
    return Math.abs(player.x - this.x) <= this.radius && Math.abs(player.y - this.y) < 140;
  }

  activate(onComplete) {
    if (this.state !== 'inactive') return false;
    this.state = 'activating';
    if (this.scene.anims.exists('gate-activate')) this.sprite.play('gate-activate');
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: this.sprite.scaleX * 1.04,
      scaleY: this.sprite.scaleY * 1.04,
      yoyo: true,
      repeat: 3,
      duration: 220,
      onComplete: () => {
        this.state = 'active';
        if (this.scene.anims.exists('gate-active')) this.sprite.play('gate-active');
        onComplete?.();
      },
    });
    return true;
  }
}
