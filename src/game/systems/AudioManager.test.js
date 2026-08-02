import { afterEach, describe, expect, it, vi } from 'vitest';
import { AUDIO_MANIFEST } from '../audio/audioManifest.js';
import { AudioManager } from './AudioManager.js';

const createScene = ({ loaded = true, playResult = true } = {}) => ({
  time: { now: 1000 },
  cache: { audio: { exists: vi.fn(() => loaded) } },
  sound: {
    mute: false,
    play: vi.fn(() => playResult),
    stopAll: vi.fn(),
  },
});

afterEach(() => vi.restoreAllMocks());

describe('AudioManager', () => {
  it('reproduce una clave registrada con su volumen', () => {
    const scene = createScene();
    const audio = new AudioManager(scene);
    expect(audio.play('jump')).toBe(true);
    expect(scene.sound.play).toHaveBeenCalledWith('sfx-jump', { volume: AUDIO_MANIFEST.jump.volume });
  });

  it('limita repeticiones según el cooldown', () => {
    const scene = createScene();
    const audio = new AudioManager(scene);
    expect(audio.play('attack')).toBe(true);
    scene.time.now += AUDIO_MANIFEST.attack.cooldownMs - 1;
    expect(audio.play('attack')).toBe(false);
    scene.time.now += 1;
    expect(audio.play('attack')).toBe(true);
    expect(scene.sound.play).toHaveBeenCalledTimes(2);
  });

  it('silencia, detiene y vuelve a permitir efectos', () => {
    const scene = createScene();
    const audio = new AudioManager(scene);
    audio.setMuted(true);
    expect(scene.sound.mute).toBe(true);
    expect(scene.sound.stopAll).toHaveBeenCalledOnce();
    expect(audio.play('hurt')).toBe(false);
    audio.setMuted(false);
    expect(scene.sound.mute).toBe(false);
    expect(audio.play('hurt')).toBe(true);
  });

  it('usa silencio seguro y advierte una sola vez si falta una clave', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    const scene = createScene();
    const audio = new AudioManager(scene);
    expect(audio.play('missing')).toBe(false);
    expect(audio.play('missing')).toBe(false);
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(scene.sound.play).not.toHaveBeenCalled();
  });

  it('usa silencio seguro si el archivo no se precargó', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    const scene = createScene({ loaded: false });
    const audio = new AudioManager(scene);
    expect(audio.play('checkpoint')).toBe(false);
    expect(console.info).toHaveBeenCalledOnce();
  });

  it('delega la limpieza y reinicia los cooldowns', () => {
    const scene = createScene();
    const audio = new AudioManager(scene);
    audio.play('jump');
    audio.stopAll();
    expect(scene.sound.stopAll).toHaveBeenCalledOnce();
    expect(audio.play('jump')).toBe(true);
  });
});

describe('AUDIO_MANIFEST', () => {
  it('declara exactamente los trece SFX del MVP con rutas únicas', () => {
    const entries = Object.values(AUDIO_MANIFEST);
    expect(entries).toHaveLength(13);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(13);
    expect(new Set(entries.map((entry) => entry.file)).size).toBe(13);
    entries.forEach((entry) => {
      expect(entry.file).toMatch(/^audio\/sfx\/[a-z-]+\.wav$/);
      expect(entry.volume).toBeGreaterThan(0);
      expect(entry.volume).toBeLessThanOrEqual(1);
      expect(entry.cooldownMs).toBeGreaterThan(0);
    });
  });
});
