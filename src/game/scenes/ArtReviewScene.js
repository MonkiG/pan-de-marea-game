import Phaser from 'phaser';
import { PLAYER_ART_PROFILES } from '../art/artProfile.js';

const animation = (name, legacyPrefix, legacyCount, pixelPrefix, pixelCount, frameRate) => ({
  name, legacyPrefix, legacyCount, pixelPrefix, pixelCount, frameRate,
});

const REVIEW_PROFILES = Object.freeze({
  bigotes: {
    label: 'Bigotes', legacyScale: 0.42, pixelScale: 1, frame: [48, 64],
    collider: PLAYER_ART_PROFILES.pixelV1.collider,
    animations: [
      animation('idle', 'bigotes-idle', 6, 'bigotes-idle', 6, 6),
      animation('swim', 'bigotes-swim', 6, 'bigotes-swim', 8, 9),
      animation('jump', 'bigotes-swim', 6, 'bigotes-jump', 3, 10),
      animation('fall', 'bigotes-swim', 6, 'bigotes-fall', 4, 9),
      animation('attack', 'bigotes-attack', 6, 'bigotes-attack', 8, 16),
      animation('hurt', 'bigotes-hurt', 4, 'bigotes-hurt', 4, 10),
      animation('defeat', 'bigotes-defeat', 6, 'bigotes-defeat', 6, 7),
      animation('interact', 'bigotes-idle', 6, 'bigotes-interact', 4, 8),
    ],
  },
  rastrero: {
    label: 'Rastrero', legacyScale: 0.43, pixelScale: 1, frame: [80, 48],
    collider: { width: 58, height: 30, offsetX: 11, offsetY: 18 },
    animations: [
      animation('idle', 'crawler-idle', 6, 'crawler-idle', 6, 5),
      animation('patrol', 'crawler-patrol', 6, 'crawler-patrol', 8, 8),
      animation('alert', 'crawler-idle', 3, 'crawler-alert', 4, 10),
      animation('attack', 'crawler-attack', 6, 'crawler-attack', 8, 14),
      animation('hurt', 'crawler-hurt', 5, 'crawler-hurt', 4, 10),
      animation('stun', 'crawler-hurt', 2, 'crawler-stun', 4, 6),
      animation('defeat', 'crawler-defeat', 5, 'crawler-defeat', 6, 8),
    ],
  },
  escupemasas: {
    label: 'Escupemasas', legacyScale: 0.42, pixelScale: 1, frame: [80, 64],
    collider: { width: 60, height: 38, offsetX: 10, offsetY: 26 },
    animations: [
      animation('idle', 'spitter-idle', 6, 'spitter-idle', 6, 5),
      animation('move', 'spitter-idle', 6, 'spitter-move', 6, 7),
      animation('charge', 'spitter-charge', 4, 'spitter-charge', 6, 8),
      animation('attack', 'spitter-attack', 5, 'spitter-shoot', 8, 12),
      animation('hurt', 'spitter-hurt', 4, 'spitter-hurt', 4, 9),
      animation('defeat', 'spitter-defeat', 6, 'spitter-defeat', 8, 8),
    ],
  },
  sentinela: {
    label: 'Sentinela', legacyScale: 0.48, pixelScale: 1, frame: [96, 112],
    collider: { width: 64, height: 92, offsetX: 16, offsetY: 20 },
    animations: [
      animation('idle', 'sentinel-idle', 6, 'sentinel-sleep', 6, 4),
      animation('alert', 'sentinel-idle', 4, 'sentinel-alert', 4, 8),
      animation('walk', 'sentinel-walk', 6, 'sentinel-walk', 8, 7),
      animation('attack', 'sentinel-attack', 6, 'sentinel-attack', 8, 10),
      animation('charge', 'sentinel-charge', 6, 'sentinel-charge', 8, 12),
      animation('hurt', 'sentinel-hurt', 6, 'sentinel-hurt', 4, 8),
      animation('defeat', 'sentinel-defeat', 6, 'sentinel-defeat', 8, 7),
    ],
  },
});

