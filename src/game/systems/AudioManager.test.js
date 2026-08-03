import { afterEach, describe, expect, it, vi } from 'vitest';
import { AUDIO_MANIFEST } from '../audio/audioManifest.js';
import { MUSIC_MANIFEST } from '../audio/musicManifest.js';
import { AudioManager } from './AudioManager.js';

const createScene = ({ loaded = true, playResult = true } = {}) => ({
  time: { now: 1000 },
  cache: { audio: { exists: vi.fn(() => loaded) } },
  sound: {
    mute: false,
    play: vi.fn(() => playResult),
    stopAll: vi.fn(),
    getAll: vi.fn(() => []),
  },
});

const createMusicScene = () => {
  const sounds = [];
  const scene = createScene();
  scene.sound.add = vi.fn(() => {
    const sound = {
      play: vi.fn(() => true),
      stop: vi.fn(),
      destroy: vi.fn(),
    };
    sounds.push(sound);
    return sound;
  });
  return { scene, sounds };
};

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

  it('silencia los efectos y vuelve a permitirlos', () => {
    const scene = createScene();
    const audio = new AudioManager(scene);
    audio.setSfxMuted(true);
    expect(audio.play('hurt')).toBe(false);
    audio.setSfxMuted(false);
    expect(audio.play('hurt')).toBe(true);
  });

  it('al silenciar efectos detiene los SFX activos pero conserva la música', () => {
    const scene = createScene();
    const sfxSound = { stop: vi.fn(), destroy: vi.fn() };
    scene.sound.getAll = vi.fn(() => [sfxSound]);
    scene.sound.add = vi.fn(() => {
      const sound = { play: vi.fn(() => true), stop: vi.fn(), destroy: vi.fn() };
      return sound;
    });
    const audio = new AudioManager(scene);
    expect(audio.playMusic('main')).toBe(true);
    audio.setSfxMuted(true);
    expect(sfxSound.stop).toHaveBeenCalledOnce();
    expect(scene.sound.add.mock.results[0].value.destroy).not.toHaveBeenCalled();
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
  it('declara los SFX de la biblioteca con claves y rutas únicas', () => {
    const entries = Object.values(AUDIO_MANIFEST);
    expect(entries.length).toBeGreaterThanOrEqual(13);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
    expect(new Set(entries.map((entry) => entry.file)).size).toBe(entries.length);
    entries.forEach((entry) => {
      expect(entry.file).toMatch(/^audio\/sfx\/[a-z-]+\.wav$/);
      expect(entry.volume).toBeGreaterThan(0);
      expect(entry.volume).toBeLessThanOrEqual(1);
      expect(entry.cooldownMs).toBeGreaterThan(0);
    });
  });
});

describe('AudioManager música', () => {
  it('reproduce una pista en loop con su volumen y permite detenerla', () => {
    const { scene, sounds } = createMusicScene();
    const audio = new AudioManager(scene);
    expect(audio.playMusic('main')).toBe(true);
    expect(scene.sound.add).toHaveBeenCalledWith(MUSIC_MANIFEST.main.key, {
      volume: MUSIC_MANIFEST.main.volume,
      loop: true,
    });
    expect(sounds[0].play).toHaveBeenCalledOnce();
    audio.stopMusic();
    expect(sounds[0].destroy).toHaveBeenCalledOnce();
    expect(audio.musicKey).toBeNull();
  });

  it('detiene la pista anterior al cambiar de tema', () => {
    const { scene, sounds } = createMusicScene();
    const audio = new AudioManager(scene);
    audio.playMusic('level-one');
    const previous = sounds[sounds.length - 1];
    audio.playMusic('level-two');
    expect(previous.destroy).toHaveBeenCalledOnce();
    expect(audio.musicKey).toBe('level-two');
  });

  it('no reproduce música silenciada y usa silencio seguro si falta el archivo', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    const { scene } = createMusicScene();
    const audio = new AudioManager(scene);
    audio.setMusicMuted(true);
    expect(audio.playMusic('main')).toBe(false);
    expect(scene.sound.add).not.toHaveBeenCalled();
  });

  it('reanuda la pista activa al desmutear la música', () => {
    const { scene } = createMusicScene();
    const audio = new AudioManager(scene);
    audio.playMusic('main');
    audio.setMusicMuted(true);
    audio.setMusicMuted(false);
    expect(scene.sound.add).toHaveBeenLastCalledWith(MUSIC_MANIFEST.main.key, expect.any(Object));
  });

  it('mantiene independientes los mutes de música y efectos', () => {
    const { scene, sounds } = createMusicScene();
    const audio = new AudioManager(scene);
    audio.play('jump');
    expect(audio.playMusic('main')).toBe(true);
    audio.setSfxMuted(true);
    expect(audio.play('jump')).toBe(false);
    expect(audio.playMusic('level-two')).toBe(true);
    audio.setSfxMuted(false);
    audio.setMusicMuted(true);
    expect(audio.playMusic('main')).toBe(false);
    scene.time.now += 100;
    expect(audio.play('jump')).toBe(true);
    expect(sounds).toHaveLength(2);
  });

  it('advierte una sola vez si la clave de música no está registrada', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    const { scene } = createMusicScene();
    const audio = new AudioManager(scene);
    expect(audio.playMusic('missing')).toBe(false);
    expect(audio.playMusic('missing')).toBe(false);
    expect(console.info).toHaveBeenCalledTimes(1);
  });
});
