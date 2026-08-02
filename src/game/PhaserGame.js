import Phaser from 'phaser';
import { createGameConfig } from './config.js';
import { eventBus } from './EventBus.js';

export function createPhaserGame(parent, initialSettings, initialLevel = 'level-one') {
  if (!parent) throw new Error('[Phaser] Contenedor DOM inexistente.');
  const game = new Phaser.Game(createGameConfig(parent));
  const getScene = () => {
    const levelId = game.registry.get('currentLevel') || game.registry.get('selectedLevel') || initialLevel;
    return game.scene.getScene(levelId);
  };

  const unsubscribers = [
    eventBus.on('command:start', () => {
      const scene = getScene();
      if (scene?.status === 'paused') scene.resumeGame();
    }),
    eventBus.on('command:pause', () => getScene()?.pauseGame()),
    eventBus.on('command:resume', () => getScene()?.resumeGame()),
    eventBus.on('command:restart', () => getScene()?.restartGame()),
    eventBus.on('command:audio', (muted) => getScene()?.setMuted(muted)),
    eventBus.on('command:settings', (settings) => getScene()?.setSettings(settings)),
    eventBus.on('command:menu', () => getScene()?.returnToMenu()),
    eventBus.on('command:level', (levelId) => {
      const scene = getScene();
      if (!scene || !['level-one', 'level-two'].includes(levelId)) return;
      game.registry.set('selectedLevel', levelId);
      game.registry.set('currentLevel', levelId);
      scene.scene.start(levelId);
    }),
  ];

  game.registry.set('settings', initialSettings);
  game.registry.set('selectedLevel', initialLevel);
  game.registry.set('currentLevel', initialLevel);
  return {
    game,
    destroy() {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      if (!game.isDestroyed) game.destroy(true);
    },
  };
}
