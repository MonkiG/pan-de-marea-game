import { afterEach, describe, expect, it, vi } from 'vitest';
import { LEVEL_TWO_DATA } from '../data/levelTwoData.js';
import { createExpandedBounds } from './ActivationBounds.js';
import { ASSET_REGISTRY } from '../assets/assetRegistry.js';
import { AssetResolver } from '../assets/AssetResolver.js';
import { createAssetAudit } from '../assets/assetAudit.js';
import { InventorySystem } from './InventorySystem.js';
import { CheckpointSystem } from './CheckpointSystem.js';
import { MarketProgressionSystem } from './MarketProgressionSystem.js';
import { PressureRecipeSystem } from './PressureRecipeSystem.js';
import { ProjectilePoolPolicy } from './ProjectilePoolPolicy.js';
import { mergeProgressionSnapshots, SessionProgress } from './SessionProgress.js';
import { resolveLevelPlacements, validateLevelSupports } from './LevelSupportSystem.js';
import { PLAYER } from '../constants.js';
import { validateJumpLink } from './JumpReachSystem.js';

afterEach(() => vi.restoreAllMocks());

describe('assets del segundo nivel', () => {
  it('audita el inventario oficial sin assets faltantes', () => {
    const audit = createAssetAudit();
    expect(audit.filesFound).toBe(audit.totalRegistered);
    expect(audit.usedLevelTwo).toBeGreaterThanOrEqual(10);
    expect(audit.fallbackRequired).toBe(0);
    expect(audit.invalid).toBe(0);
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
  it('expande la zona de activación sin mutar el rectángulo interno de cámara', () => {
    const worldView = { x: 100, y: 40, width: 640, height: 360 };
    const expanded = createExpandedBounds(worldView, 180, 120);
    expect(expanded).toEqual({ x: -80, y: -80, width: 1000, height: 600 });
    expect(worldView).toEqual({ x: 100, y: 40, width: 640, height: 360 });
  });

  it('escala a diez zonas, ocho levaduras, cuatro reguladores y cinco escupemasas', () => {
    expect(LEVEL_TWO_DATA.worldWidth).toBe(9000);
    expect(LEVEL_TWO_DATA.zones).toHaveLength(10);
    expect(LEVEL_TWO_DATA.collectibles).toHaveLength(8);
    expect(LEVEL_TWO_DATA.regulators).toHaveLength(4);
    expect(LEVEL_TWO_DATA.spitters).toHaveLength(5);
    expect(LEVEL_TWO_DATA.requiredYeast).toBe(6);
    expect(LEVEL_TWO_DATA.requiredRegulators).toBe(4);
    expect(LEVEL_TWO_DATA.sentinel.id).toBe('black-coral-sentinel');
  });

  it('mantiene apoyados objetos, patrullas y estructuras del Nivel I', () => {
    expect(validateLevelSupports(LEVEL_TWO_DATA)).toEqual([]);
    const resolved = resolveLevelPlacements(LEVEL_TWO_DATA);
    expect(resolved.pressureOven.y).toBe(LEVEL_TWO_DATA.collision.floorTop);
    expect(resolved.exit.y).toBe(LEVEL_TWO_DATA.collision.floorTop);
    expect(resolved.collectibles.at(-1).y).toBe(LEVEL_TWO_DATA.collision.floorTop - 40);
    expect(LEVEL_TWO_DATA.platforms.every((platform) => ['stone', 'stall'].includes(platform.supportKind))).toBe(true);
  });

  it('mantiene todos los enlaces de plataformas dentro del margen seguro', () => {
    const platforms = new Map(LEVEL_TWO_DATA.platforms.map((platform) => [platform.id, platform]));
    LEVEL_TWO_DATA.jumpLinks.forEach((link) => {
      const result = validateJumpLink(platforms.get(link.from), platforms.get(link.to), PLAYER);
      expect(result.reachable, `${link.from} -> ${link.to}`).toBe(true);
    });
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

  it('conserva desbloqueos al sincronizar snapshots entre Phaser y React', () => {
    const merged = mergeProgressionSnapshots(
      { unlockedLevels: ['level-one'], completedLevels: [], globalStats: { enemiesDefeated: 0 } },
      { unlockedLevels: ['level-one', 'level-two'], completedLevels: ['level-one'], globalStats: { enemiesDefeated: 2 } },
    );
    expect(merged.unlockedLevels).toEqual(['level-one', 'level-two']);
    expect(merged.completedLevels).toEqual(['level-one']);
    expect(merged.globalStats.enemiesDefeated).toBe(2);
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
