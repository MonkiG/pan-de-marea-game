import { IS_PIXEL_ART_V1, PLAYER_ANIMATION_PROFILE } from '../art/artProfile.js';

const playerAnimations = Object.entries(PLAYER_ANIMATION_PROFILE).map(([name, definition]) => ({
  key: `bigotes-${name}`,
  texture: 'bigotes-sheet',
  prefix: `bigotes-${name}`,
  ...definition,
}));

const crawlerAnimations = IS_PIXEL_ART_V1 ? [
  { key: 'crawler-idle', texture: 'crawler-sheet', prefix: 'crawler-idle', count: 6, frameRate: 5, repeat: -1 },
  { key: 'crawler-patrol', texture: 'crawler-sheet', prefix: 'crawler-patrol', count: 8, frameRate: 8, repeat: -1 },
  { key: 'crawler-alert', texture: 'crawler-sheet', prefix: 'crawler-alert', count: 4, frameRate: 10, repeat: 0 },
  { key: 'crawler-attack', texture: 'crawler-sheet', prefix: 'crawler-attack', count: 8, frameRate: 14, repeat: 0 },
  { key: 'crawler-hurt', texture: 'crawler-sheet', prefix: 'crawler-hurt', count: 4, frameRate: 10, repeat: 0 },
  { key: 'crawler-stunned', texture: 'crawler-sheet', prefix: 'crawler-stun', count: 4, frameRate: 6, repeat: -1 },
  { key: 'crawler-defeat', texture: 'crawler-sheet', prefix: 'crawler-defeat', count: 6, frameRate: 8, repeat: 0 },
] : [
  { key: 'crawler-idle', texture: 'crawler-sheet', prefix: 'crawler-idle', count: 6, frameRate: 5, repeat: -1 },
  { key: 'crawler-patrol', texture: 'crawler-sheet', prefix: 'crawler-patrol', count: 6, frameRate: 8, repeat: -1 },
  { key: 'crawler-alert', texture: 'crawler-sheet', prefix: 'crawler-idle', count: 3, frameRate: 10, repeat: -1 },
  { key: 'crawler-attack', texture: 'crawler-sheet', prefix: 'crawler-attack', count: 6, frameRate: 12, repeat: 0 },
  { key: 'crawler-hurt', texture: 'crawler-sheet', prefix: 'crawler-hurt', count: 5, frameRate: 10, repeat: 0 },
  { key: 'crawler-stunned', texture: 'crawler-sheet', prefix: 'crawler-hurt', count: 2, frameRate: 4, repeat: -1 },
  { key: 'crawler-defeat', texture: 'crawler-sheet', prefix: 'crawler-defeat', count: 5, frameRate: 8, repeat: 0 },
];

const spitterAnimations = IS_PIXEL_ART_V1 ? [
  { key: 'spitter-idle', texture: 'spitter-sheet', prefix: 'spitter-idle', count: 6, frameRate: 5, repeat: -1 },
  { key: 'spitter-move', texture: 'spitter-sheet', prefix: 'spitter-move', count: 6, frameRate: 7, repeat: -1 },
  { key: 'spitter-charge', texture: 'spitter-sheet', prefix: 'spitter-charge', count: 6, frameRate: 8, repeat: 0 },
  { key: 'spitter-attack', texture: 'spitter-sheet', prefix: 'spitter-shoot', count: 8, frameRate: 12, repeat: 0 },
  { key: 'spitter-hurt', texture: 'spitter-sheet', prefix: 'spitter-hurt', count: 4, frameRate: 9, repeat: 0 },
  { key: 'spitter-defeat', texture: 'spitter-sheet', prefix: 'spitter-defeat', count: 8, frameRate: 8, repeat: 0 },
] : [
  { key: 'spitter-idle', texture: 'spitter-sheet', prefix: 'spitter-idle', count: 6, frameRate: 5, repeat: -1 },
  { key: 'spitter-charge', texture: 'spitter-sheet', prefix: 'spitter-charge', count: 4, frameRate: 6, repeat: 0 },
  { key: 'spitter-attack', texture: 'spitter-sheet', prefix: 'spitter-attack', count: 5, frameRate: 10, repeat: 0 },
  { key: 'spitter-hurt', texture: 'spitter-sheet', prefix: 'spitter-hurt', count: 4, frameRate: 9, repeat: 0 },
  { key: 'spitter-defeat', texture: 'spitter-sheet', prefix: 'spitter-defeat', count: 6, frameRate: 8, repeat: 0 },
];

