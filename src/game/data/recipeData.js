// Fuente única de balance para el sistema de recetas y panes especiales.
// No distribuir estos valores por escenas o componentes (ver
// CLAUDE_RECIPES_IMPLEMENTATION.md §3).

export const SPECIAL_RECIPE_IDS = Object.freeze({
  baguetteTorpedo: 'baguette-torpedo',
  futureOxygen: 'future-oxygen',
  futureShield: 'future-shield',
});

export const SPECIAL_BREAD_RECIPES = Object.freeze({
  'baguette-torpedo': Object.freeze({
    id: 'baguette-torpedo',
    name: 'Baguette Torpedo',
    description: 'Proyectil de pan que causa 2 de daño.',
    unlocked: true,
    cost: 1,
    maxStack: 3,
    icon: '/pixel-art/v1/recipes/icon-baguette-torpedo.png',
    damage: 2,
    speed: 280,
    lifetimeMs: 1400,
    cooldownMs: 650,
    collider: Object.freeze({ width: 36, height: 14, offsetX: 6, offsetY: 5 }),
    spawnOffset: Object.freeze({ x: 30, y: -28 }),
  }),
  'future-oxygen': Object.freeze({
    id: 'future-oxygen',
    name: 'Receta futura',
    description: 'Se desbloquea en otro nivel.',
    unlocked: false,
    cost: null,
    maxStack: 0,
    icon: '/pixel-art/v1/recipes/icon-future-oxygen.png',
  }),
  'future-shield': Object.freeze({
    id: 'future-shield',
    name: 'Receta futura',
    description: 'Se desbloquea en otro nivel.',
    unlocked: false,
    cost: null,
    maxStack: 0,
    icon: '/pixel-art/v1/recipes/icon-future-shield.png',
  }),
});

// Orden estable de las tarjetas mostradas en el menú del horno.
export const SPECIAL_RECIPE_ORDER = Object.freeze([
  SPECIAL_RECIPE_IDS.baguetteTorpedo,
  SPECIAL_RECIPE_IDS.futureOxygen,
  SPECIAL_RECIPE_IDS.futureShield,
]);

export const SPECIAL_BREAD_INPUT = Object.freeze({ cycle: 'Q', use: 'K' });
export const BAGUETTE_POOL_SIZE = 6;
