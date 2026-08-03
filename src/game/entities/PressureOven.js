export class PressureOven {
  constructor(scene, data, assetResolver) {
    this.scene = scene;
    this.x = data.x;
    this.y = data.y;
    this.radius = data.interactionRadius;
    this.state = 'inactive';
    const texture = assetResolver.resolve('pressureOven', 'fallback-pressure-oven', ['pressure-oven-0']);
    this.pixelAsset = texture === 'pressure-oven-sheet';
    this.sprite = scene.add.image(
      this.x, this.y, texture, this.pixelAsset ? 'pressure-oven-0' : undefined,
    ).setOrigin(0.5, 1).setDepth(12);
    this.glow = scene.add.circle(this.x, this.y - 44, 42, 0x42e6cd, 0.08).setDepth(11);
  }

  isNearby(player) {
    return Math.abs(player.x - this.x) <= this.radius && Math.abs(player.y - this.y) <= 135;
  }

  setAvailable(available) {
    if (['baking', 'complete'].includes(this.state)) return;
    this.state = available ? 'available' : 'inactive';
    if (this.pixelAsset) this.sprite.setFrame(available ? 'pressure-oven-1' : 'pressure-oven-0');
    else this.sprite.setTint(available ? 0xb9fff0 : 0xffffff);
    this.glow.setAlpha(available ? 0.28 : 0.08);
  }

  /** Destello breve para elaborar un pan especial sin alterar el estado de misión. */
  pulse(duration, onComplete) {
    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.6,
      scale: 1.4,
      yoyo: true,
      duration: Math.max(120, duration / 2),
      onComplete: () => onComplete?.(),
    });
    return true;
  }

  bake(duration, onComplete) {
    if (['baking', 'complete'].includes(this.state)) return false;
    this.state = 'baking';
    if (this.pixelAsset) this.sprite.setFrame('pressure-oven-2');
    this.scene.tweens.add({ targets: this.glow, alpha: 0.75, scale: 1.55, yoyo: true, repeat: 4, duration: duration / 8 });
    this.scene.tweens.add({
      targets: this.sprite, tint: 0xffb94f, duration,
      onComplete: () => {
        this.state = 'complete';
        if (this.pixelAsset) this.sprite.setFrame('pressure-oven-3').clearTint();
        else this.sprite.setTint(0xffd479);
        onComplete?.();
      },
    });
    return true;
  }
}
