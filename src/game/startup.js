const FALLBACK_LEVEL = 'level-one';
const LEVEL_IDS = new Set(['level-one', 'level-two']);

export const resolveInitialLevel = (levelId) => (
  LEVEL_IDS.has(levelId) ? levelId : FALLBACK_LEVEL
);

export function initializeGameRegistry(game, initialSettings = {}, initialLevel = FALLBACK_LEVEL) {
  const levelId = resolveInitialLevel(initialLevel);
  game.registry.set('settings', initialSettings);
  game.registry.set('selectedLevel', levelId);
  game.registry.set('currentLevel', levelId);
  return levelId;
}
