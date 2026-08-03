export const STORAGE_KEYS = Object.freeze({
  settings: 'pan-de-marea:settings:v1',
  progress: 'pan-de-marea:progress:v1',
});

const storage = () => (typeof window === 'undefined' ? null : window.localStorage);

export const loadJSON = (key, fallback) => {
  try {
    const raw = storage()?.getItem(key);
    if (raw == null) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
};

export const saveJSON = (key, value) => {
  try {
    storage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Sin almacenamiento disponible (p. ej. tests node); se ignora.
  }
};
