import { DEV_UNLOCK_ALL_LEVELS, LEVEL_IDS } from '../constants.js';

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
  }

  reset() {
    this.state = freshState();
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
