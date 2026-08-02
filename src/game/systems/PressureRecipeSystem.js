export class PressureRecipeSystem {
  constructor(cost = 5, regulatorsRequired = 3) {
    this.cost = cost;
    this.regulatorsRequired = regulatorsRequired;
    this.reset();
  }

  reset() {
    this.completed = false;
    this.hasPressureBread = false;
  }

  canCraft(inventory, activeRegulators) {
    return !this.completed
      && activeRegulators >= this.regulatorsRequired
      && inventory.canSpend(this.cost);
  }

  craft(inventory, activeRegulators) {
    if (!this.canCraft(inventory, activeRegulators) || !inventory.spend(this.cost)) return false;
    this.completed = true;
    this.hasPressureBread = true;
    return true;
  }

  consumePressureBread() {
    if (!this.hasPressureBread) return false;
    this.hasPressureBread = false;
    return true;
  }

  restore({ completed = false, hasPressureBread = false } = {}) {
    this.completed = Boolean(completed);
    this.hasPressureBread = Boolean(hasPressureBread);
  }
}
