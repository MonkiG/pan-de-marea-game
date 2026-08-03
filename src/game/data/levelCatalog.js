import { LEVEL_IDS } from '../constants.js';

export const LEVEL_CATALOG = Object.freeze([
  Object.freeze({
    id: LEVEL_IDS.bakery,
    label: 'Tutorial',
    name: 'La Panadería Hundida',
    description: 'Aprende movimiento, combate, oxígeno, cobertura, corrientes, reguladores y checkpoint mientras preparas el Pan Térmico.',
    objective: 'Fundamentos bajo la marea',
    background: '/panaderia-undida-bg-1.png',
  }),
  Object.freeze({
    id: LEVEL_IDS.market,
    label: 'Nivel I',
    name: 'El Mercado Sumergido',
    description: 'Combina enemigos, corrientes y peligros, activa cuatro reguladores y supera al Sentinela para abrir la salida.',
    objective: 'La prueba del mercado',
    background: '/mercado-undido-1.png',
    unlockCopy: 'Completa el Tutorial para desbloquear el Nivel I.',
  }),
]);

export const getLevelDefinition = (levelId) => (
  LEVEL_CATALOG.find((level) => level.id === levelId) ?? LEVEL_CATALOG[0]
);
