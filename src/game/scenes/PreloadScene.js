import Phaser from 'phaser';
import {
  ASSET_MANIFEST,
  BIGOTES_LEGACY_FRAMES,
  BIGOTES_PIXEL_FRAMES,
  registerManifestFrames,
  registerTextureFrames,
} from '../assetManifest.js';
import { createAnimations } from '../systems/AnimationManager.js';
import { logAssetAudit } from '../assets/assetAudit.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    this.artReview = import.meta.env.DEV
      && new URLSearchParams(window.location.search).get('art-review') === 'bigotes';
    const bar = this.add.rectangle(320, 190, 280, 10, 0x163b45).setOrigin(0.5);
    const progress = this.add.rectangle(180, 190, 0, 8, 0xffb349).setOrigin(0, 0.5);
    this.add.text(320, 160, 'Preparando las rutas de Pan de Marea…', {
      fontFamily: 'monospace', fontSize: '14px', color: '#f4e3b0',
    }).setOrigin(0.5);
    this.load.on('progress', (value) => progress.setDisplaySize(280 * value, 8));
    this.load.on('loaderror', (file) => {
      console.warn(`[Assets] No se pudo cargar ${file.src}; se usará fallback en ${file.key}.`);
    });
    ASSET_MANIFEST.forEach((asset) => this.load.image(asset.key, `/${asset.file}`));
    if (this.artReview) {
      this.load.image('bigotes-legacy-review', '/bigotes-assets.png');
      this.load.image('bigotes-pixel-review', '/pixel-art/v1/characters/bigotes.png');
    }
    this.load.once('complete', () => bar.destroy());
  }

  create() {
    registerManifestFrames(this);
    if (this.artReview) {
      registerTextureFrames(this, 'bigotes-legacy-review', BIGOTES_LEGACY_FRAMES);
      registerTextureFrames(this, 'bigotes-pixel-review', BIGOTES_PIXEL_FRAMES);
    }
    createAnimations(this);
    if (import.meta.env.DEV) logAssetAudit();
    this.scene.start(this.artReview ? 'art-review' : this.game.registry.get('selectedLevel') || 'level-one');
  }
}
