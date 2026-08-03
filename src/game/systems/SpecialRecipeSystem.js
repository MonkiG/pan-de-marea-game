import { SPECIAL_BREAD_RECIPES } from '../data/recipeData.js';

/**
 * Reglas puras de elaboración de panes especiales.
 *
 * Aplica la reserva de Levadura de misión para que la Baguette nunca gaste los
 * ingredientes necesarios para abrir la salida del nivel:
 *   reserva = missionRecipe.completed ? 0 : missionRecipe.cost
 *   levadura_gastable = max(0, inventory.availableYeast - reserva)
 */
export class SpecialRecipeSystem {
  constructor(recipes = SPECIAL_BREAD_RECIPES) {
    this.recipes = recipes;
  }

  getReserve(missionRecipe) {
    if (!missionRecipe || missionRecipe.completed) return 0;
    return Math.max(0, Number(missionRecipe.cost) || 0);
  }

  getSpendableYeast(inventory, missionRecipe) {
    const available = Math.max(0, inventory?.availableYeast ?? 0);
    return Math.max(0, available - this.getReserve(missionRecipe));
  }

  /**
   * Levadura que cuenta para preparar una receta. Las recetas de munición
   * infinita usan un umbral sobre la Levadura recogida (no gastan), así que
   * miran el total disponible; el resto respeta la reserva de misión.
   */
  getCraftYeast(recipe, inventory, missionRecipe) {
    if (recipe.infinite) return Math.max(0, inventory?.availableYeast ?? 0);
    return this.getSpendableYeast(inventory, missionRecipe);
  }

  /** @returns {{ok: boolean, reason: null|'locked'|'unknown'|'ingredients'|'full'}} */
  canCraft(recipeId, inventory, missionRecipe, specialInventory) {
    const recipe = this.recipes[recipeId];
    if (!recipe) return { ok: false, reason: 'unknown' };
    if (!recipe.unlocked) return { ok: false, reason: 'locked' };
    if (specialInventory.getCount(recipeId) >= recipe.maxStack) return { ok: false, reason: 'full' };
    if (this.getCraftYeast(recipe, inventory, missionRecipe) < recipe.cost) return { ok: false, reason: 'ingredients' };
    return { ok: true, reason: null };
  }

  /**
   * Prepara la receta si es válida. Las recetas infinitas no gastan Levadura
   * (el coste es sólo un umbral); las normales consumen su coste de forma
   * atómica.
   */
  beginCraft(recipeId, inventory, missionRecipe, specialInventory) {
    const recipe = this.recipes[recipeId];
    if (!this.canCraft(recipeId, inventory, missionRecipe, specialInventory).ok) return false;
    if (recipe.infinite) return true;
    return inventory.spend(recipe.cost);
  }

  /** Añade exactamente una unidad de la receta elaborada. */
  completeCraft(recipeId, specialInventory) {
    return specialInventory.add(recipeId, 1);
  }

  /**
   * Reembolsa la Levadura si el horno no pudo iniciar tras el consumo.
   * Inverso exacto de `inventory.spend()`: repone `availableYeast` sin alterar
   * el total recogido que muestra el HUD.
   */
  refund(recipeId, inventory) {
    const recipe = this.recipes[recipeId];
    if (!recipe?.cost || recipe.infinite || !inventory) return;
    inventory.availableYeast += recipe.cost;
  }
}
