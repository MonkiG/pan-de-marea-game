import Phaser from 'phaser';
import {
  ASSET_MANIFEST,
  BIGOTES_LEGACY_FRAMES,
  BIGOTES_PIXEL_FRAMES,
  CRAWLER_LEGACY_FRAMES,
  CRAWLER_PIXEL_FRAMES,
  SENTINEL_LEGACY_FRAMES,
  SENTINEL_PIXEL_FRAMES,
  SPITTER_LEGACY_FRAMES,
  SPITTER_PIXEL_FRAMES,
  registerManifestFrames,
  registerTextureFrames,
} from '../assetManifest.js';
import { createAnimations } from '../systems/AnimationManager.js';
import { logAssetAudit } from '../assets/assetAudit.js';
import { AUDIO_ASSETS } from '../audio/audioManifest.js';

const ART_REVIEW_ASSETS = Object.freeze({
  bigotes: {
    legacy: '/bigotes-assets.png', pixel: '/pixel-art/v1/characters/bigotes.png',
    legacyFrames: BIGOTES_LEGACY_FRAMES, pixelFrames: BIGOTES_PIXEL_FRAMES,
  },
  rastrero: {
    legacy: '/rastrero-de-salmuera.png', pixel: '/pixel-art/v1/characters/brine-crawler.png',
    legacyFrames: CRAWLER_LEGACY_FRAMES, pixelFrames: CRAWLER_PIXEL_FRAMES,
  },
  escupemasas: {
    legacy: '/escupemasas.png', pixel: '/pixel-art/v1/characters/abyssal-spitter.png',
    legacyFrames: SPITTER_LEGACY_FRAMES, pixelFrames: SPITTER_PIXEL_FRAMES,
  },
  sentinela: {
    legacy: '/sentinela-del-coral-negro.png', pixel: '/pixel-art/v1/characters/black-coral-sentinel.png',
    legacyFrames: SENTINEL_LEGACY_FRAMES, pixelFrames: SENTINEL_PIXEL_FRAMES,
  },
});

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    const requestedReview = import.meta.env.DEV
      ? new URLSearchParams(window.location.search).get('art-review')
      : null;
    this.artReview = ART_REVIEW_ASSETS[requestedReview] ? requestedReview : null;
    const bar = this.add.rectangle(320, 190, 280, 10, 0x163b45).setOrigin(0.5);
    const progress = this.add.rectangle(180, 190, 0, 8, 0xffb349).setOrigin(0, 0.5);
    this.add.text(320, 160, 'Preparando las rutas de Pan de Marea…', {
      fontFamily: 'monospace', fontSize: '14px', color: '#f4e3b0',
    }).setOrigin(0.5);
    this.load.on('progress', (value) => progress.setDisplaySize(280 * value, 8));
    this.load.on('loaderror', (file) => {
      const fallback = file.type === 'audio' ? 'se usará silencio' : `se usará fallback en ${file.key}`;
      console.warn(`[Assets] No se pudo cargar ${file.src}; ${fallback}.`);
    });
    ASSET_MANIFEST.forEach((asset) => this.load.image(asset.key, `/${asset.file}`));
    AUDIO_ASSETS.forEach((asset) => this.load.audio(asset.key, `/${asset.file}`));
    if (this.artReview) {
      const review = ART_REVIEW_ASSETS[this.artReview];
      this.load.image('art-legacy-review', review.legacy);
      this.load.image('art-pixel-review', review.pixel);
    }
    this.load.once('complete', () => bar.destroy());
  }

  create() {
    registerManifestFrames(this);
    if (this.artReview) {
      const review = ART_REVIEW_ASSETS[this.artReview];
      registerTextureFrames(this, 'art-legacy-review', review.legacyFrames);
      registerTextureFrames(this, 'art-pixel-review', review.pixelFrames);
      this.registry.set('artReviewAsset', this.artReview);
    }
    createAnimations(this);
    if (import.meta.env.DEV) logAssetAudit();
    this.scene.start(this.artReview ? 'art-review' : this.game.registry.get('selectedLevel') || 'level-one');
  }
}
