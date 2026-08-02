import { useEffect, useMemo, useState } from 'react';
import { GameContainer } from './components/GameContainer.jsx';
import { HUD } from './components/HUD.jsx';
import { MainMenu } from './components/MainMenu.jsx';
import { PauseMenu } from './components/PauseMenu.jsx';
import { ResultScreen } from './components/ResultScreen.jsx';
import { eventBus } from './game/EventBus.js';
import { OBJECTIVES, OXYGEN, PLAYER, RECIPE } from './game/constants.js';

const initialSnapshot = Object.freeze({
  status: 'loading',
  health: PLAYER.maxHealth,
  maxHealth: PLAYER.maxHealth,
  oxygen: OXYGEN.max,
  maxOxygen: OXYGEN.max,
  yeastCollected: 0,
  yeastAvailable: 0,
  yeastRequired: RECIPE.yeastRequired,
  thermalBread: false,
  objective: OBJECTIVES.explore,
  prompt: '',
  elapsedMs: 0,
  enemiesDefeated: 0,
  lowOxygen: false,
});

export function App() {
  const [view, setView] = useState('menu');
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [settings, setSettings] = useState({ muted: false, screenShake: true, reducedParticles: false });

  useEffect(() => {
    const update = (next) => setSnapshot(next);
    const off = [
      eventBus.on('game:ready', update),
      eventBus.on('game:snapshot', update),
      eventBus.on('game:pause', update),
      eventBus.on('game:defeat', update),
      eventBus.on('game:complete', update),
      eventBus.on('game:error', (error) => console.error('[Juego]', error)),
    ];
    return () => off.forEach((unsubscribe) => unsubscribe());
  }, []);

  useEffect(() => {
    eventBus.emit('command:settings', settings);
  }, [settings]);

  const gameActive = view === 'game';
  const shellClass = useMemo(() => `app-shell ${gameActive ? 'is-playing' : 'is-menu'}`, [gameActive]);

  const startGame = () => {
    setSnapshot(initialSnapshot);
    setView('game');
  };

  const returnToMenu = () => {
    eventBus.emit('command:menu');
    setView('menu');
    setSnapshot(initialSnapshot);
  };

  const updateSettings = (patch) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  return (
    <main className={shellClass}>
      {view === 'menu' ? (
        <MainMenu
          onPlay={startGame}
          settings={settings}
          onSettingsChange={updateSettings}
        />
      ) : (
        <section className="game-screen" aria-label="La Panadería Hundida">
          <GameContainer settings={settings} />
          <HUD snapshot={snapshot} />
          {snapshot.status === 'loading' && (
            <div className="loading-badge" role="status">Sumergiendo la panadería…</div>
          )}
          {snapshot.status === 'paused' && (
            <PauseMenu
              settings={settings}
              onSettingsChange={updateSettings}
              onResume={() => eventBus.emit('command:resume')}
              onRestart={() => eventBus.emit('command:restart')}
              onMenu={returnToMenu}
            />
          )}
          {['defeat', 'complete'].includes(snapshot.status) && (
            <ResultScreen
              snapshot={snapshot}
              onRestart={() => eventBus.emit('command:restart')}
              onMenu={returnToMenu}
            />
          )}
          <p className="small-window-notice" role="status">
            Amplía la ventana para jugar con comodidad.
          </p>
        </section>
      )}
    </main>
  );
}
