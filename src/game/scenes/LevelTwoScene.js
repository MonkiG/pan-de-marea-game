import { BaseLevelScene } from './BaseLevelScene.js';
import { MarketExit } from '../entities/MarketExit.js';
import { PressureOven } from '../entities/PressureOven.js';
import {
  LEVEL_IDS,
  MARKET_OBJECTIVES,
  MARKET_OXYGEN,
  PRESSURE_RECIPE,
} from '../constants.js';
import { LEVEL_TWO_DATA } from '../data/levelTwoData.js';
import { BACKGROUND_LAYOUTS } from '../art/backgroundLayout.js';

/**
 * Nivel I — El Mercado Sumergido.
 * Escalada densa de todas las mecánicas del tutorial, con el jefe Sentinela
 * del Coral Negro como clímax. Toda la lógica vive en {@link BaseLevelScene};
 * aquí sólo se declara la configuración del nivel.
 */
export class LevelTwoScene extends BaseLevelScene {
  constructor() {
    super(LEVEL_IDS.market);
  }

  getConfig() {
    return {
      levelId: LEVEL_IDS.market,
      levelName: LEVEL_TWO_DATA.name,
      data: LEVEL_TWO_DATA,
      oxygenConfig: MARKET_OXYGEN,
      yeastRequired: LEVEL_TWO_DATA.requiredYeast ?? PRESSURE_RECIPE.yeastRequired,
      regulatorsRequired: LEVEL_TWO_DATA.requiredRegulators ?? PRESSURE_RECIPE.regulatorsRequired,
      bakeTimeMs: PRESSURE_RECIPE.bakeTimeMs,
      breadName: 'Pan de Presión',
      breadKind: 'pressure',
      objectives: {
        explore: MARKET_OBJECTIVES.explore,
        collect: MARKET_OBJECTIVES.collect,
        regulators: MARKET_OBJECTIVES.regulators,
        boss: MARKET_OBJECTIVES.sentinel,
        oven: MARKET_OBJECTIVES.oven,
        bake: MARKET_OBJECTIVES.bake,
        exit: MARKET_OBJECTIVES.exit,
        complete: MARKET_OBJECTIVES.complete,
      },
      hasSentinel: true,
      music: 'level-two',
      audio: { oven: 'pressure-oven', exit: 'market-exit' },
      ovenBlockedByBossPrompt: 'El guardián bloquea la estación',
      exitLockedPrompt: 'La salida necesita presión estable y el Pan de Presión',
      exitOpenPrompt: 'La presión abre la ruta al siguiente sector',
      lowOxygenHint: 'Oxígeno bajo: busca una estación azul',
      yeastRecovery: MARKET_OXYGEN.yeastRecovery,
      stationRecovery: MARKET_OXYGEN.stationRecovery,
      camera: { lerpX: 0.075, lerpY: 0.09, deadzoneX: 130, deadzoneY: 92, offsetX: -60, offsetY: 35 },
      background: {
        baseColor: 0x053943,
        overlayColor: 0x062c34,
        layers: BACKGROUND_LAYOUTS.market,
        resolveTexture: (layer, scene) => scene.assetResolver.resolve(layer.id, 'fallback-market-background'),
      },
    };
  }

  createOven() {
    return new PressureOven(this, this.levelData.pressureOven, this.assetResolver);
  }

  createExit() {
    return new MarketExit(this, this.levelData.exit, this.assetResolver);
  }
}
