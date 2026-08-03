import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS, loadJSON, saveJSON } from './Persistence.js';

const createStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    store,
  };
};

let localStorage;
beforeEach(() => {
  localStorage = createStorage();
  global.window = { localStorage };
});
afterEach(() => {
  delete global.window;
});

describe('Persistence', () => {
  it('guarda y recupera un valor en localStorage', () => {
    saveJSON(STORAGE_KEYS.settings, { musicMuted: true, screenShake: false });
    expect(loadJSON(STORAGE_KEYS.settings, {})).toEqual({ musicMuted: true, screenShake: false });
  });

  it('fusiona el valor guardado sobre el fallback', () => {
    saveJSON(STORAGE_KEYS.settings, { musicMuted: true });
    expect(loadJSON(STORAGE_KEYS.settings, { musicMuted: false, sfxMuted: true })).toEqual({
      musicMuted: true,
      sfxMuted: true,
    });
  });

  it('devuelve el fallback si no hay nada guardado', () => {
    expect(loadJSON(STORAGE_KEYS.progress, { unlockedLevels: [] })).toEqual({ unlockedLevels: [] });
  });

  it('devuelve el fallback si el JSON guardado está corrupto', () => {
    localStorage.store.set(STORAGE_KEYS.settings, '{no-es-json');
    expect(loadJSON(STORAGE_KEYS.settings, { screenShake: true })).toEqual({ screenShake: true });
  });
});
