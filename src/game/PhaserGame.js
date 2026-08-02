import Phaser from 'phaser';
import { createGameConfig } from './config.js';
import { eventBus } from './EventBus.js';

export function createPhaserGame(parent, initialSettings) {
  if (!parent) throw new Error('[Phaser] Contenedor DOM inexistente.');
  const game = new Phaser.Game(createGameConfig(parent));
  const getScene = () => game.scene.getScene('level-one');

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
  ];

  game.registry.set('settings', initialSettings);
  return {
    game,
    destroy() {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      if (!game.isDestroyed) game.destroy(true);
    },
  };
}
