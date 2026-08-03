import Phaser from 'phaser';
import { PLAYER } from '../constants.js';
import { PLAYER_ART_PROFILE, IS_PIXEL_ART_V1 } from '../art/artProfile.js';
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
    this.setDepth(15);

    const visual = texture === 'fallback-player'
      ? { scale: 1, origin: { x: 0.5, y: 1 }, collider: { width: 26, height: 46, offsetX: 7, offsetY: 10 } }
      : PLAYER_ART_PROFILE;
    this.setScale(visual.scale);
    this.setOrigin(visual.origin.x, visual.origin.y);
    this.setSize(visual.collider.width, visual.collider.height)
      .setOffset(visual.collider.offsetX, visual.collider.offsetY);
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
    this.attackActive = false;
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
      cycleBread: Phaser.Input.Keyboard.KeyCodes.Q,
      useBread: Phaser.Input.Keyboard.KeyCodes.K,
    });
    this.cursors = scene.input.keyboard.createCursorKeys();

    const { hitbox } = PLAYER_ART_PROFILE.attack;
    this.attackZone = scene.add.zone(x, y, hitbox.width, hitbox.height);
    scene.physics.add.existing(this.attackZone);
    this.attackZone.body.setAllowGravity(false);
    this.attackZone.body.enable = false;
    this.attackEffect = IS_PIXEL_ART_V1 && scene.textures.exists('player-attack-effect')
      ? scene.add.sprite(x, y, 'player-attack-effect', 'player-attack-effect-0')
        .setOrigin(0.5)
        .setDepth(16)
        .setVisible(false)
      : null;
    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.handleAnimationUpdate, this);
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.handleAnimationComplete, this);
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
      if (!grounded && IS_PIXEL_ART_V1) {
        safePlay(this, this.body.velocity.y < 0 ? 'bigotes-jump' : 'bigotes-fall');
      } else if (!grounded) safePlay(this, 'bigotes-swim');
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
    if (this.isAttacking || time - this.lastAttackAt < PLAYER.attack.cooldownMs) return;
    this.isAttacking = true;
    this.lastAttackAt = time;
    this.hitThisAttack.clear();
    this.setAccelerationX(0);
    safePlay(this, 'bigotes-attack', false);
    this.scene.audioManager?.play('attack');
    this.attackFallbackTimer?.remove(false);
    this.attackFallbackTimer = this.scene.time.delayedCall(
      PLAYER_ART_PROFILE.attack.fallbackDurationMs,
      () => this.active && this.isAttacking && this.finishAttack(),
    );
  }

  syncAttackZone() {
    const { hitbox, effect } = PLAYER_ART_PROFILE.attack;
    this.attackZone.setPosition(this.x + this.facing * hitbox.offsetX, this.y + hitbox.offsetY);
    this.attackZone.body?.updateFromGameObject();
    if (this.attackEffect && effect) {
      this.attackEffect
        .setPosition(this.x + this.facing * effect.offsetX, this.y + effect.offsetY)
        .setFlipX(this.facing < 0);
    }
  }

  handleAnimationUpdate(animation, frame) {
    if (!this.isAttacking || animation.key !== 'bigotes-attack') return;
    const frameIndex = Number.parseInt(String(frame.textureFrame).split('-').at(-1), 10);
    this.setAttackActive(PLAYER_ART_PROFILE.attack.activeFrames.includes(frameIndex));
  }

  handleAnimationComplete(animation) {
    if (animation.key === 'bigotes-attack' && this.isAttacking) this.finishAttack();
  }

  setAttackActive(active) {
    if (this.attackActive === active) return;
    this.attackActive = active;
    this.attackZone.body.enable = active;
    this.syncAttackZone();
    if (!this.attackEffect) return;
    this.attackEffect.setVisible(active);
    if (active) safePlay(this.attackEffect, 'player-attack-effect-animation', false);
    else this.attackEffect.stop();
  }

  finishAttack() {
    this.attackFallbackTimer?.remove(false);
    this.attackFallbackTimer = null;
    this.setAttackActive(false);
    this.isAttacking = false;
  }

  canHit(enemy) {
    if (!this.attackZone.body.enable || this.hitThisAttack.has(enemy)) return false;
    this.hitThisAttack.add(enemy);
    return true;
  }

  hitEnemy(enemy) {
    if (!this.canHit(enemy)) return false;
    const hitConfirmed = enemy.takeDamage(PLAYER.attack.damage, this.x);
    if (hitConfirmed) this.spawnHitSpark(enemy);
    return hitConfirmed;
  }

  spawnHitSpark(enemy) {
    if (!IS_PIXEL_ART_V1 || !this.scene.textures.exists('hit-spark')) return;
    const spark = this.scene.add.sprite(enemy.x, enemy.y - 8, 'hit-spark', 'hit-spark-0')
      .setDepth(21)
      .setFlipX(this.facing < 0);
    safePlay(spark, 'hit-spark-animation', false);
    spark.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => spark.destroy());
    this.scene.time.delayedCall(450, () => spark.active && spark.destroy());
  }

  consumeInteractPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.interact)
      || Phaser.Input.Keyboard.JustDown(this.keys.interactAlt);
  }

  consumeBreadCyclePressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.cycleBread);
  }

  consumeBreadUsePressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.useBread);
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

    if (this.isAttacking) this.finishAttack();
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
    this.finishAttack();
    this.setAcceleration(0);
    safePlay(this, 'bigotes-defeat', false);
  }

  setControlsEnabled(enabled) {
    this.controlsEnabled = Boolean(enabled);
    if (!enabled) this.setAccelerationX(0);
  }

  destroy(fromScene) {
    this.attackFallbackTimer?.remove(false);
    this.attackEffect?.destroy();
    this.attackZone?.destroy();
    super.destroy(fromScene);
  }
}
