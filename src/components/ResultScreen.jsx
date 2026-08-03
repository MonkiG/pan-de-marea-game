const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
};

export function ResultScreen({ snapshot, onRestart, onMenu, onContinue, onBakery }) {
  const won = snapshot.status === 'complete';
  const market = snapshot.levelId === 'level-two';
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={won ? 'Nivel completado' : 'Derrota'}>
      <div className={`overlay-card result-card ${won ? 'is-victory' : 'is-defeat'}`}>
        <p className="eyebrow">{won ? (market ? 'La presión vuelve a circular' : 'La llama familiar vuelve a arder') : 'Las mareas vencieron esta vez'}</p>
        <h2>{won ? (market ? 'Nivel I completado' : 'Tutorial completado') : 'Bigotes necesita otro intento'}</h2>
        <p>{won ? (market ? 'El Mercado Sumergido ha sido atravesado.' : 'El Nivel I ya está disponible.') : 'Respira, sacude las migas y vuelve al horno.'}</p>
        <dl className="results-grid">
          <div><dt>Tiempo</dt><dd>{formatTime(snapshot.elapsedMs)}</dd></div>
          <div><dt>Levaduras</dt><dd>{snapshot.yeastCollected}</dd></div>
          <div><dt>Enemigos</dt><dd>{snapshot.enemiesDefeated}</dd></div>
          {market && <div><dt>Daño recibido</dt><dd>{snapshot.damageTaken}</dd></div>}
          {market && <div><dt>Reguladores</dt><dd>{snapshot.regulatorsActive}/{snapshot.regulatorsRequired}</dd></div>}
          {market && <div><dt>Checkpoints</dt><dd>{snapshot.checkpointsUsed}</dd></div>}
        </dl>
        <div className="overlay-actions">
          {won && !market && <button className="primary-button" type="button" onClick={onContinue} autoFocus>Continuar al Nivel I</button>}
          <button className={won && !market ? '' : 'primary-button'} type="button" onClick={onRestart} autoFocus={!won || market}>Jugar de nuevo</button>
          {won && market && <button type="button" onClick={onBakery}>Repetir el Tutorial</button>}
          <button type="button" onClick={onMenu}>Volver al menú</button>
        </div>
      </div>
    </div>
  );
}
