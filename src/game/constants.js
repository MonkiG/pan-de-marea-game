export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;
export const DEBUG_PHYSICS = false;
export const DEBUG_MOVEMENT = false;
export const DEBUG_LEVEL_GEOMETRY = false;
export const DEBUG_LEVEL_LAYOUT = false;
export const DEV_UNLOCK_ALL_LEVELS = false;

export const LEVEL_IDS = Object.freeze({
  bakery: 'level-one',
  market: 'level-two',
});

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

export const PRESSURE_RECIPE = Object.freeze({
  yeastRequired: 5,
  regulatorsRequired: 3,
  bakeTimeMs: 1700,
});

export const MARKET_OXYGEN = Object.freeze({
  ...OXYGEN,
  drainPerSecond: 1.4,
  yeastRecovery: 6,
  stationRecovery: 45,
  criticalThreshold: 12,
});

export const SPITTER = Object.freeze({
  maxHealth: 3,
  contactDamage: 1,
  projectileDamage: 1,
  detectionRange: 320,
  attackRange: 280,
  minimumAttackRange: 70,
  projectileSpeed: 115,
  chargeDurationMs: 650,
  attackCooldownMs: 1800,
  recoveryDurationMs: 750,
  activationDistance: 520,
});

export const SENTINEL = Object.freeze({
  maxHealth: 6,
  damage: 1,
  detectionRange: 220,
  walkSpeed: 32,
  attackRange: 55,
  basicAttackCooldownMs: 1500,
  chargeDistance: 130,
  chargeCooldownMs: 4000,
  stunDurationMs: 900,
  activationDistance: 440,
});

export const OBJECTIVES = Object.freeze({
  explore: 'Explora la panadería',
  collect: 'Recolecta 3 Levaduras de Burbuja',
  oven: 'Llega al horno',
  bake: 'Prepara el Pan Térmico',
  gate: 'Activa la compuerta',
  complete: 'Nivel completado',
});

export const MARKET_OBJECTIVES = Object.freeze({
  explore: 'Explora el Mercado Sumergido',
  regulators: 'Activa los 3 reguladores de presión',
  collect: 'Recolecta 5 Levaduras de Burbuja',
  sentinel: 'Supera al guardián del Coral Negro',
  oven: 'Llega a la estación de presión',
  bake: 'Prepara el Pan de Presión',
  exit: 'Abre la salida del mercado',
  complete: 'El Mercado Sumergido ha sido atravesado',
});
