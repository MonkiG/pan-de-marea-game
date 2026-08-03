import { describe, expect, it } from 'vitest';
import { InventorySystem } from './InventorySystem.js';
import { RecipeSystem } from './RecipeSystem.js';
import { SpecialBreadInventory } from './SpecialBreadInventory.js';
import { SpecialRecipeSystem } from './SpecialRecipeSystem.js';
import { SPECIAL_RECIPE_IDS } from '../data/recipeData.js';

const BAG = SPECIAL_RECIPE_IDS.baguetteTorpedo;
const mission = (cost, completed = false) => ({ cost, completed });

const withYeast = (amount) => {
  const inventory = new InventorySystem();
  inventory.collect(amount);
  return inventory;
};

describe('SpecialBreadInventory', () => {
  it('inicia en cero, se prepara una vez y usa munición infinita', () => {
    const inv = new SpecialBreadInventory();
    expect(inv.getCount(BAG)).toBe(0);
    expect(inv.selectedId).toBe(BAG);
    expect(inv.add(BAG, 2)).toBe(false); // maxStack 1
    expect(inv.add(BAG, 1)).toBe(true);
    expect(inv.add(BAG, 1)).toBe(false); // ya preparada
    expect(inv.getCount(BAG)).toBe(1);
    // Munición infinita: usar no descuenta existencias.
    expect(inv.use(BAG, 1000)).toBe(true);
    expect(inv.getCount(BAG)).toBe(1);

    const restored = new SpecialBreadInventory();
    restored.restore(inv.snapshot());
    expect(restored.getCount(BAG)).toBe(1);
    expect(restored.selectedId).toBe(BAG);
    expect(restored.canUse(BAG, 0)).toBe(true);
  });

  it('rechaza cantidades negativas, recetas desconocidas y bloqueadas', () => {
    const inv = new SpecialBreadInventory();
    expect(inv.add(BAG, -1)).toBe(false);
    expect(inv.add('desconocida', 1)).toBe(false);
    expect(inv.add(SPECIAL_RECIPE_IDS.futureOxygen, 1)).toBe(false);
    expect(inv.getCount(BAG)).toBe(0);
  });

  it('respeta el cooldown y no usa sin preparar', () => {
    const inv = new SpecialBreadInventory();
    expect(inv.canUse(BAG, 5000)).toBe(false);
    inv.add(BAG, 1);
    expect(inv.use(BAG, 1000)).toBe(true);
    expect(inv.canUse(BAG, 1100)).toBe(false);
    expect(inv.cooldownRemaining(BAG, 1100)).toBe(550);
    expect(inv.canUse(BAG, 1650)).toBe(true);
  });

  it('cycle con una sola receta desbloqueada mantiene la Baguette', () => {
    const inv = new SpecialBreadInventory();
    expect(inv.cycle(1)).toBe(BAG);
    expect(inv.cycle(-1)).toBe(BAG);
  });
});

describe('SpecialRecipeSystem', () => {
  it('nunca elabora recetas bloqueadas ni desconocidas y no gasta Levadura', () => {
    const sys = new SpecialRecipeSystem();
    const inv = withYeast(5);
    const sbi = new SpecialBreadInventory();
    expect(sys.canCraft(SPECIAL_RECIPE_IDS.futureOxygen, inv, mission(3), sbi)).toEqual({ ok: false, reason: 'locked' });
    expect(sys.canCraft('desconocida', inv, mission(3), sbi).reason).toBe('unknown');
    expect(sys.beginCraft(SPECIAL_RECIPE_IDS.futureOxygen, inv, mission(3), sbi)).toBe(false);
    expect(inv.availableYeast).toBe(5);
  });

  it('la Baguette infinita necesita 3 Levaduras disponibles e ignora la reserva', () => {
    const sys = new SpecialRecipeSystem();
    const sbi = new SpecialBreadInventory();
    // Con 2 Levaduras no alcanza el umbral.
    expect(sys.canCraft(BAG, withYeast(2), mission(3, false), sbi).reason).toBe('ingredients');
    // Con 3 alcanza aunque la misión aún no esté completada (no hay reserva).
    expect(sys.canCraft(BAG, withYeast(3), mission(3, false), sbi).ok).toBe(true);
  });

  it('preparar la Baguette no gasta Levadura y deja munición infinita', () => {
    const sys = new SpecialRecipeSystem();
    const inv = withYeast(4);
    const sbi = new SpecialBreadInventory();
    expect(sys.beginCraft(BAG, inv, mission(3, false), sbi)).toBe(true);
    expect(inv.availableYeast).toBe(4); // no consume
    expect(sys.completeCraft(BAG, sbi)).toBe(true);
    expect(sbi.getCount(BAG)).toBe(1);
    sbi.use(BAG, 1000);
    expect(sbi.getCount(BAG)).toBe(1); // sigue infinita
  });

  it('preparar la Baguette no impide después preparar el pan de misión', () => {
    const sys = new SpecialRecipeSystem();
    const inv = withYeast(3);
    const sbi = new SpecialBreadInventory();
    expect(sys.beginCraft(BAG, inv, { cost: 3, completed: false }, sbi)).toBe(true);
    expect(inv.availableYeast).toBe(3); // la Baguette no gastó Levadura
    const recipe = new RecipeSystem(3);
    expect(recipe.craft(inv)).toBe(true);
    expect(inv.availableYeast).toBe(0);
  });

  it('no vuelve a prepararse una vez lista', () => {
    const sys = new SpecialRecipeSystem();
    const sbi = new SpecialBreadInventory();
    sbi.add(BAG, 1);
    expect(sys.canCraft(BAG, withYeast(9), mission(3, true), sbi)).toEqual({ ok: false, reason: 'full' });
  });

  it('no reembolsa Levadura para recetas de munición infinita', () => {
    const sys = new SpecialRecipeSystem();
    const inv = withYeast(4);
    sys.beginCraft(BAG, inv, mission(3, false), new SpecialBreadInventory());
    expect(inv.availableYeast).toBe(4);
    sys.refund(BAG, inv);
    expect(inv.availableYeast).toBe(4);
    expect(inv.totalCollected).toBe(4);
  });
});
