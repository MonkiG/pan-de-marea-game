import { RECIPE } from '../constants.js';

export class RecipeSystem {
  constructor(cost = RECIPE.yeastRequired) {
    this.cost = cost;
    this.reset();
  }

  reset() {
    this.hasThermalBread = false;
    this.completed = false;
  }

  canCraft(inventory) {
    return !this.completed && inventory.canSpend(this.cost);
  }

  craft(inventory) {
    if (!this.canCraft(inventory) || !inventory.spend(this.cost)) return false;
    this.completed = true;
    this.hasThermalBread = true;
    return true;
  }

  consumeThermalBread() {
    if (!this.hasThermalBread) return false;
    this.hasThermalBread = false;
    return true;
  }
}

export const canUnlockGate = (hasThermalBread) => Boolean(hasThermalBread);
