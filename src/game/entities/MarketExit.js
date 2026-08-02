export class MarketExit {
  constructor(scene, data, assetResolver) {
    this.scene = scene;
    this.x = data.x;
    this.y = data.y;
    this.radius = data.interactionRadius;
    this.state = 'inactive';
    const texture = assetResolver.resolve('marketExit', 'fallback-market-exit', ['market-exit-0']);
    this.pixelAsset = texture === 'market-exit-sheet';
    this.sprite = scene.add.image(
      this.x, this.y, texture, this.pixelAsset ? 'market-exit-0' : undefined,
    ).setOrigin(0.5, 1).setDepth(12);
  }

  isNearby(player) {
    return Math.abs(player.x - this.x) <= this.radius && Math.abs(player.y - this.y) <= 160;
  }

  activate(onComplete) {
    if (this.state !== 'inactive') return false;
    this.state = 'activating';
    if (this.pixelAsset) this.sprite.setFrame('market-exit-1');
    this.scene.tweens.add({
      targets: this.sprite, scaleX: 1.08, scaleY: 1.04, tint: 0x73ffe0,
      yoyo: true, repeat: 4, duration: 190,
      onComplete: () => {
        this.state = 'active';
        if (this.pixelAsset) this.sprite.setFrame('market-exit-2').clearTint();
        else this.sprite.setTint(0xb7ffdc);
        onComplete?.();
      },
    });
    return true;
  }
}
