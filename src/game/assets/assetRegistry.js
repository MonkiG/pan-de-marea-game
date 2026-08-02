import { IS_PIXEL_ART_V1 } from '../art/artProfile.js';

export const ASSET_REGISTRY = Object.freeze({
  bigotes: IS_PIXEL_ART_V1
    ? { key: 'bigotes-sheet', path: 'pixel-art/v1/characters/bigotes.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 384, height: 512, fallback: 'fallback-player' }
    : { key: 'bigotes-sheet', path: 'bigotes-assets.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1024, height: 1536, fallback: 'fallback-player' },
  ...(IS_PIXEL_ART_V1 ? {
    playerAttackEffect: { key: 'player-attack-effect', path: 'pixel-art/v1/effects/player-attack.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 192, height: 32 },
    hitSpark: { key: 'hit-spark', path: 'pixel-art/v1/effects/hit-spark.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 144, height: 24 },
  } : {}),
  brineCrawler: IS_PIXEL_ART_V1
    ? { key: 'crawler-sheet', path: 'pixel-art/v1/characters/brine-crawler.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 640, height: 336, fallback: 'fallback-enemy' }
    : { key: 'crawler-sheet', path: 'rastrero-de-salmuera.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-enemy' },
  bubbleYeast: { key: 'yeast-sheet', path: 'golden-bubble-yeast.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-yeast' },
  thermalGate: { key: 'gate-sheet', path: 'rusty-undewater-portal.png', type: 'image-sheet', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024, fallback: 'fallback-gate' },
  bakeryBackgroundFar: IS_PIXEL_ART_V1
    ? { key: 'bakery-bg-1', path: 'pixel-art/v1/backgrounds/panaderia-undida-bg-1.png', type: 'image', status: 'pixel-v1', usedIn: ['level-one'], width: 640, height: 360 }
    : { key: 'bakery-bg-1', path: 'panaderia-undida-bg-1.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  bakeryBackgroundMid: IS_PIXEL_ART_V1
    ? { key: 'bakery-bg-2', path: 'pixel-art/v1/backgrounds/panaderia-undida-bg-2.png', type: 'image', status: 'pixel-v1', usedIn: ['level-one'], width: 640, height: 360 }
    : { key: 'bakery-bg-2', path: 'panaderia-undida-bg-2.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  bakeryBackgroundNear: IS_PIXEL_ART_V1
    ? { key: 'bakery-bg-3', path: 'pixel-art/v1/backgrounds/panaderia-undida-bg-3.png', type: 'image', status: 'pixel-v1', usedIn: ['level-one'], width: 640, height: 360 }
    : { key: 'bakery-bg-3', path: 'panaderia-undida-bg-3.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  sharedTileset: { key: 'tileset', path: 'tileset.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-platform' },
  marketBackgroundFar: IS_PIXEL_ART_V1
    ? { key: 'market-bg-1', path: 'pixel-art/v1/backgrounds/mercado-undido-1.png', type: 'image', status: 'pixel-v1', usedIn: ['level-two'], width: 640, height: 360, fallback: 'fallback-market-background' }
    : { key: 'market-bg-1', path: 'mercado-undido-1.png', type: 'image', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-market-background' },
  marketBackgroundMid: IS_PIXEL_ART_V1
    ? { key: 'market-bg-2', path: 'pixel-art/v1/backgrounds/mercado-undido-2.png', type: 'image', status: 'pixel-v1', usedIn: ['level-two'], width: 640, height: 360, fallback: 'fallback-market-background' }
    : { key: 'market-bg-2', path: 'mercado-undido-2.png', type: 'image', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-market-background' },
  marketBackgroundNear: IS_PIXEL_ART_V1
    ? { key: 'market-bg-3', path: 'pixel-art/v1/backgrounds/mercado-undido-3.png', type: 'image', status: 'pixel-v1', usedIn: ['level-two'], width: 640, height: 360, fallback: 'fallback-market-background' }
    : { key: 'market-bg-3', path: 'mercado-undido-3.png', type: 'image', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-market-background' },
  abyssalSpitter: IS_PIXEL_ART_V1
    ? { key: 'spitter-sheet', path: 'pixel-art/v1/characters/abyssal-spitter.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-two'], width: 640, height: 384, fallback: 'fallback-spitter' }
    : { key: 'spitter-sheet', path: 'escupemasas.png', type: 'image-sheet', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-spitter' },
  blackCoralSentinel: IS_PIXEL_ART_V1
    ? { key: 'sentinel-sheet', path: 'pixel-art/v1/characters/black-coral-sentinel.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-two'], width: 768, height: 784, fallback: 'fallback-sentinel' }
    : { key: 'sentinel-sheet', path: 'sentinela-del-coral-negro.png', type: 'image-sheet', status: 'used-level-2', usedIn: ['level-two'], width: 1024, height: 1536, fallback: 'fallback-sentinel' },
  corruptedDoughProjectile: { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-projectile' },
  pressureRegulator: { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-regulator' },
  pressureOven: { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-pressure-oven' },
  marketExit: { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-market-exit' },
  marketCheckpoint: { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-checkpoint' },
  marketStall: { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-market-stall' },
  blackCoralHazard: { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-hazard' },
});

export const getLoadableAssets = () => Object.entries(ASSET_REGISTRY)
  .filter(([, asset]) => asset.path && asset.key)
  .map(([id, asset]) => ({ id, ...asset }));
