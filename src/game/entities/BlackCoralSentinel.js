import Phaser from 'phaser';
import { SENTINEL } from '../constants.js';

const play = (enemy, key, ignore = true) => {
  if (enemy.scene.anims.exists(key)) enemy.play(key, ignore);
};

export class BlackCoralSentinel extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, data, player, assetResolver, onDefeated) {
    const texture = assetResolver.resolve('blackCoralSentinel', 'fallback-sentinel', ['sentinel-idle-0']);
    const frame = texture === 'sentinel-sheet' ? 'sentinel-idle-0' : undefined;
    super(scene, data.x, data.y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(14);
    this.id = data.id;
    this.player = player;
    this.onDefeated = onDefeated;
    this.patrolMin = data.patrolMin;
    this.patrolMax = data.patrolMax;
    this.health = SENTINEL.maxHealth;
    this.state = 'dormant';
    this.stateUntil = 0;
    this.nextAttackAt = 0;
    this.nextChargeAt = 0;
    this.strikeAt = 0;
    this.strikeAttempted = false;
    this.direction = -1;
    this.setScale(texture === 'sentinel-sheet' ? 0.48 : 1);
    this.setOrigin(0.5, 0.84);
    if (texture === 'sentinel-sheet') this.setSize(108, 152).setOffset(28, 32);
    this.setCollideWorldBounds(true);
    play(this, 'sentinel-idle');
  }

  update(time) {
    if (!this.active || this.state === 'defeated') return;
    const distance = this.player.x - this.x;
    const absoluteDistance = Math.abs(distance);
    this.direction = Math.sign(distance) || this.direction;

    if (this.state === 'dormant') {
      this.setVelocityX(0);
      if (absoluteDistance <= SENTINEL.detectionRange) this.setState('alert', time + 500);
      return;
    }
    if (this.state === 'alert' || this.state === 'hurt' || this.state === 'stunned') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) this.setState('walk');
      return;
    }
    if (this.state === 'basicAttack') {
      this.setVelocityX(0);
      if (!this.strikeAttempted && time >= this.strikeAt) {
        this.strikeAttempted = true;
        if (Math.abs(this.player.x - this.x) <= 78 && Math.abs(this.player.y - this.y) <= 100) {
          this.scene.damagePlayer(SENTINEL.damage, this.x);
        }
      }
      if (time >= this.stateUntil) this.setState('stunned', time + SENTINEL.stunDurationMs);
      return;
    }
    if (this.state === 'chargeAttack') {
      this.setVelocityX(this.direction * 105);
      if (!this.strikeAttempted && absoluteDistance <= 70) {
        this.strikeAttempted = true;
        this.scene.damagePlayer(SENTINEL.damage, this.x);
      }
      if (time >= this.stateUntil || this.body.blocked.left || this.body.blocked.right) {
        this.setVelocityX(0);
        this.setState('stunned', time + SENTINEL.stunDurationMs);
      }
      return;
    }

    if (absoluteDistance > SENTINEL.activationDistance) {
      this.setVelocityX(0);
      this.setState('idle');
      return;
    }
    this.setFlipX(this.direction > 0);
    if (absoluteDistance <= SENTINEL.attackRange && time >= this.nextAttackAt) {
      this.nextAttackAt = time + SENTINEL.basicAttackCooldownMs;
      this.strikeAt = time + 360;
      this.strikeAttempted = false;
      this.setState('basicAttack', time + 720);
      return;
    }
    if (absoluteDistance > 85 && absoluteDistance <= SENTINEL.chargeDistance
      && time >= this.nextChargeAt) {
      this.nextChargeAt = time + SENTINEL.chargeCooldownMs;
      this.strikeAttempted = false;
      this.setState('chargeAttack', time + 520);
      return;
    }
    const nextX = Phaser.Math.Clamp(this.x + this.direction, this.patrolMin, this.patrolMax);
    this.setVelocityX(nextX === this.x ? 0 : this.direction * SENTINEL.walkSpeed);
    this.setState('walk');
  }

  setState(state, until = 0) {
    if (this.state === state && ['idle', 'walk'].includes(state)) return;
    this.state = state;
    this.stateUntil = until;
    const animation = {
      dormant: 'sentinel-idle', idle: 'sentinel-idle', alert: 'sentinel-idle',
      walk: 'sentinel-walk', basicAttack: 'sentinel-attack', chargeAttack: 'sentinel-charge',
      hurt: 'sentinel-hurt', stunned: 'sentinel-hurt', defeated: 'sentinel-defeat',
    }[state];
    if (animation) play(this, animation, ['idle', 'walk'].includes(state));
  }

  takeDamage(amount, sourceX) {
    if (!this.active || ['hurt', 'defeated'].includes(this.state)) return false;
    this.health = Math.max(0, this.health - Math.max(0, amount));
    this.setVelocity(sourceX < this.x ? 70 : -70, -35);
    if (this.health === 0) {
      this.setState('defeated');
      this.disableBody(false, false);
      this.onDefeated?.(this);
      this.scene.time.delayedCall(900, () => this.active && this.scene.tweens.add({
        targets: this, alpha: 0, duration: 450, onComplete: () => this.destroy(),
      }));
    } else {
      this.setState('hurt', this.scene.time.now + 280);
    }
    return true;
  }
}
