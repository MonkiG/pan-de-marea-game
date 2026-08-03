import Phaser from 'phaser';

const SHEET = 'baguette-torpedo-projectile-sheet';
const IMPACT_SHEET = 'baguette-impact-sheet';

/**
 * Proyectil de la Baguette Torpedo. Sigue el patrón de
 * {@link CorruptedDoughProjectile}: vuelo horizontal, sin gravedad y reciclado
 * desde un pool. Causa daño mediante `enemy.takeDamage(damage, x)` y sólo
 * genera el efecto de impacto cuando el golpe se confirma.
 */
export class BaguetteTorpedoProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = -100, y = -100) {
    const pixelAsset = scene.textures.exists(SHEET)
      && scene.textures.get(SHEET).has('baguette-torpedo-projectile-0');
    super(scene, x, y, pixelAsset ? SHEET : 'fallback-projectile', pixelAsset ? 'baguette-torpedo-projectile-0' : undefined);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(17);
    this.body.setAllowGravity(false);
    this.setActive(false).setVisible(false);
    this.expiresAt = 0;
    this.damage = 0;
  }

  fire(x, y, facing, recipe) {
    const direction = facing < 0 ? -1 : 1;
    this.damage = recipe.damage;
    this.expiresAt = this.scene.time.now + recipe.lifetimeMs;
    this.enableBody(true, x, y, true, true);
    const { width, height, offsetX, offsetY } = recipe.collider;
    this.setSize(width, height).setOffset(offsetX, offsetY);
    this.setFlipX(direction < 0);
    this.setAlpha(1).setScale(1);
    this.setVelocity(recipe.speed * direction, 0);
    if (this.scene.anims.exists('baguette-torpedo-projectile-animation')) {
      this.play('baguette-torpedo-projectile-animation');
    }
    this.scene.audioManager?.play('baguette-launch');
    return this;
  }

  update(time) {
    if (!this.active) return;
    const worldBounds = new Phaser.Geom.Rectangle(
      0, 0, this.scene.physics.world.bounds.width, this.scene.physics.world.bounds.height,
    );
    if (time >= this.expiresAt || !Phaser.Geom.Rectangle.Overlaps(worldBounds, this.getBounds())) {
      this.deactivate();
    }
  }

  /**
   * Impacta a un enemigo. Desactiva el proyectil aunque el enemigo rechace el
   * daño (evita golpes repetidos) y sólo crea el efecto si el golpe se confirma.
   */
  impactEnemy(enemy) {
    if (!this.active || !enemy?.active) return false;
    const confirmed = enemy.takeDamage(this.damage, this.x);
    if (confirmed) {
      this.spawnImpact();
      this.scene.audioManager?.play('baguette-impact');
    }
    this.deactivate();
    return confirmed;
  }

  /** Impacto contra suelo, plataforma u obstáculo: sólo desaparece. */
  impactSurface() {
    if (!this.active) return;
    this.deactivate();
  }

  spawnImpact() {
    if (!this.scene.textures.exists(IMPACT_SHEET)
      || !this.scene.anims.exists('baguette-impact-animation')) return;
    const effect = this.scene.add.sprite(this.x, this.y, IMPACT_SHEET, 'baguette-impact-0')
      .setDepth(20)
      .setFlipX(this.flipX);
    effect.play('baguette-impact-animation');
    effect.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => effect.destroy());
    this.scene.time.delayedCall(500, () => effect.active && effect.destroy());
  }

  deactivate() {
    if (!this.active) return;
    this.disableBody(true, true);
  }
}
