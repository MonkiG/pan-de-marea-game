import { AUDIO_MANIFEST } from '../audio/audioManifest.js';

export class AudioManager {
  constructor(scene, manifest = AUDIO_MANIFEST) {
    this.scene = scene;
    this.sound = scene?.sound ?? null;
    this.manifest = manifest;
    this.muted = false;
    this.warnedKeys = new Set();
    this.lastPlayedAt = new Map();
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.sound) this.sound.mute = this.muted;
    if (this.muted) this.stopAll();
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

  stopAll() {
    this.sound?.stopAll();
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
