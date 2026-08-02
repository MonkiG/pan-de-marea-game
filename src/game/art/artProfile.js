export const ART_PROFILES = Object.freeze({
  legacy: 'legacy',
  pixelV1: 'pixel-v1',
});

const developmentProfile = import.meta.env?.DEV && typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search).get('art-profile')
  : null;
const requestedProfile = developmentProfile ?? import.meta.env?.VITE_ART_PROFILE;
export const ACTIVE_ART_PROFILE = requestedProfile === ART_PROFILES.pixelV1
  ? ART_PROFILES.pixelV1
  : ART_PROFILES.legacy;
export const IS_PIXEL_ART_V1 = ACTIVE_ART_PROFILE === ART_PROFILES.pixelV1;

const legacy = Object.freeze({
  id: ART_PROFILES.legacy,
  scale: 0.42,
  origin: Object.freeze({ x: 0.5, y: 0.82 }),
  collider: Object.freeze({ width: 68, height: 112, offsetX: 46, offsetY: 48 }),
  attack: Object.freeze({
    hitbox: Object.freeze({ width: 58, height: 48, offsetX: 50, offsetY: -34 }),
    activeFrames: Object.freeze([1, 2]),
    fallbackDurationMs: 500,
  }),
});

const pixelV1 = Object.freeze({
  id: ART_PROFILES.pixelV1,
  scale: 1,
  origin: Object.freeze({ x: 0.5, y: 1 }),
  collider: Object.freeze({ width: 26, height: 46, offsetX: 11, offsetY: 18 }),
  attack: Object.freeze({
    hitbox: Object.freeze({ width: 36, height: 30, offsetX: 30, offsetY: -31 }),
    effect: Object.freeze({ offsetX: 34, offsetY: -31 }),
    activeFrames: Object.freeze([2, 3, 4]),
    fallbackDurationMs: 560,
  }),
});

export const PLAYER_ART_PROFILES = Object.freeze({ legacy, pixelV1 });
export const PLAYER_ART_PROFILE = IS_PIXEL_ART_V1
  ? PLAYER_ART_PROFILES.pixelV1
  : PLAYER_ART_PROFILES.legacy;

const pixelV1Animations = Object.freeze({
  idle: Object.freeze({ count: 6, frameRate: 6, repeat: -1 }),
  swim: Object.freeze({ count: 8, frameRate: 9, repeat: -1 }),
  jump: Object.freeze({ count: 3, frameRate: 10, repeat: 0 }),
  fall: Object.freeze({ count: 4, frameRate: 9, repeat: 0 }),
  attack: Object.freeze({ count: 8, frameRate: 16, repeat: 0 }),
  hurt: Object.freeze({ count: 4, frameRate: 10, repeat: 0 }),
  defeat: Object.freeze({ count: 6, frameRate: 7, repeat: 0 }),
  interact: Object.freeze({ count: 4, frameRate: 8, repeat: 0 }),
});

const legacyAnimations = Object.freeze({
  idle: Object.freeze({ count: 6, frameRate: 6, repeat: -1 }),
  swim: Object.freeze({ count: 6, frameRate: 9, repeat: -1 }),
  attack: Object.freeze({ count: 6, frameRate: 14, repeat: 0 }),
  hurt: Object.freeze({ count: 4, frameRate: 10, repeat: 0 }),
  defeat: Object.freeze({ count: 6, frameRate: 7, repeat: 0 }),
});

export const PLAYER_ANIMATION_PROFILES = Object.freeze({
  legacy: legacyAnimations,
  pixelV1: pixelV1Animations,
});
export const PLAYER_ANIMATION_PROFILE = IS_PIXEL_ART_V1
  ? PLAYER_ANIMATION_PROFILES.pixelV1
  : PLAYER_ANIMATION_PROFILES.legacy;
