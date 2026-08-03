import { describe, expect, it, vi } from 'vitest';
import { initializeGameRegistry, resolveInitialLevel } from './startup.js';

describe('arranque de niveles', () => {
  it('escribe el nivel y los ajustes antes de iniciar las escenas', () => {
    const set = vi.fn();
    const settings = { muted: true };

    expect(initializeGameRegistry({ registry: { set } }, settings, 'level-two')).toBe('level-two');
    expect(set.mock.calls).toEqual([
      ['settings', settings],
      ['selectedLevel', 'level-two'],
      ['currentLevel', 'level-two'],
    ]);
  });

  it('usa el Tutorial cuando recibe un id inválido', () => {
    expect(resolveInitialLevel('nivel-inexistente')).toBe('level-one');
  });
});
