import { ASSET_REGISTRY } from './assetRegistry.js';

export function createAssetAudit(registry = ASSET_REGISTRY) {
  const assets = Object.entries(registry);
  const count = (predicate) => assets.filter(([, asset]) => predicate(asset)).length;
  return {
    totalRegistered: assets.length,
    filesFound: count((asset) => Boolean(asset.path)),
    usedLevelOne: count((asset) => asset.usedIn?.includes('level-one')),
    usedLevelTwo: count((asset) => asset.usedIn?.includes('level-two')),
    shared: count((asset) => asset.status === 'shared'),
    fallbackRequired: count((asset) => asset.status === 'fallback-required'),
    invalid: count((asset) => asset.status === 'invalid'),
  };
}

export function logAssetAudit(registry = ASSET_REGISTRY) {
  const audit = createAssetAudit(registry);
  console.info([
    '[Asset Audit]',
    `Registrados: ${audit.totalRegistered}`,
    `Archivos encontrados: ${audit.filesFound}`,
    `Usados en Nivel 1: ${audit.usedLevelOne}`,
    `Usados en Nivel 2: ${audit.usedLevelTwo}`,
    `Compartidos: ${audit.shared}`,
    `Faltantes con fallback: ${audit.fallbackRequired}`,
    `Inválidos: ${audit.invalid}`,
  ].join('\n'));
  return audit;
}
