import Phaser from 'phaser';
import { PLAYER_ANIMATION_PROFILES, PLAYER_ART_PROFILES } from '../art/artProfile.js';

const ANIMATIONS = ['idle', 'swim', 'jump', 'fall', 'attack', 'hurt', 'defeat', 'interact'];
const LEGACY_MAP = Object.freeze({ jump: 'swim', fall: 'swim', interact: 'idle' });
const LEGACY_COUNTS = Object.freeze({ idle: 6, swim: 6, attack: 6, hurt: 4, defeat: 6 });
const LEGACY_RATES = Object.freeze({ idle: 6, swim: 9, attack: 14, hurt: 10, defeat: 7 });

export class ArtReviewScene extends Phaser.Scene {
  constructor() {
    super('art-review');
  }

  create() {
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
    this.legacy = this.add.sprite(160, 285, 'bigotes-legacy-review', 'bigotes-idle-0')
      .setOrigin(0.5, 1);
    this.pixel = this.add.sprite(480, 285, 'bigotes-pixel-review', 'bigotes-idle-0')
      .setOrigin(0.5, 1);
    this.overlay = this.add.graphics().setDepth(20);
    this.status = this.add.text(12, 8, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#e9fff8', lineSpacing: 4,
    }).setDepth(30);
    this.add.text(320, 342, '↑/↓ animación  ·  ←/→ frame  ·  espacio pausa  ·  +/- FPS  ·  S 1×/4×  ·  F flipX', {
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
    ANIMATIONS.forEach((name) => {
      const legacyName = LEGACY_MAP[name] ?? name;
      const pixelDefinition = PLAYER_ANIMATION_PROFILES.pixelV1[name]
        ?? { count: name === 'jump' ? 3 : 4, frameRate: 8 };
      this.createReviewAnimation(
        `review-legacy-${name}`,
        'bigotes-legacy-review',
        `bigotes-${legacyName}`,
        LEGACY_COUNTS[legacyName],
        LEGACY_RATES[legacyName],
      );
      this.createReviewAnimation(
        `review-pixel-${name}`,
        'bigotes-pixel-review',
        `bigotes-${name}`,
        pixelDefinition.count,
        pixelDefinition.frameRate,
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
    this.animationIndex = Phaser.Math.Wrap(this.animationIndex + delta, 0, ANIMATIONS.length);
    this.applyAnimation();
  }

  applyAnimation() {
    const name = ANIMATIONS[this.animationIndex];
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
    this.legacy.setScale(0.42 * this.magnification);
    this.pixel.setScale(this.magnification);
  }

  update() {
    const name = ANIMATIONS[this.animationIndex];
    const pixelFrame = Number.parseInt(String(this.pixel.frame.name).split('-').at(-1), 10);
    const active = name === 'attack' && PLAYER_ART_PROFILES.pixelV1.attack.activeFrames.includes(pixelFrame);
    this.status.setText([
      `Bigotes · ${name} · velocidad ${this.timeScale.toFixed(2)}× · zoom ${this.magnification}×`,
      `${this.paused ? 'PAUSA' : 'PLAY'} · frame pixel ${pixelFrame}${active ? ' · HITBOX ACTIVA' : ''} · flipX ${this.flipped}`,
    ]);
    this.drawPixelGuides(active);
  }

  drawPixelGuides(attackActive) {
    this.overlay.clear();
    const scale = this.magnification;
    const frameLeft = this.pixel.x - 24 * scale;
    const frameTop = this.pixel.y - 64 * scale;
    const collider = PLAYER_ART_PROFILES.pixelV1.collider;
    this.overlay.lineStyle(1, 0x49e3c6, 1);
    this.overlay.strokeRect(
      frameLeft + collider.offsetX * scale,
      frameTop + collider.offsetY * scale,
      collider.width * scale,
      collider.height * scale,
    );
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
