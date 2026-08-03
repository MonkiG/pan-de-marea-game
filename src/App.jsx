import { useEffect, useMemo, useState } from 'react';
import { GameContainer } from './components/GameContainer.jsx';
import { HUD } from './components/HUD.jsx';
import { LevelSelectScreen } from './components/LevelSelectScreen.jsx';
import { MainMenu } from './components/MainMenu.jsx';
import { MenuMusic } from './components/MenuMusic.jsx';
import { NonGameLinks } from './components/NonGameLinks.jsx';
import { PauseMenu } from './components/PauseMenu.jsx';
import { RecipeMenu } from './components/RecipeMenu.jsx';
import { ResultScreen } from './components/ResultScreen.jsx';
import { eventBus } from './game/EventBus.js';
import { OBJECTIVES, OXYGEN, PLAYER, RECIPE } from './game/constants.js';
import { mergeProgressionSnapshots, sessionProgress } from './game/systems/SessionProgress.js';
import { getLevelDefinition } from './game/data/levelCatalog.js';

const initialSnapshot = Object.freeze({
  status: 'loading',
  levelId: 'level-one',
  levelName: 'La Panadería Hundida',
  health: PLAYER.maxHealth,
  maxHealth: PLAYER.maxHealth,
  oxygen: OXYGEN.max,
  maxOxygen: OXYGEN.max,
  yeastCollected: 0,
  yeastAvailable: 0,
  yeastRequired: RECIPE.yeastRequired,
  thermalBread: false,
  pressureBread: false,
  breadReady: false,
  breadName: 'Pan Térmico',
  regulatorsActive: 0,
  regulatorsRequired: 0,
  checkpointActive: false,
  objective: OBJECTIVES.explore,
  prompt: '',
  elapsedMs: 0,
  enemiesDefeated: 0,
  lowOxygen: false,
  damageTaken: 0,
  checkpointsUsed: 0,
  fallbacksUsed: [],
});

const artReviewAsset = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get('art-review')
  : null;
const artReviewMode = ['bigotes', 'rastrero', 'escupemasas', 'sentinela'].includes(artReviewAsset);
const requestedReviewLevel = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get('review-level')
  : null;
const initialSelectedLevel = ['level-one', 'level-two'].includes(requestedReviewLevel)
  ? requestedReviewLevel
  : 'level-one';

