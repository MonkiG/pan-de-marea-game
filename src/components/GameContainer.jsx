import { useEffect, useRef } from 'react';
import { eventBus } from '../game/EventBus.js';

export function GameContainer({ settings, initialLevel }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return undefined;
    let cancelled = false;
    import('../game/PhaserGame.js')
      .then(({ createPhaserGame }) => {
        if (cancelled || !containerRef.current) return;
        gameRef.current = createPhaserGame(containerRef.current, settings, initialLevel);
      })
      .catch((error) => eventBus.emit('game:error', error));
    return () => {
      cancelled = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="game-canvas" aria-label="Lienzo del videojuego" />;
}
