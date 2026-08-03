// Tutorial — La Panadería Hundida.
// Cada objeto persistente declara la superficie que lo sostiene. Las posiciones
// verticales se resuelven en runtime para impedir props o enemigos flotantes.
export const LEVEL_ONE_DATA = Object.freeze({
  id: 'level-one',
  name: 'La Panadería Hundida',
  publicLabel: 'Tutorial',
  worldWidth: 5600,
  worldHeight: 360,
  spawn: { x: 120, surfaceId: 'floor' },
  requiredYeast: 3,
  requiredRegulators: 1,
  collision: {
    floorTop: 323,
    floorHeight: 37,
    platformThickness: 8,
    platformHorizontalInset: 4,
  },
  zones: [
    { id: 'controls', from: 0, to: 700 },
    { id: 'oxygen', from: 700, to: 1400 },
    { id: 'combat', from: 1400, to: 2100 },
    { id: 'ranged', from: 2100, to: 2750 },
    { id: 'current', from: 2750, to: 3250 },
    { id: 'hazard', from: 3250, to: 3650 },
    { id: 'regulator', from: 3650, to: 4150 },
    { id: 'checkpoint', from: 4150, to: 4550 },
    { id: 'oven', from: 4550, to: 5100 },
    { id: 'gate', from: 5100, to: 5600 },
  ],
  platforms: [
    { id: 'intro-step', x: 420, y: 292, width: 190, height: 22, supportKind: 'stone', frame: 'tile-platform-small' },
    { id: 'intro-rise', x: 630, y: 255, width: 160, height: 20, supportKind: 'stone', frame: 'tile-platform-small' },
    { id: 'yeast-a-platform', x: 880, y: 280, width: 200, height: 22, supportKind: 'stone', frame: 'tile-platform-long' },
    { id: 'yeast-b-platform', x: 1160, y: 235, width: 200, height: 22, supportKind: 'stone', frame: 'tile-platform-long' },
    { id: 'combat-entry', x: 1420, y: 280, width: 150, height: 20, supportKind: 'stone', frame: 'tile-platform-small' },
    { id: 'yeast-c-platform', x: 2050, y: 270, width: 180, height: 20, supportKind: 'stone', frame: 'tile-platform-long' },
    { id: 'ranged-perch', x: 2350, y: 250, width: 180, height: 20, supportKind: 'stone', frame: 'tile-platform-long' },
    { id: 'hazard-step', x: 3520, y: 284, width: 170, height: 20, supportKind: 'stone', frame: 'tile-platform-small' },
    { id: 'oven-step', x: 4560, y: 286, width: 170, height: 20, supportKind: 'stone', frame: 'tile-platform-small' },
  ],
  collectibles: [
    { id: 'yeast-a', x: 880, surfaceId: 'yeast-a-platform' },
    { id: 'yeast-b', x: 1160, surfaceId: 'yeast-b-platform' },
    { id: 'yeast-c', x: 2050, surfaceId: 'yeast-c-platform' },
    { id: 'yeast-d', x: 3150, surfaceId: 'floor' },
    // Levaduras opcionales: exceden el objetivo (3) para poder elaborar la
    // Baguette Torpedo sin arriesgar la reserva del Pan Térmico.
    { id: 'yeast-opt-a', x: 630, surfaceId: 'intro-rise' },
    { id: 'yeast-opt-b', x: 3520, surfaceId: 'hazard-step' },
  ],
  enemies: [
    { id: 'crawler-a', x: 1750, surfaceId: 'floor', patrolMin: 1560, patrolMax: 1950 },
  ],
  spitters: [
    { id: 'spitter-a', x: 2350, surfaceId: 'ranged-perch', patrolMin: 2290, patrolMax: 2410 },
  ],
  covers: [
    { id: 'cover-a', kind: 'rocks', x: 2520, surfaceId: 'floor', width: 76, height: 64 },
  ],
  currents: [
    { id: 'current-a', x: 2950, surfaceId: 'floor', width: 260, height: 150, forceX: 16, forceY: -2 },
  ],
  hazards: [
    { id: 'hazard-a', x: 3400, surfaceId: 'floor', width: 70, height: 34 },
  ],
  regulators: [
    { id: 'regulator-a', x: 3800, surfaceId: 'floor', interactionRadius: 82 },
  ],
  checkpoint: { id: 'tutorial-checkpoint', x: 4300, surfaceId: 'floor', radius: 44 },
  oxygenVent: { id: 'tutorial-vent', x: 1200, surfaceId: 'floor', radius: 55 },
  oven: { x: 4750, surfaceId: 'floor', interactionRadius: 105 },
  gate: { x: 5350, surfaceId: 'floor', interactionRadius: 115 },
  decorations: [
    { id: 'rocks-a', x: 1540, surfaceId: 'floor', frame: 'tile-rocks', width: 130, height: 58 },
    { id: 'coral-a', x: 2860, surfaceId: 'floor', frame: 'tile-coral', width: 58, height: 66 },
    { id: 'rocks-b', x: 4010, surfaceId: 'floor', frame: 'tile-rocks', width: 120, height: 54 },
  ],
  jumpLinks: [
    { from: 'intro-step', to: 'intro-rise', required: true },
    { from: 'intro-rise', to: 'yeast-a-platform', required: true },
    { from: 'yeast-a-platform', to: 'yeast-b-platform', required: true },
    { from: 'yeast-b-platform', to: 'combat-entry', required: true },
  ],
  tutorials: [
    { id: 'move', atX: 0, message: 'A / D o flechas para moverte', duration: 3600 },
    { id: 'jump', atX: 300, message: 'Espacio o W para saltar', duration: 3200 },
    { id: 'oxygen', atX: 760, message: 'Tu oxígeno baja poco a poco', duration: 3400 },
    { id: 'yeast', atX: 840, message: 'La Levadura de Burbuja recupera oxígeno', duration: 3200 },
    { id: 'vent-hint', atX: 1120, message: 'Los respiraderos rellenan tu oxígeno', duration: 3200 },
    { id: 'attack', atX: 1540, message: 'J o X para atacar al Rastrero', duration: 3400 },
    { id: 'ranged', atX: 2140, message: 'El Escupemasas dispara Masa Corrupta a distancia', duration: 3600 },
    { id: 'cover', atX: 2440, message: 'Usa las rocas como cobertura', duration: 3400 },
    { id: 'current', atX: 2820, message: 'Las corrientes empujan: avanza con cuidado', duration: 3600 },
    { id: 'hazard', atX: 3300, message: 'El coral hace daño: salta por encima', duration: 3400 },
    { id: 'regulator-hint', atX: 3680, message: 'Activa el regulador con E para encender el horno', duration: 3800 },
    { id: 'checkpoint-hint', atX: 4180, message: 'Toca el checkpoint para guardar tu avance', duration: 3400 },
    { id: 'oven-hint', atX: 4560, message: 'Con 3 Levaduras y el regulador, usa el horno (E)', duration: 4000 },
    { id: 'gate-hint', atX: 5120, message: 'Lleva el Pan Térmico a la compuerta (E)', duration: 3600 },
  ],
});
