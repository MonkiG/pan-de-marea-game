import Phaser from 'phaser';
import { PLAYER } from '../constants.js';
import { applyDamage } from '../systems/CombatSystem.js';

const safePlay = (sprite, key, ignoreIfPlaying = true) => {
  if (sprite.scene.anims.exists(key)) sprite.play(key, ignoreIfPlaying);
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    const texture = scene.textures.exists('bigotes-sheet') ? 'bigotes-sheet' : 'fallback-player';
    const frame = scene.textures.get(texture).has('bigotes-idle-0') ? 'bigotes-idle-0' : undefined;
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(texture === 'fallback-player' ? 1 : 0.42);
    this.setOrigin(0.5, 0.82);
    this.setSize(PLAYER.collider.width, PLAYER.collider.height)
      .setOffset(PLAYER.collider.offsetX, PLAYER.collider.offsetY);
    this.setCollideWorldBounds(true);
    this.body.setGravityY(PLAYER.gravity - scene.physics.world.gravity.y);
    this.setMaxVelocity(PLAYER.maxRunSpeed, PLAYER.maxFallSpeed);
    this.setDragX(PLAYER.groundDrag);

    this.health = PLAYER.maxHealth;
    this.invulnerableUntil = 0;
    this.lastGroundedAt = 0;
    this.jumpQueuedAt = -Infinity;
    this.lastAttackAt = -Infinity;
    this.jumpStartedAt = -Infinity;
    this.jumpCutApplied = true;
    this.facing = 1;
    this.controlsEnabled = true;
    this.isAttacking = false;
    this.isDefeated = false;
    this.hitThisAttack = new Set();

    this.keys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      attack: Phaser.Input.Keyboard.KeyCodes.J,
      attackAlt: Phaser.Input.Keyboard.KeyCodes.X,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      interactAlt: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });
    this.cursors = scene.input.keyboard.createCursorKeys();

    this.attackZone = scene.add.zone(x, y, 58, 48);
    scene.physics.add.existing(this.attackZone);
    this.attackZone.body.setAllowGravity(false);
    this.attackZone.body.enable = false;
    safePlay(this, 'bigotes-idle');
  }

  update(time) {
    if (!this.controlsEnabled || this.isDefeated) {
      this.setAccelerationX(0);
      this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.2));
      this.syncAttackZone();
      return;
    }

    const grounded = this.isGrounded();
    if (grounded) this.lastGroundedAt = time;

    const left = this.keys.left.isDown || this.cursors.left.isDown;
    const right = this.keys.right.isDown || this.cursors.right.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.jump)
      || Phaser.Input.Keyboard.JustDown(this.keys.up)
      || Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const jumpHeld = this.keys.jump.isDown || this.keys.up.isDown || this.cursors.up.isDown;
    const attackPressed = Phaser.Input.Keyboard.JustDown(this.keys.attack)
      || Phaser.Input.Keyboard.JustDown(this.keys.attackAlt);

    if (jumpPressed) this.jumpQueuedAt = time;
    if (time - this.jumpQueuedAt <= PLAYER.jumpBufferMs
      && time - this.lastGroundedAt <= PLAYER.coyoteTimeMs) {
      this.setVelocityY(PLAYER.jumpVelocity);
      this.jumpStartedAt = time;
      this.jumpCutApplied = false;
      this.jumpQueuedAt = -Infinity;
      this.lastGroundedAt = -Infinity;
      this.scene.audioManager?.play('jump');
    }

    if (!jumpHeld && !this.jumpCutApplied
      && time - this.jumpStartedAt >= PLAYER.minimumJumpHoldMs
      && this.body.velocity.y < -60) {
      this.setVelocityY(this.body.velocity.y * PLAYER.jumpReleaseMultiplier);
      this.jumpCutApplied = true;
    }

    const falling = this.body.velocity.y > 0;
    this.body.setGravityY(
      PLAYER.gravity * (falling ? PLAYER.fallGravityMultiplier : 1)
        - this.scene.physics.world.gravity.y,
    );
    this.setDragX(grounded ? PLAYER.groundDrag : PLAYER.airDrag);

    if (!this.isAttacking) {
      if (left === right) {
        this.setAccelerationX(0);
      } else {
        this.facing = left ? -1 : 1;
        this.setFlipX(this.facing < 0);
        const acceleration = grounded ? PLAYER.groundAcceleration : PLAYER.airAcceleration;
        this.setAccelerationX(acceleration * this.facing);
      }
    }

    if (attackPressed) this.attack(time);

    if (!this.isAttacking) {
      if (!grounded) safePlay(this, 'bigotes-swim');
      else if (Math.abs(this.body.velocity.x) > 12) safePlay(this, 'bigotes-swim');
      else safePlay(this, 'bigotes-idle');
    }

    this.syncAttackZone();
  }

  isGrounded() {
    if (this.body.blocked.down || this.body.touching.down || this.body.onFloor()) return true;
    if (this.body.velocity.y < 0) return false;
    const check = this.getGroundCheckRect();
    return this.scene.walkableSurfaces?.getChildren().some((surface) => {
      const body = surface.body;
      if (!body?.enable) return false;
      const surfaceRect = new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
      return Phaser.Geom.Intersects.RectangleToRectangle(check, surfaceRect);
    }) ?? false;
  }

  getGroundCheckRect() {
    const inset = PLAYER.groundCheckInset;
    return new Phaser.Geom.Rectangle(
      this.body.x + inset,
      this.body.bottom - 1,
      Math.max(2, this.body.width - inset * 2),
      PLAYER.groundCheckDistance,
    );
  }

  attack(time) {
    if (this.isAttacking || time - this.lastAttackAt < PLAYER.attackCooldownMs) return;
    this.isAttacking = true;
    this.lastAttackAt = time;
    this.hitThisAttack.clear();
    this.setAccelerationX(0);
    safePlay(this, 'bigotes-attack', false);
    this.scene.audioManager?.play('attack');

    this.scene.time.delayedCall(PLAYER.attackWindupMs, () => {
      if (!this.active || this.isDefeated) return;
      this.attackZone.body.enable = true;
      this.syncAttackZone();
      this.scene.time.delayedCall(PLAYER.attackActiveMs, () => {
        if (!this.active) return;
        this.attackZone.body.enable = false;
        this.isAttacking = false;
      });
    });
  }

  syncAttackZone() {
    this.attackZone.setPosition(this.x + this.facing * 50, this.y - 34);
    this.attackZone.body?.updateFromGameObject();
  }

  canHit(enemy) {
    if (!this.attackZone.body.enable || this.hitThisAttack.has(enemy)) return false;
    this.hitThisAttack.add(enemy);
    return true;
  }

  consumeInteractPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.interact)
      || Phaser.Input.Keyboard.JustDown(this.keys.interactAlt);
  }

  takeDamage(amount, sourceX = this.x) {
    const now = this.scene.time.now;
    const result = applyDamage(
      { health: this.health, invulnerableUntil: this.invulnerableUntil },
      amount,
      now,
      PLAYER.invulnerabilityMs,
    );
    if (!result.applied) return false;

    this.health = result.health;
    this.invulnerableUntil = result.invulnerableUntil;
    this.setVelocity(sourceX < this.x ? 115 : -115, -105);
    safePlay(this, this.health > 0 ? 'bigotes-hurt' : 'bigotes-defeat', false);
    this.scene.audioManager?.play('hurt');
    this.scene.cameras.main.shake(110, this.scene.settings.screenShake ? 0.006 : 0);
    this.scene.tweens.add({
      targets: this,
      alpha: 0.25,
      yoyo: true,
      repeat: 5,
      duration: 80,
      onComplete: () => this.active && this.setAlpha(1),
    });
    if (this.health <= 0) this.defeat();
    return true;
  }

  defeat() {
    this.isDefeated = true;
    this.controlsEnabled = false;
    this.attackZone.body.enable = false;
    this.setAcceleration(0);
    safePlay(this, 'bigotes-defeat', false);
  }

  setControlsEnabled(enabled) {
    this.controlsEnabled = Boolean(enabled);
    if (!enabled) this.setAccelerationX(0);
  }

  destroy(fromScene) {
    this.attackZone?.destroy();
    super.destroy(fromScene);
  }
}
