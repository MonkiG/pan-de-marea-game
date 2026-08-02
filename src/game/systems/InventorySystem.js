export class InventorySystem {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalCollected = 0;
    this.availableYeast = 0;
  }

  collect(amount = 1) {
    const safeAmount = Math.max(0, Number(amount) || 0);
    this.totalCollected += safeAmount;
    this.availableYeast += safeAmount;
    return this.availableYeast;
  }

  canSpend(amount) {
    return this.availableYeast >= Math.max(0, amount);
  }

  spend(amount) {
    const safeAmount = Math.max(0, Number(amount) || 0);
    if (!this.canSpend(safeAmount)) return false;
    this.availableYeast -= safeAmount;
    return true;
  }
}
