import { DEV_UNLOCK_ALL_LEVELS, LEVEL_IDS } from '../constants.js';
import { STORAGE_KEYS, loadJSON, saveJSON } from './Persistence.js';

const freshState = () => ({
  unlockedLevels: [LEVEL_IDS.bakery, ...(DEV_UNLOCK_ALL_LEVELS ? [LEVEL_IDS.market] : [])],
  completedLevels: [],
  globalStats: {
    elapsedMs: 0,
    enemiesDefeated: 0,
    damageTaken: 0,
    yeastCollected: 0,
  },
});

const hydrateState = (saved) => {
  const fallback = freshState();
  if (!saved || typeof saved !== 'object') return fallback;
  const validLevels = Object.values(LEVEL_IDS);
  return {
    unlockedLevels: Array.isArray(saved.unlockedLevels)
      ? saved.unlockedLevels.filter((id) => validLevels.includes(id))
      : fallback.unlockedLevels,
    completedLevels: Array.isArray(saved.completedLevels)
      ? saved.completedLevels.filter((id) => validLevels.includes(id))
      : fallback.completedLevels,
    globalStats: saved.globalStats && typeof saved.globalStats === 'object'
      ? { ...fallback.globalStats, ...saved.globalStats }
      : fallback.globalStats,
  };
};

export const mergeProgressionSnapshots = (current = freshState(), incoming = freshState()) => {
  const currentStats = current.globalStats ?? {};
  const incomingStats = incoming.globalStats ?? {};
  const statKeys = new Set([...Object.keys(currentStats), ...Object.keys(incomingStats)]);
  return {
    unlockedLevels: [...new Set([...(current.unlockedLevels ?? []), ...(incoming.unlockedLevels ?? [])])],
    completedLevels: [...new Set([...(current.completedLevels ?? []), ...(incoming.completedLevels ?? [])])],
    globalStats: Object.fromEntries([...statKeys].map((key) => [
      key,
      Math.max(Number(currentStats[key]) || 0, Number(incomingStats[key]) || 0),
    ])),
  };
};

export class SessionProgress {
  constructor() {
    this.reset();
    this.state = hydrateState(loadJSON(STORAGE_KEYS.progress, this.state));
  }

  reset() {
    this.state = freshState();
  }

  persist() {
    saveJSON(STORAGE_KEYS.progress, this.getSnapshot());
  }

  isUnlocked(levelId) {
    return DEV_UNLOCK_ALL_LEVELS || this.state.unlockedLevels.includes(levelId);
  }

  completeLevel(levelId, stats = {}) {
    if (!this.state.completedLevels.includes(levelId)) this.state.completedLevels.push(levelId);
    if (levelId === LEVEL_IDS.bakery && !this.state.unlockedLevels.includes(LEVEL_IDS.market)) {
      this.state.unlockedLevels.push(LEVEL_IDS.market);
    }
    Object.keys(this.state.globalStats).forEach((key) => {
      this.state.globalStats[key] += Math.max(0, Number(stats[key]) || 0);
    });
    this.persist();
    return this.getSnapshot();
  }

  getSnapshot() {
    return {
      unlockedLevels: [...this.state.unlockedLevels],
      completedLevels: [...this.state.completedLevels],
      globalStats: { ...this.state.globalStats },
    };
  }
}

export const sessionProgress = new SessionProgress();
