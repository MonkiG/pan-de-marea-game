const percentage = (value, max) => `${Math.max(0, Math.min(100, (value / max) * 100))}%`;

export function HUD({ snapshot }) {
  return (
    <div className="hud" aria-live="polite">
      <div className="hud-vitals">
        <div className="meter-row">
          <span>Salud</span>
          <div className="meter"><i className="health-fill" style={{ width: percentage(snapshot.health, snapshot.maxHealth) }} /></div>
          <b>{snapshot.health}/{snapshot.maxHealth}</b>
        </div>
        <div className={`meter-row ${snapshot.lowOxygen ? 'is-warning' : ''}`}>
          <span>Oxígeno</span>
          <div className="meter"><i className="oxygen-fill" style={{ width: percentage(snapshot.oxygen, snapshot.maxOxygen) }} /></div>
          <b>{snapshot.oxygen}</b>
        </div>
      </div>
      <div className="hud-objective">
        <span>Objetivo</span>
        <strong>{snapshot.objective}</strong>
        {snapshot.prompt && <p>{snapshot.prompt}</p>}
      </div>
      <div className="hud-inventory">
        <span className="yeast-icon" aria-hidden="true" />
        <b>{snapshot.yeastCollected}/{snapshot.yeastRequired}</b>
        <span className={snapshot.thermalBread ? 'bread ready' : 'bread'}>
          {snapshot.thermalBread ? 'Pan Térmico listo' : 'Sin Pan Térmico'}
        </span>
      </div>
    </div>
  );
}
