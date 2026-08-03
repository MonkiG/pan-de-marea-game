import { BaseLevelScene } from './BaseLevelScene.js';
import { Oven } from '../entities/Oven.js';
import { ThermalGate } from '../entities/ThermalGate.js';
import {
  LEVEL_IDS,
  OBJECTIVES,
  OXYGEN,
  RECIPE,
} from '../constants.js';
import { LEVEL_ONE_DATA } from '../data/levelOneData.js';
import { BACKGROUND_LAYOUTS } from '../art/backgroundLayout.js';

/**
 * Tutorial — La Panadería Hundida.
 * Curso guiado que introduce todas las mecánicas del juego menos el jefe.
 * Comparte el motor de {@link BaseLevelScene}; aquí sólo se declara su
 * configuración y la decoración temática de la panadería.
 */
export class LevelOneScene extends BaseLevelScene {
  constructor() {
    super(LEVEL_IDS.bakery);
  }

  getConfig() {
    return {
      levelId: LEVEL_IDS.bakery,
      levelName: 'La Panadería Hundida',
      data: LEVEL_ONE_DATA,
      oxygenConfig: OXYGEN,
      yeastRequired: LEVEL_ONE_DATA.requiredYeast ?? RECIPE.yeastRequired,
      regulatorsRequired: LEVEL_ONE_DATA.requiredRegulators ?? 0,
      bakeTimeMs: RECIPE.bakeTimeMs,
      breadName: 'Pan Térmico',
      breadKind: 'thermal',
      objectives: {
        explore: OBJECTIVES.explore,
        collect: OBJECTIVES.collect,
        regulators: OBJECTIVES.regulators,
        boss: undefined,
        oven: OBJECTIVES.oven,
        bake: OBJECTIVES.bake,
        exit: OBJECTIVES.gate,
        complete: OBJECTIVES.complete,
      },
      hasSentinel: false,
      music: 'level-one',
      audio: { oven: 'oven', exit: 'gate' },
      exitLockedPrompt: 'La compuerta necesita un Pan Térmico',
      exitOpenPrompt: 'El Nivel I está desbloqueado',
      lowOxygenHint: 'Oxígeno bajo: busca burbujas de recuperación',
      yeastRecovery: OXYGEN.yeastRecovery,
      stationRecovery: OXYGEN.ventRecovery,
      camera: { lerpX: 0.08, lerpY: 0.1, deadzoneX: 120, deadzoneY: 80, offsetX: -55, offsetY: 12 },
      background: {
        baseColor: 0x062731,
        overlayColor: 0x073744,
        layers: BACKGROUND_LAYOUTS.bakery,
        resolveTexture: (layer, scene) => (scene.textures.exists(layer.key) ? layer.key : null),
      },
    };
  }

  createOven() {
    return new Oven(this, this.levelData.oven);
  }

  createExit() {
    return new ThermalGate(this, this.levelData.gate);
  }

  /** La panadería decora con frames del tileset (rocas, coral), no con puestos. */
  createDecorations(texture) {
    if (texture !== 'tileset') return;
    (this.levelData.decorations ?? []).forEach((data) => {
      if (!data.frame || !this.textures.get(texture).has(data.frame)) return;
      const decoration = this.add.image(data.x, data.y, texture, data.frame)
        .setOrigin(0.5, 1)
        .setDepth(7)
        .setAlpha(0.88);
      decoration.setDisplaySize(data.width, data.height);
    });
  }
}