export class ArtReviewScene extends Phaser.Scene {
  constructor() {
    super('art-review');
  }

  create() {
    this.assetId = this.registry.get('artReviewAsset') || 'bigotes';
    this.profile = REVIEW_PROFILES[this.assetId] || REVIEW_PROFILES.bigotes;
    this.animationIndex = 0;
    this.paused = false;
    this.flipped = false;
    this.magnification = 1;
    this.timeScale = 1;

    this.cameras.main.setBackgroundColor('#061f28');
    this.add.rectangle(320, 180, 638, 358, 0x092f3a).setStrokeStyle(1, 0x5ccdc1);
    this.add.line(320, 190, 0, -145, 0, 145, 0x416e73, 0.7);
    this.add.text(160, 46, 'LEGACY', this.labelStyle('#9bb7b4')).setOrigin(0.5);
    this.add.text(480, 46, 'PIXEL V1', this.labelStyle('#ffbd59')).setOrigin(0.5);
    const first = this.profile.animations[0];
    this.legacy = this.add.sprite(160, 285, 'art-legacy-review', `${first.legacyPrefix}-0`).setOrigin(0.5, 1);
    this.pixel = this.add.sprite(480, 285, 'art-pixel-review', `${first.pixelPrefix}-0`).setOrigin(0.5, 1);
    this.overlay = this.add.graphics().setDepth(20);
    this.status = this.add.text(12, 8, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#e9fff8', lineSpacing: 4,
    }).setDepth(30);
    this.add.text(320, 342, '↑/↓ animación · ←/→ frame · espacio pausa · +/- FPS · S 1×/4× · F flipX', {
      fontFamily: 'monospace', fontSize: '10px', color: '#9bc7c5',
    }).setOrigin(0.5).setDepth(30);

