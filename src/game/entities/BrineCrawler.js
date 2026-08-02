import Phaser from 'phaser';
import { CRAWLER } from '../constants.js';

const playState = (crawler, state) => {
  const key = `crawler-${state}`;
  if (crawler.scene.anims.exists(key)) crawler.play(key, true);
};

export class BrineCrawler extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, data, player, onDefeated) {
    const texture = scene.textures.exists('crawler-sheet') ? 'crawler-sheet' : 'fallback-enemy';
    const frame = scene.textures.get(texture).has('crawler-idle-0') ? 'crawler-idle-0' : undefined;
    super(scene, data.x, data.y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(14);

    this.id = data.id;
    this.player = player;
    this.patrolMin = data.patrolMin;
    this.patrolMax = data.patrolMax;
    this.onDefeated = onDefeated;
    this.health = CRAWLER.health;
    this.state = 'idle';
    this.direction = -1;
    this.stateUntil = scene.time.now + 350;
    this.nextAttackAt = 0;
    this.setScale(texture === 'fallback-enemy' ? 1 : 0.43);
    this.setOrigin(0.5, 0.82);
    this.setSize(125, 78).setOffset(38, 50);
    this.setCollideWorldBounds(true);
    playState(this, 'idle');
  }

  update(time) {
    if (!this.active || this.state === 'defeat') return;
    const distance = this.player.x - this.x;
    const absoluteDistance = Math.abs(distance);

    if (this.state === 'hurt' || this.state === 'stunned') {
      if (time >= this.stateUntil) {
        if (this.state === 'hurt') this.setState('stunned', time + 260);
        else this.setState('patrol');
      }
      return;
    }

    if (this.state === 'idle' && time >= this.stateUntil) this.setState('patrol');

    if (this.state === 'alert') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) this.setState('chase');
      return;
    }

    if (this.state === 'attack') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) this.setState('patrol');
      return;
    }

    if (absoluteDistance <= CRAWLER.attackDistance && time >= this.nextAttackAt) {
      this.beginAttack(time);
      return;
    }

    if (absoluteDistance <= CRAWLER.detectionDistance && this.state === 'patrol') {
      this.direction = Math.sign(distance) || this.direction;
      this.setFlipX(this.direction > 0);
      this.setState('alert', time + CRAWLER.alertMs);
      return;
    }

    if (this.state === 'chase') {
      if (absoluteDistance > CRAWLER.detectionDistance * 1.45) {
        this.setState('patrol');
      } else {
        this.direction = Math.sign(distance) || this.direction;
        this.setFlipX(this.direction > 0);
        this.setVelocityX(this.direction * CRAWLER.chaseSpeed);
      }
      return;
    }

    if (this.state === 'patrol') {
      if (this.x <= this.patrolMin) this.direction = 1;
      if (this.x >= this.patrolMax) this.direction = -1;
      if (this.body.blocked.left) this.direction = 1;
      if (this.body.blocked.right) this.direction = -1;
      this.setFlipX(this.direction > 0);
      this.setVelocityX(this.direction * CRAWLER.patrolSpeed);
    }
  }

  beginAttack(time) {
    this.nextAttackAt = time + CRAWLER.attackCooldownMs;
    this.setState('attack', time + 520);
    this.scene.time.delayedCall(220, () => {
      if (!this.active || this.state !== 'attack') return;
      if (Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) <= 62) {
        this.scene.damagePlayer(CRAWLER.damage, this.x);
      }
    });
  }

  takeDamage(amount, sourceX) {
    if (!this.active || ['hurt', 'stunned', 'defeat'].includes(this.state)) return false;
    this.health = Math.max(0, this.health - amount);
    this.setVelocity(sourceX < this.x ? 110 : -110, -55);
    if (this.health === 0) {
      this.setState('defeat');
      this.disableBody(false, false);
      this.onDefeated?.(this);
      this.scene.time.delayedCall(650, () => {
        if (!this.active) return;
        this.scene.tweens.add({ targets: this, alpha: 0, duration: 350, onComplete: () => this.destroy() });
      });
    } else {
      this.setState('hurt', this.scene.time.now + 180);
    }
    return true;
  }

  setState(state, until = 0) {
    this.state = state;
    this.stateUntil = until;
    if (state !== 'chase') playState(this, state === 'chase' ? 'patrol' : state);
    else playState(this, 'patrol');
  }
}
