import { useEffect, useRef } from 'react';
import { eventBus } from '../game/EventBus.js';

const STARTUP_TIMEOUT_MS = 10_000;

export function GameContainer({ settings, initialLevel }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return undefined;
    let cancelled = false;
    let startupFinished = false;
    let startupTimer;
    const finishStartup = () => {
      startupFinished = true;
      window.clearTimeout(startupTimer);
    };
    const offReady = eventBus.on('game:ready', finishStartup);
    const offSnapshot = eventBus.on('game:snapshot', finishStartup);
    startupTimer = window.setTimeout(() => {
      if (!cancelled && !startupFinished) {
        eventBus.emit('game:error', new Error('El nivel no confirmó su inicialización a tiempo.'));
      }
    }, STARTUP_TIMEOUT_MS);

    import('../game/PhaserGame.js')
      .then(({ createPhaserGame }) => {
        if (cancelled || !containerRef.current) return;
        gameRef.current = createPhaserGame(containerRef.current, settings, initialLevel);
      })
      .catch((error) => {
        finishStartup();
        eventBus.emit('game:error', error);
      });
    return () => {
      cancelled = true;
      finishStartup();
      offReady();
      offSnapshot();
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="game-canvas" aria-label="Lienzo del videojuego" />;
}
