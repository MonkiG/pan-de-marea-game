import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    this.makeFallbackTextures();
    this.scene.start('preload');
  }

  makeFallbackTextures() {
    const make = (key, width, height, draw) => {
      if (this.textures.exists(key)) return;
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
      draw(graphics, width, height);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    };

    make('fallback-player', 40, 56, (g) => {
      g.fillStyle(0xf5c15d).fillRect(7, 8, 26, 42);
      g.fillStyle(0xeaf7f5).fillRect(5, 5, 30, 12);
      g.fillStyle(0x173843).fillRect(26, 10, 8, 6);
    });
    make('fallback-enemy', 58, 36, (g) => {
      g.fillStyle(0x30474a).fillRoundedRect(2, 8, 54, 26, 8);
      g.fillStyle(0x38e4c5).fillCircle(18, 20, 4).fillCircle(39, 20, 4);
    });
    make('fallback-yeast', 26, 26, (g) => {
      g.fillStyle(0xffb829).fillCircle(13, 13, 11);
      g.lineStyle(3, 0xaef5ea).strokeCircle(13, 13, 11);
    });
    make('fallback-oven', 82, 88, (g) => {
      g.fillStyle(0x263d41).fillRect(4, 4, 74, 84);
      g.fillStyle(0x101d20).fillRect(17, 27, 48, 37);
      g.lineStyle(4, 0xb66d2d).strokeRect(17, 27, 48, 37);
      g.fillStyle(0xffa442).fillCircle(63, 16, 5);
    });
    make('fallback-gate', 110, 130, (g) => {
      g.fillStyle(0x203b43).fillRect(3, 4, 104, 126);
      g.fillStyle(0x0d1a20).fillRoundedRect(22, 24, 66, 106, 22);
      g.lineStyle(6, 0x5c8990).strokeRoundedRect(22, 24, 66, 106, 22);
    });
    make('fallback-particle', 6, 6, (g) => g.fillStyle(0xffc45c).fillCircle(3, 3, 3));
    make('fallback-platform', 64, 18, (g) => {
      g.fillStyle(0x37656b).fillRect(0, 0, 64, 18);
      g.fillStyle(0x9bb7a9).fillRect(0, 0, 64, 4);
    });
  }
}
