import { SPECIAL_BREAD_RECIPES, SPECIAL_RECIPE_ORDER } from '../data/recipeData.js';

/**
 * Construye la parte del snapshot que consume el menú de recetas de React.
 * Puro: sólo lee sistemas, no toca Phaser. `mission` es un descriptor
 * normalizado que aporta cada escena ({id, name, cost, completed, canCraft,
 * requirements}); también sirve de `missionRecipe` para la reserva de Levadura.
 */
export function buildRecipeMenuSnapshot({
  open,
  inventory,
  mission,
  specialRecipe,
  specialInventory,
  feedback = null,
  recipes = SPECIAL_BREAD_RECIPES,
  order = SPECIAL_RECIPE_ORDER,
}) {
  const reserved = specialRecipe.getReserve(mission);
  const spendable = specialRecipe.getSpendableYeast(inventory, mission);
  const specials = order.map((id) => {
    const recipe = recipes[id];
    const { ok, reason } = specialRecipe.canCraft(id, inventory, mission, specialInventory);
    return {
      id,
      name: recipe.name,
      description: recipe.description,
      icon: recipe.icon,
      unlocked: recipe.unlocked,
      infinite: Boolean(recipe.infinite),
      cost: recipe.cost,
      count: specialInventory.getCount(id),
      maxStack: recipe.maxStack,
      canCraft: ok,
      reason,
    };
  });
  return {
    open,
    ingredients: {
      available: inventory.availableYeast,
      reserved,
      spendable,
    },
    mission: {
      id: mission.id,
      name: mission.name,
      cost: mission.cost,
      canCraft: mission.canCraft,
      completed: mission.completed,
      requirements: mission.requirements,
    },
    specials,
    feedback,
  };
}

/** Construye la barra de panes especiales del HUD durante el juego. */
export function buildSpecialBreadSnapshot({
  specialInventory,
  now,
  unavailablePulse = false,
  recipes = SPECIAL_BREAD_RECIPES,
  order = SPECIAL_RECIPE_ORDER,
}) {
  const slots = order.map((id) => ({
    id,
    icon: recipes[id].icon,
    unlocked: recipes[id].unlocked,
    infinite: Boolean(recipes[id].infinite),
    count: specialInventory.getCount(id),
  }));
  return {
    selectedId: specialInventory.selectedId,
    slots,
    cooldownRemainingMs: specialInventory.cooldownRemaining(specialInventory.selectedId, now),
    unavailablePulse: Boolean(unavailablePulse),
    shieldActive: false,
  };
}
