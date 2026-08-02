const clone = (value) => JSON.parse(JSON.stringify(value));

export class CheckpointSystem {
  constructor() {
    this.clear();
  }

  activate(id, snapshot) {
    if (!id) return false;
    this.checkpoint = { id, state: clone(snapshot) };
    return true;
  }

  clear() {
    this.checkpoint = null;
  }

  hasCheckpoint() {
    return Boolean(this.checkpoint);
  }

  getSnapshot() {
    return this.checkpoint ? clone(this.checkpoint) : null;
  }
}
