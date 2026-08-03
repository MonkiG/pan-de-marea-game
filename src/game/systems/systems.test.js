import { describe, expect, it } from 'vitest';
import { InventorySystem } from './InventorySystem.js';
import { OxygenSystem } from './OxygenSystem.js';
import { RecipeSystem, canUnlockGate } from './RecipeSystem.js';
import { applyDamage } from './CombatSystem.js';
import { PLAYER } from '../constants.js';
import { LEVEL_ONE_DATA } from '../data/levelOneData.js';
import { calculateJumpMetrics, validateJumpLink } from './JumpReachSystem.js';
import { resolveLevelPlacements, validateLevelSupports } from './LevelSupportSystem.js';

describe('sistemas de La Panadería Hundida', () => {
  it('mantiene total e inventario y permite gastar levaduras', () => {
    const inventory = new InventorySystem();
    inventory.collect(3);
    expect(inventory.totalCollected).toBe(3);
    expect(inventory.spend(2)).toBe(true);
    expect(inventory.availableYeast).toBe(1);
    expect(inventory.spend(2)).toBe(false);
  });

  it('consume oxígeno, recupera y genera daño sólo al agotarse', () => {
    const oxygen = new OxygenSystem({ max: 10, drainPerSecond: 10, zeroDamageIntervalMs: 1000 });
    expect(oxygen.tick(500).value).toBe(5);
    expect(oxygen.tick(500).damageCount).toBe(0);
    expect(oxygen.tick(1000).damageCount).toBe(1);
    expect(oxygen.recover(4)).toBe(4);
    expect(oxygen.tick(1000, false).value).toBe(4);
  });

  it('prepara una sola receta y habilita la compuerta', () => {
    const inventory = new InventorySystem();
    const recipe = new RecipeSystem(3);
    inventory.collect(2);
    expect(recipe.craft(inventory)).toBe(false);
    inventory.collect(1);
    expect(recipe.craft(inventory)).toBe(true);
    expect(inventory.availableYeast).toBe(0);
    expect(canUnlockGate(recipe.hasThermalBread)).toBe(true);
    expect(recipe.craft(inventory)).toBe(false);
    expect(recipe.consumeThermalBread()).toBe(true);
    expect(canUnlockGate(recipe.hasThermalBread)).toBe(false);
  });

  it('respeta invulnerabilidad y no baja de cero', () => {
    const first = applyDamage({ health: 3, invulnerableUntil: 0 }, 1, 100, 1000);
    expect(first.health).toBe(2);
    expect(first.applied).toBe(true);
    const ignored = applyDamage(first, 1, 500, 1000);
    expect(ignored.health).toBe(2);
    expect(ignored.applied).toBe(false);
    const fatal = applyDamage(ignored, 5, 1200, 1000);
    expect(fatal.health).toBe(0);
  });

  it('reinicia inventario, oxígeno y receta', () => {
    const inventory = new InventorySystem();
    const oxygen = new OxygenSystem();
    const recipe = new RecipeSystem(1);
    inventory.collect();
    recipe.craft(inventory);
    oxygen.tick(1000);
    inventory.reset();
    oxygen.reset();
    recipe.reset();
    expect(inventory.totalCollected).toBe(0);
    expect(oxygen.value).toBe(100);
    expect(recipe.hasThermalBread).toBe(false);
  });

  it('mantiene todos los enlaces de plataformas dentro del margen seguro', () => {
    const metrics = calculateJumpMetrics(PLAYER);
    expect(metrics.apexHeight).toBeGreaterThan(85);
    expect(metrics.maximumHorizontalReach).toBeGreaterThan(170);

    const platforms = new Map(LEVEL_ONE_DATA.platforms.map((platform) => [platform.id, platform]));
    LEVEL_ONE_DATA.jumpLinks.forEach((link) => {
      const result = validateJumpLink(platforms.get(link.from), platforms.get(link.to), PLAYER);
      expect(result.reachable, `${link.from} -> ${link.to}`).toBe(true);
    });
  });

  it('apoya todos los elementos del Tutorial y resuelve su altura desde la superficie', () => {
    expect(validateLevelSupports(LEVEL_ONE_DATA)).toEqual([]);
    const resolved = resolveLevelPlacements(LEVEL_ONE_DATA);
    expect(resolved.oven.y).toBe(LEVEL_ONE_DATA.collision.floorTop);
    expect(resolved.gate.y).toBe(LEVEL_ONE_DATA.collision.floorTop);
    expect(resolved.spitters[0].y).toBe(240);
    expect(resolved.collectibles[0].y).toBe(229);
    expect(LEVEL_ONE_DATA.platforms.every((platform) => platform.supportKind === 'stone')).toBe(true);
  });
});
