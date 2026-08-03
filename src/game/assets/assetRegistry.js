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
  bubbleYeast: IS_PIXEL_ART_V1
    ? { key: 'yeast-sheet', path: 'pixel-art/v1/props/bubble-yeast.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 384, height: 144, fallback: 'fallback-yeast' }
    : { key: 'yeast-sheet', path: 'golden-bubble-yeast.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-yeast' },
  thermalGate: IS_PIXEL_ART_V1
    ? { key: 'gate-sheet', path: 'pixel-art/v1/props/thermal-gate.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one'], width: 1024, height: 480, fallback: 'fallback-gate' }
    : { key: 'gate-sheet', path: 'rusty-undewater-portal.png', type: 'image-sheet', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024, fallback: 'fallback-gate' },
  thermalOven: IS_PIXEL_ART_V1
    ? { key: 'thermal-oven-sheet', path: 'pixel-art/v1/props/thermal-oven.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one'], width: 384, height: 80, fallback: 'fallback-oven' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one'], fallback: 'fallback-oven' },
  oxygenVent: IS_PIXEL_ART_V1
    ? { key: 'oxygen-vent-sheet', path: 'pixel-art/v1/props/oxygen-vent.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 192, height: 48 }
    : { key: null, path: null, type: 'procedural', status: 'procedural', usedIn: ['level-one', 'level-two'] },
  bakeryBackgroundFar: IS_PIXEL_ART_V1
    ? { key: 'bakery-bg-1', path: 'pixel-art/v1/backgrounds/panaderia-undida-bg-1.png', type: 'image', status: 'pixel-v1', usedIn: ['level-one'], width: 640, height: 360 }
    : { key: 'bakery-bg-1', path: 'panaderia-undida-bg-1.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  bakeryBackgroundMid: IS_PIXEL_ART_V1
    ? { key: 'bakery-bg-2', path: 'pixel-art/v1/backgrounds/panaderia-undida-bg-2.png', type: 'image', status: 'pixel-v1', usedIn: ['level-one'], width: 640, height: 360 }
    : { key: 'bakery-bg-2', path: 'panaderia-undida-bg-2.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  bakeryBackgroundNear: IS_PIXEL_ART_V1
    ? { key: 'bakery-bg-3', path: 'pixel-art/v1/backgrounds/panaderia-undida-bg-3.png', type: 'image', status: 'pixel-v1', usedIn: ['level-one'], width: 640, height: 360 }
    : { key: 'bakery-bg-3', path: 'panaderia-undida-bg-3.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  sharedTileset: IS_PIXEL_ART_V1
    ? { key: 'tileset', path: 'pixel-art/v1/tiles/level-tileset.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 512, height: 512, fallback: 'fallback-platform' }
    : { key: 'tileset', path: 'tileset.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-platform' },
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
    ? { key: 'spitter-sheet', path: 'pixel-art/v1/characters/abyssal-spitter.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 640, height: 384, fallback: 'fallback-spitter' }
    : { key: 'spitter-sheet', path: 'escupemasas.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-spitter' },
  blackCoralSentinel: IS_PIXEL_ART_V1
    ? { key: 'sentinel-sheet', path: 'pixel-art/v1/characters/black-coral-sentinel.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-two'], width: 768, height: 784, fallback: 'fallback-sentinel' }
    : { key: 'sentinel-sheet', path: 'sentinela-del-coral-negro.png', type: 'image-sheet', status: 'used-level-2', usedIn: ['level-two'], width: 1024, height: 1536, fallback: 'fallback-sentinel' },
  corruptedDoughProjectile: IS_PIXEL_ART_V1
    ? { key: 'corrupted-projectile-sheet', path: 'pixel-art/v1/props/corrupted-dough-projectile.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 144, height: 24, fallback: 'fallback-projectile' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one', 'level-two'], fallback: 'fallback-projectile' },
  baguetteTorpedoProjectile: IS_PIXEL_ART_V1
    ? { key: 'baguette-torpedo-projectile-sheet', path: 'pixel-art/v1/recipes/baguette-torpedo-projectile.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 288, height: 24, fallback: 'fallback-projectile' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one', 'level-two'], fallback: 'fallback-projectile' },
  baguetteImpact: IS_PIXEL_ART_V1
    ? { key: 'baguette-impact-sheet', path: 'pixel-art/v1/recipes/baguette-impact.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 288, height: 48 }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one', 'level-two'] },
  baguetteTorpedoItem: IS_PIXEL_ART_V1
    ? { key: 'baguette-torpedo-item', path: 'pixel-art/v1/recipes/baguette-torpedo-item.png', type: 'image', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 64, height: 32 }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one', 'level-two'] },
  pressureRegulator: IS_PIXEL_ART_V1
    ? { key: 'pressure-regulator-sheet', path: 'pixel-art/v1/props/pressure-regulator.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 144, height: 64, fallback: 'fallback-regulator' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one', 'level-two'], fallback: 'fallback-regulator' },
  pressureOven: IS_PIXEL_ART_V1
    ? { key: 'pressure-oven-sheet', path: 'pixel-art/v1/props/pressure-oven.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-two'], width: 384, height: 96, fallback: 'fallback-pressure-oven' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-pressure-oven' },
  marketExit: IS_PIXEL_ART_V1
    ? { key: 'market-exit-sheet', path: 'pixel-art/v1/props/market-exit.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-two'], width: 384, height: 160, fallback: 'fallback-market-exit' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-market-exit' },
  marketCheckpoint: IS_PIXEL_ART_V1
    ? { key: 'market-checkpoint-sheet', path: 'pixel-art/v1/props/market-checkpoint.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 144, height: 80, fallback: 'fallback-checkpoint' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one', 'level-two'], fallback: 'fallback-checkpoint' },
  marketStall: IS_PIXEL_ART_V1
    ? { key: 'market-stalls-sheet', path: 'pixel-art/v1/props/market-stalls.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-two'], width: 640, height: 96, fallback: 'fallback-market-stall' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-two'], fallback: 'fallback-market-stall' },
  blackCoralHazard: IS_PIXEL_ART_V1
    ? { key: 'black-coral-hazard-sheet', path: 'pixel-art/v1/props/black-coral-hazard.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 256, height: 32, fallback: 'fallback-hazard' }
    : { key: null, path: null, type: 'missing', status: 'fallback-required', usedIn: ['level-one', 'level-two'], fallback: 'fallback-hazard' },
  ...(IS_PIXEL_ART_V1 ? {
    enemyHitEffect: { key: 'enemy-hit-effect', path: 'pixel-art/v1/effects/enemy-hit.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 144, height: 24 },
    yeastCollectEffect: { key: 'yeast-collect-effect', path: 'pixel-art/v1/effects/yeast-collect.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 192, height: 32 },
    warmBurstEffect: { key: 'warm-burst-effect', path: 'pixel-art/v1/effects/warm-burst.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 288, height: 48 },
    pressureBurstEffect: { key: 'pressure-burst-effect', path: 'pixel-art/v1/effects/pressure-burst.png', type: 'image-sheet', status: 'pixel-v1', usedIn: ['level-one', 'level-two'], width: 288, height: 48 },
  } : {}),
});

export const getLoadableAssets = () => Object.entries(ASSET_REGISTRY)
  .filter(([, asset]) => asset.path && asset.key)
  .map(([id, asset]) => ({ id, ...asset }));