export function App() {
  const [view, setView] = useState(artReviewMode ? 'game' : 'menu');
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [settings, setSettings] = useState({ muted: false, screenShake: true, reducedParticles: false });
  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel);
  const [progression, setProgression] = useState(() => sessionProgress.getSnapshot());
  const [gameError, setGameError] = useState('');
  const [gameRunId, setGameRunId] = useState(0);

  useEffect(() => {
    const update = (next) => {
      setGameError('');
      setSnapshot(next);
      if (next.progression) {
        setProgression((current) => mergeProgressionSnapshots(current, next.progression));
      }
    };
    const off = [
      eventBus.on('game:ready', update),
      eventBus.on('game:snapshot', update),
      eventBus.on('game:pause', update),
      eventBus.on('game:defeat', update),
      eventBus.on('game:complete', update),
      eventBus.on('game:error', (error) => {
        console.error('[Juego]', error);
        setGameError(error instanceof Error ? error.message : 'Error desconocido al iniciar el nivel.');
        setSnapshot((current) => ({ ...current, status: 'error' }));
      }),
    ];
    return () => off.forEach((unsubscribe) => unsubscribe());
  }, []);

  useEffect(() => {
    eventBus.emit('command:settings', settings);
  }, [settings]);

  const gameActive = view === 'game';
  const shellClass = useMemo(() => `app-shell ${gameActive ? 'is-playing' : 'is-menu'}`, [gameActive]);
  const menuMusicActive = !gameActive || ['complete', 'defeat'].includes(snapshot.status);

  const startGame = (levelId = selectedLevel) => {
    if (!progression.unlockedLevels.includes(levelId) && !sessionProgress.isUnlocked(levelId)) return;
    setSelectedLevel(levelId);
    setGameError('');
    setSnapshot({ ...initialSnapshot, levelId, levelName: getLevelDefinition(levelId).name });
    setView('game');
  };

  const changeLevel = (levelId) => {
    setSelectedLevel(levelId);
    setGameError('');
    setSnapshot({ ...initialSnapshot, levelId, levelName: getLevelDefinition(levelId).name });
    eventBus.emit('command:level', levelId);
  };

  const returnToMenu = () => {
    eventBus.emit('command:menu');
    setProgression((current) => mergeProgressionSnapshots(current, sessionProgress.getSnapshot()));
    setView('menu');
    setGameError('');
    setSnapshot(initialSnapshot);
  };

  const retryLevel = () => {
    setGameError('');
    setSnapshot({ ...initialSnapshot, levelId: selectedLevel, levelName: getLevelDefinition(selectedLevel).name });
    setGameRunId((current) => current + 1);
  };

  const updateSettings = (patch) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  return (
    <main className={shellClass}>
      {view === 'menu' ? (
        <MainMenu
          onOpenLevels={() => setView('levels')}
          settings={settings}
          onSettingsChange={updateSettings}
        />
      ) : view === 'levels' ? (
        <LevelSelectScreen
          selectedLevel={selectedLevel}
          progression={progression}
          onSelect={setSelectedLevel}
          onPlay={startGame}
          onBack={() => setView('menu')}
        />
      ) : (
        <section className="game-screen" aria-label={artReviewMode ? `Revisión de arte: ${artReviewAsset}` : snapshot.levelName}>
          <GameContainer key={gameRunId} settings={settings} initialLevel={selectedLevel} />
          {!artReviewMode && <HUD snapshot={snapshot} />}
          {!artReviewMode && snapshot.status === 'loading' && (
            <div className="loading-badge" role="status">Sumergiendo la panadería…</div>
          )}
          {!artReviewMode && snapshot.status === 'error' && (
            <div className="overlay" role="alertdialog" aria-modal="true" aria-label="No se pudo iniciar el nivel">
              <div className="overlay-card">
                <p className="eyebrow">La marea interrumpió el viaje</p>
                <h2>No se pudo iniciar el nivel</h2>
                <p>{gameError || 'El juego no pudo completar la carga.'}</p>
                <div className="overlay-actions">
                  <button className="primary-button" type="button" onClick={retryLevel} autoFocus>Reintentar</button>
                  <button type="button" onClick={returnToMenu}>Volver al menú</button>
                </div>
              </div>
            </div>
          )}
          {!artReviewMode && snapshot.recipeMenu?.open && (
            <RecipeMenu
              menu={snapshot.recipeMenu}
              onCraft={(recipeId) => eventBus.emit('command:recipe-craft', { recipeId })}
              onClose={() => eventBus.emit('command:recipe-close')}
            />
          )}
          {!artReviewMode && snapshot.status === 'paused' && (
            <PauseMenu
              settings={settings}
              onSettingsChange={updateSettings}
              onResume={() => eventBus.emit('command:resume')}
              onRestart={() => eventBus.emit('command:restart')}
              onMenu={returnToMenu}
            />
          )}
          {!artReviewMode && ['defeat', 'complete'].includes(snapshot.status) && (
            <ResultScreen
              snapshot={snapshot}
              onRestart={() => eventBus.emit('command:restart')}
              onMenu={returnToMenu}
              onContinue={() => changeLevel('level-two')}
              onBakery={() => changeLevel('level-one')}
            />
          )}
          {!artReviewMode && (
            <p className="small-window-notice" role="status">
              Amplía la ventana para jugar con comodidad.
            </p>
          )}
        </section>
      )}
      {!gameActive && <NonGameLinks />}
      <MenuMusic active={menuMusicActive} muted={settings.muted} />
    </main>
  );
}
