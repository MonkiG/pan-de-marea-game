const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
};

export function ResultScreen({ snapshot, onRestart, onMenu }) {
  const won = snapshot.status === 'complete';
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={won ? 'Nivel completado' : 'Derrota'}>
      <div className={`overlay-card result-card ${won ? 'is-victory' : 'is-defeat'}`}>
        <p className="eyebrow">{won ? 'La llama familiar vuelve a arder' : 'Las mareas vencieron esta vez'}</p>
        <h2>{won ? 'Nivel completado' : 'Bigotes necesita otro intento'}</h2>
        <p>{won ? 'La ruta al Mercado Sumergido está abierta.' : 'Respira, sacude las migas y vuelve al horno.'}</p>
        <dl className="results-grid">
          <div><dt>Tiempo</dt><dd>{formatTime(snapshot.elapsedMs)}</dd></div>
          <div><dt>Levaduras</dt><dd>{snapshot.yeastCollected}</dd></div>
          <div><dt>Rastreros</dt><dd>{snapshot.enemiesDefeated}</dd></div>
        </dl>
        <div className="overlay-actions">
          <button className="primary-button" type="button" onClick={onRestart} autoFocus>Jugar de nuevo</button>
          <button type="button" onClick={onMenu}>Volver al menú</button>
        </div>
      </div>
    </div>
  );
}
