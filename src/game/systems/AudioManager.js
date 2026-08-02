export class AudioManager {
  constructor() {
    this.muted = false;
    this.warnedKeys = new Set();
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
  }

  play(key) {
    if (this.muted) return;
    if (!this.warnedKeys.has(key)) {
      console.info(`[AudioManager] Sin audio para "${key}"; se usa silencio.`);
      this.warnedKeys.add(key);
    }
  }

  stopAll() {}
}
