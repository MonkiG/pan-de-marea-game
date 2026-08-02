import { SettingsPanel } from './SettingsPanel.jsx';

export function PauseMenu({ settings, onSettingsChange, onResume, onRestart, onMenu }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Juego en pausa">
      <div className="overlay-card">
        <p className="eyebrow">El agua queda en suspenso</p>
        <h2>Pausa</h2>
        <div className="overlay-actions">
          <button className="primary-button" type="button" onClick={onResume} autoFocus>Reanudar</button>
          <button type="button" onClick={onRestart}>Reiniciar nivel</button>
          <button type="button" onClick={onMenu}>Volver al menú</button>
        </div>
        <SettingsPanel settings={settings} onChange={onSettingsChange} />
      </div>
    </div>
  );
}
