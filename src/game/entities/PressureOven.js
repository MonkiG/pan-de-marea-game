export class PressureOven {
  constructor(scene, data, assetResolver) {
    this.scene = scene;
    this.x = data.x;
    this.y = data.y;
    this.radius = data.interactionRadius;
    this.state = 'inactive';
    const texture = assetResolver.resolve('pressureOven', 'fallback-pressure-oven');
    this.sprite = scene.add.image(this.x, this.y, texture).setOrigin(0.5, 1).setDepth(12);
    this.glow = scene.add.circle(this.x, this.y - 44, 42, 0x42e6cd, 0.08).setDepth(11);
  }

  isNearby(player) {
    return Math.abs(player.x - this.x) <= this.radius && Math.abs(player.y - this.y) <= 135;
  }

  setAvailable(available) {
    if (['baking', 'complete'].includes(this.state)) return;
    this.state = available ? 'available' : 'inactive';
    this.sprite.setTint(available ? 0xb9fff0 : 0xffffff);
    this.glow.setAlpha(available ? 0.28 : 0.08);
  }

  bake(duration, onComplete) {
    if (['baking', 'complete'].includes(this.state)) return false;
    this.state = 'baking';
    this.scene.tweens.add({ targets: this.glow, alpha: 0.75, scale: 1.55, yoyo: true, repeat: 4, duration: duration / 8 });
    this.scene.tweens.add({
      targets: this.sprite, tint: 0xffb94f, duration,
      onComplete: () => {
        this.state = 'complete';
        this.sprite.setTint(0xffd479);
        onComplete?.();
      },
    });
    return true;
  }
}