const sentinelAnimations = IS_PIXEL_ART_V1 ? [
  { key: 'sentinel-idle', texture: 'sentinel-sheet', prefix: 'sentinel-sleep', count: 6, frameRate: 4, repeat: -1 },
  { key: 'sentinel-alert', texture: 'sentinel-sheet', prefix: 'sentinel-alert', count: 4, frameRate: 8, repeat: 0 },
  { key: 'sentinel-walk', texture: 'sentinel-sheet', prefix: 'sentinel-walk', count: 8, frameRate: 7, repeat: -1 },
  { key: 'sentinel-attack', texture: 'sentinel-sheet', prefix: 'sentinel-attack', count: 8, frameRate: 10, repeat: 0 },
  { key: 'sentinel-hurt', texture: 'sentinel-sheet', prefix: 'sentinel-hurt', count: 4, frameRate: 8, repeat: 0 },
  { key: 'sentinel-charge', texture: 'sentinel-sheet', prefix: 'sentinel-charge', count: 8, frameRate: 12, repeat: 0 },
  { key: 'sentinel-defeat', texture: 'sentinel-sheet', prefix: 'sentinel-defeat', count: 8, frameRate: 7, repeat: 0 },
] : [
  { key: 'sentinel-idle', texture: 'sentinel-sheet', prefix: 'sentinel-idle', count: 6, frameRate: 4, repeat: -1 },
  { key: 'sentinel-walk', texture: 'sentinel-sheet', prefix: 'sentinel-walk', count: 6, frameRate: 6, repeat: -1 },
  { key: 'sentinel-attack', texture: 'sentinel-sheet', prefix: 'sentinel-attack', count: 6, frameRate: 8, repeat: 0 },
  { key: 'sentinel-hurt', texture: 'sentinel-sheet', prefix: 'sentinel-hurt', count: 6, frameRate: 8, repeat: 0 },
  { key: 'sentinel-charge', texture: 'sentinel-sheet', prefix: 'sentinel-charge', count: 6, frameRate: 9, repeat: 0 },
  { key: 'sentinel-defeat', texture: 'sentinel-sheet', prefix: 'sentinel-defeat', count: 6, frameRate: 7, repeat: 0 },
];

export const ANIMATION_DATA = Object.freeze([
  ...playerAnimations,
  ...(IS_PIXEL_ART_V1 ? [
    { key: 'player-attack-effect-animation', texture: 'player-attack-effect', prefix: 'player-attack-effect', count: 6, frameRate: 16, repeat: 0 },
    { key: 'hit-spark-animation', texture: 'hit-spark', prefix: 'hit-spark', count: 6, frameRate: 18, repeat: 0 },
    { key: 'enemy-hit-effect-animation', texture: 'enemy-hit-effect', prefix: 'enemy-hit-effect', count: 6, frameRate: 18, repeat: 0 },
    { key: 'yeast-collect-effect-animation', texture: 'yeast-collect-effect', prefix: 'yeast-collect-effect', count: 6, frameRate: 16, repeat: 0 },
    { key: 'warm-burst-effect-animation', texture: 'warm-burst-effect', prefix: 'warm-burst-effect', count: 6, frameRate: 14, repeat: 0 },
    { key: 'pressure-burst-effect-animation', texture: 'pressure-burst-effect', prefix: 'pressure-burst-effect', count: 6, frameRate: 14, repeat: 0 },
    { key: 'oxygen-vent-animation', texture: 'oxygen-vent-sheet', prefix: 'oxygen-vent', count: 4, frameRate: 6, repeat: -1 },
    { key: 'corrupted-projectile-animation', texture: 'corrupted-projectile-sheet', prefix: 'corrupted-projectile', count: 6, frameRate: 12, repeat: -1 },
    { key: 'baguette-torpedo-projectile-animation', texture: 'baguette-torpedo-projectile-sheet', prefix: 'baguette-torpedo-projectile', count: 6, frameRate: 12, repeat: -1 },
    { key: 'baguette-impact-animation', texture: 'baguette-impact-sheet', prefix: 'baguette-impact', count: 6, frameRate: 18, repeat: 0 },
  ] : []),
  ...crawlerAnimations,
  { key: 'yeast-idle', texture: 'yeast-sheet', prefix: 'yeast-idle', count: 6, frameRate: 7, repeat: -1 },
  { key: 'yeast-attract', texture: 'yeast-sheet', prefix: 'yeast-attract', count: IS_PIXEL_ART_V1 ? 6 : 5, frameRate: 11, repeat: -1 },
  { key: 'yeast-collect', texture: 'yeast-sheet', prefix: 'yeast-collect', count: IS_PIXEL_ART_V1 ? 8 : 6, frameRate: 14, repeat: 0 },
  { key: 'gate-inactive', texture: 'gate-sheet', prefix: 'gate-inactive', count: 6, frameRate: 4, repeat: -1 },
  { key: 'gate-activate', texture: 'gate-sheet', prefix: 'gate-activate', count: IS_PIXEL_ART_V1 ? 8 : 6, frameRate: 8, repeat: 0 },
  { key: 'gate-active', texture: 'gate-sheet', prefix: 'gate-active', count: 6, frameRate: 6, repeat: -1 },
  ...spitterAnimations,
  ...sentinelAnimations,
]);
