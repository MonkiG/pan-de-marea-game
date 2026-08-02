import Phaser from 'phaser';
import { ASSET_MANIFEST, registerManifestFrames } from '../assetManifest.js';
import { createAnimations } from '../systems/AnimationManager.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    const bar = this.add.rectangle(320, 190, 280, 10, 0x163b45).setOrigin(0.5);
    const progress = this.add.rectangle(180, 190, 0, 8, 0xffb349).setOrigin(0, 0.5);
    this.add.text(320, 160, 'Preparando La Panadería Hundida…', {
      fontFamily: 'monospace', fontSize: '14px', color: '#f4e3b0',
    }).setOrigin(0.5);
    this.load.on('progress', (value) => progress.setDisplaySize(280 * value, 8));
    this.load.on('loaderror', (file) => {
      console.warn(`[Assets] No se pudo cargar ${file.src}; se usará fallback en ${file.key}.`);
    });
    ASSET_MANIFEST.forEach((asset) => this.load.image(asset.key, `/${asset.file}`));
    this.load.once('complete', () => bar.destroy());
  }

  create() {
    registerManifestFrames(this);
    createAnimations(this);
    this.scene.start('level-one');
  }
}
