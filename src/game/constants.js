export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;
export const DEBUG_PHYSICS = false;
export const DEBUG_MOVEMENT = false;
export const DEBUG_LEVEL_GEOMETRY = false;

export const PLAYER = Object.freeze({
  maxHealth: 3,
  maxRunSpeed: 175,
  groundAcceleration: 1050,
  airAcceleration: 680,
  groundDrag: 950,
  airDrag: 45,
  gravity: 560,
  fallGravityMultiplier: 1.45,
  jumpVelocity: -315,
  jumpReleaseMultiplier: 0.48,
  minimumJumpHoldMs: 55,
  coyoteTimeMs: 120,
  jumpBufferMs: 140,
  maxFallSpeed: 390,
  groundCheckDistance: 7,
  groundCheckInset: 4,
  collider: Object.freeze({ width: 68, height: 112, offsetX: 46, offsetY: 48 }),
  invulnerabilityMs: 1000,
  attackCooldownMs: 400,
  attackWindupMs: 90,
  attackActiveMs: 110,
});

export const OXYGEN = Object.freeze({
  max: 100,
  drainPerSecond: 1.5,
  lowThreshold: 30,
  zeroDamageIntervalMs: 1500,
  yeastRecovery: 8,
  ventRecovery: 30,
});

export const CRAWLER = Object.freeze({
  health: 2,
  damage: 1,
  patrolSpeed: 42,
  chaseSpeed: 70,
  detectionDistance: 150,
  attackDistance: 40,
  attackCooldownMs: 1200,
  alertMs: 250,
});

export const RECIPE = Object.freeze({
  yeastRequired: 3,
  bakeTimeMs: 1500,
});

export const OBJECTIVES = Object.freeze({
  explore: 'Explora la panadería',
  collect: 'Recolecta 3 Levaduras de Burbuja',
  oven: 'Llega al horno',
  bake: 'Prepara el Pan Térmico',
  gate: 'Activa la compuerta',
  complete: 'Nivel completado',
});
