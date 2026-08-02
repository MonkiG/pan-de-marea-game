import Phaser from 'phaser';
import { SPITTER } from '../constants.js';

const play = (enemy, key, ignoreIfPlaying = true) => {
  if (enemy.scene.anims.exists(key)) enemy.play(key, ignoreIfPlaying);
};

export class AbyssalSpitter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, data, player, assetResolver, fireProjectile, onDefeated) {
    const texture = assetResolver.resolve('abyssalSpitter', 'fallback-spitter', ['spitter-idle-0']);
    const frame = texture === 'spitter-sheet' ? 'spitter-idle-0' : undefined;
    super(scene, data.x, data.y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(14);
    this.id = data.id;
    this.player = player;
    this.fireProjectile = fireProjectile;
    this.onDefeated = onDefeated;
    this.patrolMin = data.patrolMin;
    this.patrolMax = data.patrolMax;
    this.health = SPITTER.maxHealth;
    this.state = 'idle';
    this.stateUntil = 0;
    this.nextAttackAt = 0;
    this.direction = -1;
    this.setScale(texture === 'spitter-sheet' ? 0.42 : 1);
    this.setOrigin(0.5, 0.82);
    if (texture === 'spitter-sheet') this.setSize(132, 66).setOffset(23, 48);
    this.setCollideWorldBounds(true);
    play(this, 'spitter-idle');
  }

  update(time) {
    if (!this.active || this.state === 'defeated') return;
    const distance = this.player.x - this.x;
    const absoluteDistance = Math.abs(distance);
    const nearCamera = Phaser.Geom.Rectangle.Overlaps(
      Phaser.Geom.Rectangle.Inflate(this.scene.cameras.main.worldView, 180, 120),
      this.getBounds(),
    );
    if (!nearCamera || absoluteDistance > SPITTER.activationDistance) {
      this.setVelocityX(0);
      return;
    }

    this.direction = Math.sign(distance) || this.direction;
    this.setFlipX(this.direction > 0);

    if (this.state === 'hurt' || this.state === 'stunned') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) this.setState('recover', time + 320);
      return;
    }

    if (this.state === 'charge') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) {
        this.setState('rangedAttack', time + 220);
        this.fireProjectile?.(this, this.player.x, this.player.y - 24);
      }
      return;
    }

    if (this.state === 'rangedAttack') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) this.setState('recover', time + SPITTER.recoveryDurationMs);
      return;
    }

    if (this.state === 'recover') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) this.setState('idle');
      return;
    }

    const inRange = absoluteDistance >= SPITTER.minimumAttackRange
      && absoluteDistance <= SPITTER.attackRange;
    if (inRange && time >= this.nextAttackAt && this.scene.hasLineOfSight(this, this.player)) {
      this.nextAttackAt = time + SPITTER.attackCooldownMs;
      this.setState('charge', time + SPITTER.chargeDurationMs);
      return;
    }

    if (absoluteDistance < SPITTER.minimumAttackRange) {
      this.setVelocityX(-this.direction * 20);
      this.setState('move');
    } else {
      this.setVelocityX(0);
      this.setState('idle');
    }
  }

  setState(state, until = 0) {
    if (this.state === state && state !== 'move') return;
    this.state = state;
    this.stateUntil = until;
    const animation = {
      idle: 'spitter-idle', move: 'spitter-idle', charge: 'spitter-charge',
      rangedAttack: 'spitter-attack', recover: 'spitter-idle', hurt: 'spitter-hurt',
      stunned: 'spitter-hurt', defeated: 'spitter-defeat',
    }[state];
    if (animation) play(this, animation, state === 'idle' || state === 'move');
  }

  takeDamage(amount, sourceX) {
    if (!this.active || ['hurt', 'stunned', 'defeated'].includes(this.state)) return false;
    this.health = Math.max(0, this.health - Math.max(0, amount));
    this.setVelocity(sourceX < this.x ? 90 : -90, -45);
    if (this.health === 0) {
      this.setState('defeated');
      this.disableBody(false, false);
      this.onDefeated?.(this);
      this.scene.time.delayedCall(700, () => this.active && this.scene.tweens.add({
        targets: this, alpha: 0, duration: 300, onComplete: () => this.destroy(),
      }));
    } else {
      this.setState('hurt', this.scene.time.now + 210);
    }
    return true;
  }
}
