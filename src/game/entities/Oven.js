export class Oven {
  constructor(scene, data) {
    this.scene = scene;
    this.x = data.x;
    this.y = data.y;
    this.radius = data.interactionRadius;
    this.state = 'inactive';
    this.sprite = scene.add.image(this.x, this.y, 'fallback-oven').setOrigin(0.5, 1);
    this.glow = scene.add.circle(this.x, this.y - 42, 38, 0xff9e3d, 0.08);
  }

  isNearby(player) {
    return Math.abs(player.x - this.x) <= this.radius && Math.abs(player.y - this.y) < 120;
  }

  setAvailable(available) {
    if (this.state === 'baking' || this.state === 'complete') return;
    this.state = available ? 'available' : 'inactive';
    this.sprite.setTint(available ? 0xffd18a : 0xffffff);
    this.glow.setAlpha(available ? 0.2 : 0.08);
  }

  bake(duration, onComplete) {
    if (this.state === 'baking' || this.state === 'complete') return false;
    this.state = 'baking';
    this.scene.tweens.add({ targets: this.glow, alpha: 0.65, scale: 1.45, yoyo: true, repeat: 4, duration: duration / 8 });
    this.scene.tweens.add({
      targets: this.sprite,
      tint: 0xff7a2e,
      duration,
      onComplete: () => {
        this.state = 'complete';
        this.sprite.setTint(0xffb04f);
        onComplete?.();
      },
    });
    return true;
  }
}
