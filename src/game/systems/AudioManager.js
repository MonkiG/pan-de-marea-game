import { AUDIO_MANIFEST } from '../audio/audioManifest.js';
import { MUSIC_MANIFEST } from '../audio/musicManifest.js';

export class AudioManager {
  constructor(scene, manifest = AUDIO_MANIFEST) {
    this.scene = scene;
    this.sound = scene?.sound ?? null;
    this.manifest = manifest;
    this.muted = false;
    this.warnedKeys = new Set();
    this.lastPlayedAt = new Map();
    this.musicSound = null;
    this.musicKey = null;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.sound) this.sound.mute = this.muted;
    if (this.muted) {
      this.stopAll();
    } else if (this.musicKey) {
      this.playMusic(this.musicKey);
    }
  }

  play(key) {
    if (this.muted) return false;
    const asset = this.manifest[key];
    if (!asset) return this.warnOnce(key, 'clave no registrada');
    if (!this.sound || !this.scene?.cache?.audio?.exists(asset.key)) {
      return this.warnOnce(key, 'archivo no disponible');
    }

    const now = this.scene?.time?.now ?? Date.now();
    const lastPlayedAt = this.lastPlayedAt.get(key) ?? -Infinity;
    if (now - lastPlayedAt < asset.cooldownMs) return false;

    try {
      const played = this.sound.play(asset.key, { volume: asset.volume });
      if (!played) return this.warnOnce(key, 'reproducción rechazada');
      this.lastPlayedAt.set(key, now);
      return true;
    } catch (error) {
      return this.warnOnce(key, error.message);
    }
  }

  playMusic(key, { loop = true } = {}) {
    if (this.muted) return false;
    const asset = MUSIC_MANIFEST[key];
    if (!asset) return this.warnOnce(key, 'clave de música no registrada');
    if (!this.sound || !this.scene?.cache?.audio?.exists(asset.key)) {
      return this.warnOnce(key, 'archivo de música no disponible');
    }
    this.stopMusic();
    const sound = this.sound.add(asset.key, { volume: asset.volume, loop });
    if (!sound) return this.warnOnce(key, 'reproducción rechazada');
    this.musicKey = key;
    this.musicSound = sound;
    return Boolean(sound.play());
  }

  stopMusic() {
    if (this.musicSound) this.musicSound.destroy();
    this.musicSound = null;
    this.musicKey = null;
  }

  stopAll() {
    this.sound?.stopAll();
    if (this.musicSound) this.musicSound.destroy();
    this.musicSound = null;
    this.lastPlayedAt.clear();
  }

  warnOnce(key, reason) {
    if (!this.warnedKeys.has(key)) {
      console.info(`[AudioManager] Sin audio para "${key}" (${reason}); se usa silencio.`);
      this.warnedKeys.add(key);
    }
    return false;
  }
}
