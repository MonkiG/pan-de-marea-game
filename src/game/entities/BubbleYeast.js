import Phaser from 'phaser';

export class BubbleYeast extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, data) {
    const texture = scene.textures.exists('yeast-sheet') ? 'yeast-sheet' : 'fallback-yeast';
    const frame = scene.textures.get(texture).has('yeast-idle-0') ? 'yeast-idle-0' : undefined;
    super(scene, data.x, data.y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(13);
    this.id = data.id;
    this.collected = false;
    this.setScale(texture === 'fallback-yeast' ? 1 : 0.32);
    this.body.setAllowGravity(false);
    this.setCircle(texture === 'fallback-yeast' ? 11 : 45, texture === 'fallback-yeast' ? 1 : 40, texture === 'fallback-yeast' ? 1 : 42);
    if (scene.anims.exists('yeast-idle')) this.play('yeast-idle');
    scene.tweens.add({ targets: this, y: this.y - 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  updateAttraction(player) {
    if (this.collected) return;
    const near = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 120;
    if (near && this.scene.anims.exists('yeast-attract')) this.play('yeast-attract', true);
    else if (!near && this.scene.anims.exists('yeast-idle')) this.play('yeast-idle', true);
    this.setScale((this.texture.key === 'fallback-yeast' ? 1 : 0.32) * (near ? 1.08 : 1));
  }

  collect(onComplete) {
    if (this.collected) return false;
    this.collected = true;
    this.body.enable = false;
    if (this.scene.anims.exists('yeast-collect')) this.play('yeast-collect', false);
    this.scene.tweens.add({
      targets: this,
      y: this.y - 28,
      alpha: 0,
      scale: this.scale * 1.35,
      duration: 320,
      onComplete: () => {
        onComplete?.();
        this.destroy();
      },
    });
    return true;
  }
}
