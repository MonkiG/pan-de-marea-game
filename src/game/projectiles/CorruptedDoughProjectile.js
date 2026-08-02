import Phaser from 'phaser';

export class CorruptedDoughProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = -100, y = -100) {
    const pixelAsset = scene.textures.exists('corrupted-projectile-sheet')
      && scene.textures.get('corrupted-projectile-sheet').has('corrupted-projectile-0');
    super(scene, x, y, pixelAsset ? 'corrupted-projectile-sheet' : 'fallback-projectile', pixelAsset ? 'corrupted-projectile-0' : undefined);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(16);
    this.setCircle(pixelAsset ? 7 : 8, pixelAsset ? 5 : 1, pixelAsset ? 5 : 1);
    this.body.setAllowGravity(false);
    this.setActive(false).setVisible(false);
    this.expiresAt = 0;
    this.owner = null;
  }

  fire(x, y, velocityX, velocityY, owner, lifetimeMs = 4200) {
    this.owner = owner;
    this.expiresAt = this.scene.time.now + lifetimeMs;
    this.enableBody(true, x, y, true, true);
    this.setVelocity(velocityX, velocityY);
    this.setAlpha(1).setScale(1);
    if (this.scene.anims.exists('corrupted-projectile-animation')) this.play('corrupted-projectile-animation');
    return this;
  }

  update(time) {
    if (!this.active) return;
    this.rotation += 0.035;
    if (time >= this.expiresAt || !Phaser.Geom.Rectangle.Overlaps(
      new Phaser.Geom.Rectangle(0, 0, this.scene.physics.world.bounds.width, this.scene.physics.world.bounds.height),
      this.getBounds(),
    )) this.deactivate();
  }

  deactivate() {
    if (!this.active) return;
    this.disableBody(true, true);
    this.owner = null;
  }
}
