import { SPECIAL_BREAD_RECIPES, SPECIAL_RECIPE_ORDER } from '../data/recipeData.js';

const isPositiveInt = (value) => Number.isInteger(value) && value > 0;

/**
 * Inventario puro de panes especiales, independiente de Phaser.
 * Conserva cantidades por receta, la selección actual y el instante del último
 * uso (para el cooldown). No acepta cantidades negativas, recetas desconocidas
 * ni superar `maxStack`.
 */
export class SpecialBreadInventory {
  constructor(recipes = SPECIAL_BREAD_RECIPES, order = SPECIAL_RECIPE_ORDER) {
    this.recipes = recipes;
    this.order = order.filter((id) => recipes[id]);
    this.unlockedOrder = this.order.filter((id) => recipes[id]?.unlocked);
    this.reset();
  }

  reset() {
    this.counts = Object.fromEntries(this.order.map((id) => [id, 0]));
    this.selectedId = this.unlockedOrder[0] ?? null;
    this.lastUsedAt = -Infinity;
  }

  getCount(id) {
    return this.counts[id] ?? 0;
  }

  canAdd(id, amount = 1) {
    const recipe = this.recipes[id];
    if (!recipe || !recipe.unlocked || !isPositiveInt(amount)) return false;
    return this.getCount(id) + amount <= recipe.maxStack;
  }

  add(id, amount = 1) {
    if (!this.canAdd(id, amount)) return false;
    this.counts[id] += amount;
    return true;
  }

  isFull(id) {
    const recipe = this.recipes[id];
    if (!recipe) return true;
    return this.getCount(id) >= recipe.maxStack;
  }

  cooldownRemaining(id = this.selectedId, now = 0) {
    const recipe = this.recipes[id];
    if (!recipe?.unlocked) return 0;
    return Math.max(0, recipe.cooldownMs - (now - this.lastUsedAt));
  }

  canUse(id = this.selectedId, now = 0) {
    if (this.getCount(id) <= 0) return false;
    return this.cooldownRemaining(id, now) <= 0;
  }

  use(id = this.selectedId, now = 0) {
    if (!this.canUse(id, now)) return false;
    // La munición infinita no descuenta existencias; sólo aplica el cooldown.
    if (!this.recipes[id]?.infinite) this.counts[id] -= 1;
    this.lastUsedAt = now;
    return true;
  }

  cycle(direction = 1) {
    if (this.unlockedOrder.length <= 1) return this.selectedId;
    const current = this.unlockedOrder.indexOf(this.selectedId);
    const step = direction < 0 ? -1 : 1;
    const next = (current + step + this.unlockedOrder.length) % this.unlockedOrder.length;
    this.selectedId = this.unlockedOrder[next];
    return this.selectedId;
  }

  snapshot() {
    return { counts: { ...this.counts }, selectedId: this.selectedId };
  }

  restore(snapshot = {}) {
    this.reset();
    const counts = snapshot.counts ?? {};
    this.order.forEach((id) => {
      const value = Number(counts[id]);
      if (Number.isInteger(value) && value >= 0) {
        this.counts[id] = Math.min(value, this.recipes[id].maxStack ?? 0);
      }
    });
    if (snapshot.selectedId && this.unlockedOrder.includes(snapshot.selectedId)) {
      this.selectedId = snapshot.selectedId;
    }
    // El cooldown no se conserva entre reinicios: se permite usar de inmediato.
    this.lastUsedAt = -Infinity;
  }
}
