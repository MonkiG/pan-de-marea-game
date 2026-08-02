const LEVELS = [
  {
    id: 'level-one',
    number: 'Nivel I',
    name: 'La Panadería Hundida',
    description: 'Recupera el horno familiar, reúne tres Levaduras y prepara el Pan Térmico.',
    objective: 'La llama familiar',
    background: '/panaderia-undida-bg-1.png',
  },
  {
    id: 'level-two',
    number: 'Nivel II',
    name: 'El Mercado Sumergido',
    description: 'Estabiliza la presión del mercado y abre la salida con Pan de Presión.',
    objective: 'Las corrientes del mercado',
    background: '/mercado-undido-1.png',
  },
];

export function LevelSelectScreen({
  selectedLevel,
  progression,
  onSelect,
  onPlay,
  onBack,
}) {
  const selected = LEVELS.find((level) => level.id === selectedLevel) ?? LEVELS[0];

  return (
    <section className="level-menu" aria-labelledby="level-menu-title">
      <div className="level-menu-light" aria-hidden="true" />
      <header className="level-menu-header">
        <p className="eyebrow">Bitácora de Bigotes</p>
        <h1 id="level-menu-title">Selecciona un nivel</h1>
        <p>Elige el próximo lugar que recorrerás bajo las mareas.</p>
      </header>

      <div className="level-gallery" aria-label="Niveles disponibles">
        {LEVELS.map((level) => {
          const unlocked = progression.unlockedLevels.includes(level.id);
          const complete = progression.completedLevels.includes(level.id);
          const selectedCard = selectedLevel === level.id;
          return (
            <button
              className={`level-card ${selectedCard ? 'is-selected' : ''} ${unlocked ? 'is-unlocked' : 'is-locked'}`}
              style={{ '--level-background': `url(${level.background})` }}
              type="button"
              key={level.id}
              disabled={!unlocked}
              aria-pressed={selectedCard}
              aria-label={`${level.number}: ${level.name}. ${complete ? 'Completado' : unlocked ? 'Disponible' : 'Bloqueado'}`}
              onClick={() => onSelect(level.id)}
            >
              <span className="level-card-shade" aria-hidden="true" />
              <span className="level-card-number">{level.number}</span>
              <span className="level-card-copy">
                <small>{level.objective}</small>
                <strong>{level.name}</strong>
                <span>{unlocked ? level.description : 'Completa La Panadería Hundida para desbloquear este nivel.'}</span>
              </span>
              <span className="level-card-status">
                {complete ? '✓ Completado' : unlocked ? 'Disponible' : '🔒 Bloqueado'}
              </span>
            </button>
          );
        })}
      </div>

      <footer className="level-menu-actions">
        <button type="button" onClick={onBack}>Volver al menú</button>
        <div>
          <span>Destino seleccionado</span>
          <strong>{selected.name}</strong>
        </div>
        <button className="primary-button" type="button" onClick={() => onPlay(selected.id)}>
          Iniciar nivel
        </button>
      </footer>
    </section>
  );
}
