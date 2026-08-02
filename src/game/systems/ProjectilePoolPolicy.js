export class ProjectilePoolPolicy {
  constructor(capacity = 12) {
    this.capacity = Math.max(1, capacity);
    this.active = new Set();
  }

  acquire(id) {
    if (!id || this.active.has(id) || this.active.size >= this.capacity) return false;
    this.active.add(id);
    return true;
  }

  release(id) {
    return this.active.delete(id);
  }

  reset() {
    this.active.clear();
  }

  get activeCount() {
    return this.active.size;
  }
}
