export const ASSET_REGISTRY = Object.freeze({
  bigotes: { key: 'bigotes-sheet', path: 'bigotes-assets.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1024, height: 1536, fallback: 'fallback-player' },
  brineCrawler: { key: 'crawler-sheet', path: 'rastrero-de-salmuera.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-enemy' },
  bubbleYeast: { key: 'yeast-sheet', path: 'golden-bubble-yeast.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-yeast' },
  thermalGate: { key: 'gate-sheet', path: 'rusty-undewater-portal.png', type: 'image-sheet', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024, fallback: 'fallback-gate' },
  bakeryBackgroundFar: { key: 'bakery-bg-1', path: 'panaderia-undida-bg-1.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  bakeryBackgroundMid: { key: 'bakery-bg-2', path: 'panaderia-undida-bg-2.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  bakeryBackgroundNear: { key: 'bakery-bg-3', path: 'panaderia-undida-bg-3.png', type: 'image', status: 'used-level-1', usedIn: ['level-one'], width: 1536, height: 1024 },
  sharedTileset: { key: 'tileset', path: 'tileset.png', type: 'image-sheet', status: 'shared', usedIn: ['level-one', 'level-two'], width: 1536, height: 1024, fallback: 'fallback-platform' },
  marketBackgroundFar: { key: 'market-bg-1', path: 'mercado-undido-1.png', type: 'image', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-market-background' },
  marketBackgroundMid: { key: 'market-bg-2', path: 'mercado-undido-2.png', type: 'image', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-market-background' },
  marketBackgroundNear: { key: 'market-bg-3', path: 'mercado-undido-3.png', type: 'image', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-market-background' },
  abyssalSpitter: { key: 'spitter-sheet', path: 'escupemasas.png', type: 'image-sheet', status: 'used-level-2', usedIn: ['level-two'], width: 1536, height: 1024, fallback: 'fallback-spitter' },
  blackCoralSentinel: { key: 'sentinel-sheet', path: 'sentinela-del-coral-negro.png', type: 'image-sheet', status: 'used-level-2', usedIn: ['level-two'], width: 1024, height: 1536, fallback: 'fallback-sentinel' },
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