    this.createReviewAnimations();
    this.bindControls();
    this.applyAnimation();
    this.applyScale();
  }

  labelStyle(color) {
    return { fontFamily: 'monospace', fontSize: '14px', color };
  }

  createReviewAnimations() {
    this.profile.animations.forEach((definition) => {
      this.createReviewAnimation(
        `review-legacy-${definition.name}`, 'art-legacy-review',
        definition.legacyPrefix, definition.legacyCount, definition.frameRate,
      );
      this.createReviewAnimation(
        `review-pixel-${definition.name}`, 'art-pixel-review',
        definition.pixelPrefix, definition.pixelCount, definition.frameRate,
      );
    });
  }

  createReviewAnimation(key, texture, prefix, count, frameRate) {
    if (this.anims.exists(key)) return;
    this.anims.create({
      key,
      frames: Array.from({ length: count }, (_, index) => ({ key: texture, frame: `${prefix}-${index}` })),
      frameRate,
      repeat: -1,
    });
  }

  bindControls() {
    this.input.keyboard.on('keydown-UP', () => this.selectAnimation(-1));
    this.input.keyboard.on('keydown-DOWN', () => this.selectAnimation(1));
    this.input.keyboard.on('keydown-SPACE', () => this.togglePause());
    this.input.keyboard.on('keydown-LEFT', () => this.stepFrame(-1));
    this.input.keyboard.on('keydown-RIGHT', () => this.stepFrame(1));
    this.input.keyboard.on('keydown-PLUS', () => this.adjustFps(0.25));
    this.input.keyboard.on('keydown-NUMPAD_ADD', () => this.adjustFps(0.25));
    this.input.keyboard.on('keydown-MINUS', () => this.adjustFps(-0.25));
    this.input.keyboard.on('keydown-NUMPAD_SUBTRACT', () => this.adjustFps(-0.25));
    this.input.keyboard.on('keydown-S', () => {
      this.magnification = this.magnification === 1 ? 4 : 1;
      this.applyScale();
    });
    this.input.keyboard.on('keydown-F', () => {
      this.flipped = !this.flipped;
      this.legacy.setFlipX(this.flipped);
      this.pixel.setFlipX(this.flipped);
    });
  }

  selectAnimation(delta) {
    this.animationIndex = Phaser.Math.Wrap(this.animationIndex + delta, 0, this.profile.animations.length);
    this.applyAnimation();
  }

  applyAnimation() {
    const { name } = this.profile.animations[this.animationIndex];
    this.legacy.play(`review-legacy-${name}`);
    this.pixel.play(`review-pixel-${name}`);
    this.applyTimeScale();
    if (this.paused) {
      this.legacy.anims.pause();
      this.pixel.anims.pause();
    }
  }

  togglePause() {
    this.paused = !this.paused;
    [this.legacy, this.pixel].forEach((sprite) => {
      if (this.paused) sprite.anims.pause();
      else sprite.anims.resume();
    });
  }

  stepFrame(delta) {
    if (!this.paused) this.togglePause();
    [this.legacy, this.pixel].forEach((sprite) => {
      const frames = sprite.anims.currentAnim.frames;
      const current = Math.max(0, frames.indexOf(sprite.anims.currentFrame));
      sprite.anims.setCurrentFrame(frames[Phaser.Math.Wrap(current + delta, 0, frames.length)]);
    });
  }

  adjustFps(delta) {
    this.timeScale = Phaser.Math.Clamp(this.timeScale + delta, 0.25, 3);
    this.applyTimeScale();
  }

  applyTimeScale() {
    this.legacy.anims.timeScale = this.timeScale;
    this.pixel.anims.timeScale = this.timeScale;
  }

  applyScale() {
    this.legacy.setScale(this.profile.legacyScale * this.magnification);
    this.pixel.setScale(this.profile.pixelScale * this.magnification);
  }

  update() {
    const { name } = this.profile.animations[this.animationIndex];
    const pixelFrame = Number.parseInt(String(this.pixel.frame.name).split('-').at(-1), 10);
    const active = this.assetId === 'bigotes' && name === 'attack'
      && PLAYER_ART_PROFILES.pixelV1.attack.activeFrames.includes(pixelFrame);
    this.status.setText([
      `${this.profile.label} · ${name} · velocidad ${this.timeScale.toFixed(2)}× · zoom ${this.magnification}×`,
      `${this.paused ? 'PAUSA' : 'PLAY'} · frame pixel ${pixelFrame}${active ? ' · HITBOX ACTIVA' : ''} · flipX ${this.flipped}`,
    ]);
    this.drawPixelGuides(active);
  }

  drawPixelGuides(attackActive) {
    this.overlay.clear();
    const scale = this.profile.pixelScale * this.magnification;
    const [frameWidth, frameHeight] = this.profile.frame;
    const frameLeft = this.pixel.x - frameWidth * scale / 2;
    const frameTop = this.pixel.y - frameHeight * scale;
    const collider = this.profile.collider;
    this.overlay.lineStyle(1, 0x49e3c6, 1);
    this.overlay.strokeRect(
      frameLeft + collider.offsetX * scale,
      frameTop + collider.offsetY * scale,
      collider.width * scale,
      collider.height * scale,
    );
    if (this.assetId !== 'bigotes') return;
    const hitbox = PLAYER_ART_PROFILES.pixelV1.attack.hitbox;
    const direction = this.flipped ? -1 : 1;
    this.overlay.lineStyle(1, attackActive ? 0xffb349 : 0x7d5e45, attackActive ? 1 : 0.45);
    this.overlay.strokeRect(
      this.pixel.x + direction * hitbox.offsetX * scale - hitbox.width * scale / 2,
      this.pixel.y + hitbox.offsetY * scale - hitbox.height * scale / 2,
      hitbox.width * scale,
      hitbox.height * scale,
    );
  }
}
