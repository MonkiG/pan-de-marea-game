export const FLOOR_SURFACE_ID = 'floor';

const COLLECTION_RULES = Object.freeze([
  ['collectibles', 'hover'],
  ['enemies', 'grounded'],
  ['crawlers', 'grounded'],
  ['spitters', 'grounded'],
  ['regulators', 'grounded'],
  ['oxygenStations', 'grounded'],
  ['covers', 'grounded'],
  ['hazards', 'grounded'],
  ['decorations', 'grounded'],
  ['currents', 'volume'],
]);

const SINGLE_RULES = Object.freeze([
  ['spawn', 'spawn'],
  ['sentinel', 'grounded'],
  ['sentinelBarrier', 'barrier'],
  ['oxygenVent', 'grounded'],
  ['checkpoint', 'grounded'],
  ['oven', 'grounded'],
  ['gate', 'grounded'],
  ['pressureOven', 'grounded'],
  ['exit', 'grounded'],
]);

export function getLevelSurfaces(levelData) {
  const floorTop = levelData.collision.floorTop;
  const surfaces = new Map([
    [FLOOR_SURFACE_ID, {
      id: FLOOR_SURFACE_ID,
      x: levelData.worldWidth / 2,
      width: levelData.worldWidth,
      top: floorTop,
      kind: 'floor',
    }],
  ]);
  levelData.platforms.forEach((platform) => surfaces.set(platform.id, {
    ...platform,
    top: platform.y - platform.height / 2,
    kind: 'platform',
  }));
  return surfaces;
}

function placeItem(item, rule, surfaces) {
  if (!item) return item;
  const surface = surfaces.get(item.surfaceId);
  if (!surface) return { ...item };
  const y = rule === 'hover'
    ? surface.top - (item.hoverOffset ?? 40)
    : rule === 'volume'
      ? surface.top - item.height / 2
      : rule === 'barrier'
        ? surface.top - item.height / 2
        : rule === 'spawn'
          ? surface.top - (item.spawnClearance ?? 8)
          : surface.top;
  return { ...item, y };
}

export function resolveLevelPlacements(levelData) {
  const surfaces = getLevelSurfaces(levelData);
  const resolved = { ...levelData };
  COLLECTION_RULES.forEach(([key, rule]) => {
    if (levelData[key]) resolved[key] = levelData[key].map((item) => placeItem(item, rule, surfaces));
  });
  SINGLE_RULES.forEach(([key, rule]) => {
    if (levelData[key]) resolved[key] = placeItem(levelData[key], rule, surfaces);
  });
  return resolved;
}

const insideSurface = (item, surface, inset = 18) => {
  const halfWidth = Math.max(0, surface.width / 2 - inset);
  return item.x >= surface.x - halfWidth && item.x <= surface.x + halfWidth;
};

export function validateLevelSupports(levelData) {
  const surfaces = getLevelSurfaces(levelData);
  const errors = [];

  levelData.platforms.forEach((platform) => {
    if (!['stone', 'stall'].includes(platform.supportKind)) {
      errors.push(`La plataforma ${platform.id} no tiene un acabado visual válido.`);
    }
    if (platform.y - platform.height / 2 >= levelData.collision.floorTop) {
      errors.push(`La plataforma ${platform.id} no está elevada sobre el suelo.`);
    }
  });

  const validateItem = (item, label) => {
    if (!item?.surfaceId) {
      errors.push(`${label} no declara surfaceId.`);
      return;
    }
    const surface = surfaces.get(item.surfaceId);
    if (!surface) {
      errors.push(`${label} usa la superficie inexistente ${item.surfaceId}.`);
      return;
    }
    if (!insideSurface(item, surface, item.supportInset ?? 18)) {
      errors.push(`${label} queda fuera de la zona segura de ${item.surfaceId}.`);
    }
    if (item.patrolMin != null && item.patrolMax != null && surface.id !== FLOOR_SURFACE_ID) {
      const left = surface.x - surface.width / 2 + 12;
      const right = surface.x + surface.width / 2 - 12;
      if (item.patrolMin < left || item.patrolMax > right) {
        errors.push(`La patrulla de ${label} sale de ${item.surfaceId}.`);
      }
    }
  };

  COLLECTION_RULES.forEach(([key]) => {
    (levelData[key] ?? []).forEach((item) => validateItem(item, `${key}:${item.id ?? item.x}`));
  });
  SINGLE_RULES.forEach(([key]) => {
    if (levelData[key]) validateItem(levelData[key], key);
  });

  return errors;
}
