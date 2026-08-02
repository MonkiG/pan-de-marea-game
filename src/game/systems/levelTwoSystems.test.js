import { afterEach, describe, expect, it, vi } from 'vitest';
import { LEVEL_TWO_DATA } from '../data/levelTwoData.js';
import { ASSET_REGISTRY } from '../assets/assetRegistry.js';
import { AssetResolver } from '../assets/AssetResolver.js';
import { createAssetAudit } from '../assets/assetAudit.js';
import { InventorySystem } from './InventorySystem.js';
import { CheckpointSystem } from './CheckpointSystem.js';
import { MarketProgressionSystem } from './MarketProgressionSystem.js';
import { PressureRecipeSystem } from './PressureRecipeSystem.js';
import { ProjectilePoolPolicy } from './ProjectilePoolPolicy.js';
import { SessionProgress } from './SessionProgress.js';

afterEach(() => vi.restoreAllMocks());

describe('assets del segundo nivel', () => {
  it('audita los trece archivos reales y los fallbacks registrados', () => {
    const audit = createAssetAudit();
    expect(audit.filesFound).toBe(13);
    expect(audit.usedLevelTwo).toBeGreaterThanOrEqual(10);
    expect(audit.fallbackRequired).toBeGreaterThanOrEqual(7);
    expect(Object.keys(ASSET_REGISTRY)).toHaveLength(audit.totalRegistered);
  });

  it('resuelve la textura real y cae a fallback una sola vez cuando falta', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const used = [];
    const textures = {
      exists: (key) => key === 'spitter-sheet',
      get: () => ({ has: (frame) => frame === 'spitter-idle-0' }),
    };
    const resolver = new AssetResolver(textures, (entry) => used.push(entry));
    expect(resolver.resolve('abyssalSpitter', 'fallback-spitter', ['spitter-idle-0'])).toBe('spitter-sheet');
    expect(resolver.resolve('marketExit', 'fallback-market-exit')).toBe('fallback-market-exit');
    expect(resolver.resolve('marketExit', 'fallback-market-exit')).toBe('fallback-market-exit');
    expect(resolver.getFallbacksUsed()).toEqual(['marketExit']);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(used).toHaveLength(2);
  });
});

describe('progresión del Mercado Sumergido', () => {
  it('mantiene la estructura de ocho zonas, siete levaduras y tres reguladores', () => {
    expect(LEVEL_TWO_DATA.worldWidth).toBe(7200);
    expect(LEVEL_TWO_DATA.zones).toHaveLength(8);
    expect(LEVEL_TWO_DATA.collectibles).toHaveLength(7);
    expect(LEVEL_TWO_DATA.regulators).toHaveLength(3);
    expect(LEVEL_TWO_DATA.spitters).toHaveLength(3);
    expect(LEVEL_TWO_DATA.sentinel.id).toBe('black-coral-sentinel');
  });

  it('acepta reguladores en cualquier orden y desbloquea la salida con pan', () => {
    const progression = new MarketProgressionSystem(3);
    expect(progression.activateRegulator('c')).toBe(true);
    expect(progression.activateRegulator('a')).toBe(true);
    expect(progression.activateRegulator('c')).toBe(false);
    expect(progression.activateRegulator('b')).toBe(true);
    expect(progression.allRegulatorsActive).toBe(true);
    expect(progression.canUnlockExit(false)).toBe(false);
    expect(progression.canUnlockExit(true)).toBe(true);
  });

  it('prepara Pan de Presión sólo con cinco levaduras y tres reguladores', () => {
    const inventory = new InventorySystem();
    inventory.collect(5);
    const recipe = new PressureRecipeSystem(5, 3);
    expect(recipe.craft(inventory, 2)).toBe(false);
    expect(recipe.craft(inventory, 3)).toBe(true);
    expect(inventory.availableYeast).toBe(0);
    expect(recipe.consumePressureBread()).toBe(true);
    expect(recipe.consumePressureBread()).toBe(false);
  });

  it('restaura un checkpoint mediante una copia aislada', () => {
    const checkpoints = new CheckpointSystem();
    const state = { spawn: { x: 12, y: 34 }, regulators: ['a'] };
    checkpoints.activate('market-square', state);
    state.spawn.x = 99;
    const snapshot = checkpoints.getSnapshot();
    expect(snapshot.state.spawn.x).toBe(12);
    snapshot.state.regulators.push('b');
    expect(checkpoints.getSnapshot().state.regulators).toEqual(['a']);
  });

  it('desbloquea el Mercado al completar la Panadería durante la sesión', () => {
    const progress = new SessionProgress();
    expect(progress.isUnlocked('level-two')).toBe(false);
    progress.completeLevel('level-one', { enemiesDefeated: 2 });
    expect(progress.isUnlocked('level-two')).toBe(true);
    expect(progress.getSnapshot().globalStats.enemiesDefeated).toBe(2);
  });

  it('limita y recicla la política del pool de proyectiles', () => {
    const pool = new ProjectilePoolPolicy(2);
    expect(pool.acquire('a')).toBe(true);
    expect(pool.acquire('b')).toBe(true);
    expect(pool.acquire('c')).toBe(false);
    expect(pool.release('a')).toBe(true);
    expect(pool.acquire('c')).toBe(true);
    expect(pool.activeCount).toBe(2);
  });
});
