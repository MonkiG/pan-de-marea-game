import { ASSET_REGISTRY } from './assetRegistry.js';

export class AssetResolver {
  constructor(textureManager, onFallback = null) {
    this.textures = textureManager;
    this.onFallback = onFallback;
    this.warned = new Set();
    this.fallbacksUsed = new Set();
  }

  resolve(assetId, fallbackOverride, requiredFrames = []) {
    const definition = ASSET_REGISTRY[assetId];
    const fallback = fallbackOverride || definition?.fallback;
    const textureKey = definition?.key;
    const exists = Boolean(textureKey && this.textures?.exists(textureKey));
    const texture = exists ? this.textures.get(textureKey) : null;
    const framesValid = requiredFrames.every((frame) => texture?.has(frame));
    if (exists && framesValid) return textureKey;

    const reason = !definition
      ? 'no está registrado'
      : !exists
        ? 'no se cargó'
        : `no contiene los frames requeridos: ${requiredFrames.join(', ')}`;
    this.useFallback(assetId, fallback, reason);
    return fallback;
  }

  useFallback(assetId, fallback, reason = 'asset ausente') {
    this.fallbacksUsed.add(assetId);
    this.onFallback?.({ assetId, fallback, reason });
    if (this.warned.has(assetId)) return;
    this.warned.add(assetId);
    console.warn(`[AssetResolver] "${assetId}" ${reason}. Fallback utilizado: "${fallback}".`);
  }

  getFallbacksUsed() {
    return [...this.fallbacksUsed];
  }
}
