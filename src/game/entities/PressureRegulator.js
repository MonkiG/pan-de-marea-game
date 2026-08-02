export class PressureRegulator {
  constructor(scene, data, assetResolver, active = false) {
    this.scene = scene;
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.radius = data.interactionRadius;
    this.state = active ? 'active' : 'inactive';
    const texture = assetResolver.resolve('pressureRegulator', 'fallback-regulator', ['pressure-regulator-0']);
    this.pixelAsset = texture === 'pressure-regulator-sheet';
    this.sprite = scene.add.image(
      this.x, this.y, texture, this.pixelAsset ? `pressure-regulator-${active ? 2 : 0}` : undefined,
    ).setOrigin(0.5, 1).setDepth(12);
    if (active && !this.pixelAsset) this.sprite.setTint(0xffc66b);
  }

  isNearby(player) {
    return Math.abs(player.x - this.x) <= this.radius && Math.abs(player.y - this.y) <= 125;
  }

  activate(onComplete) {
    if (this.state !== 'inactive') return false;
    this.state = 'activating';
    if (this.pixelAsset) this.sprite.setFrame('pressure-regulator-1');
    this.scene.tweens.add({
      targets: this.sprite, angle: 360, scale: 1.12, duration: 520,
      onComplete: () => {
        this.state = 'active';
        this.sprite.setAngle(0).setScale(1);
        if (this.pixelAsset) this.sprite.setFrame('pressure-regulator-2').clearTint();
        else this.sprite.setTint(0xffc66b);
        onComplete?.(this);
      },
    });
    return true;
  }
}
