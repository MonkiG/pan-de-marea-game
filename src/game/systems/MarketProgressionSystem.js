export class MarketProgressionSystem {
  constructor(requiredRegulators = 3) {
    this.requiredRegulators = requiredRegulators;
    this.reset();
  }

  reset() {
    this.activeRegulators = new Set();
  }

  activateRegulator(id) {
    if (!id || this.activeRegulators.has(id)) return false;
    this.activeRegulators.add(id);
    return true;
  }

  restore(ids = []) {
    this.activeRegulators = new Set(ids);
  }

  get activeCount() {
    return this.activeRegulators.size;
  }

  get allRegulatorsActive() {
    return this.activeCount >= this.requiredRegulators;
  }

  canUnlockExit(hasPressureBread) {
    return this.allRegulatorsActive && Boolean(hasPressureBread);
  }

  getSnapshot() {
    return {
      activeRegulatorIds: [...this.activeRegulators],
      activeCount: this.activeCount,
      required: this.requiredRegulators,
    };
  }
}
