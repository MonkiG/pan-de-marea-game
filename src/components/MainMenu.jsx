import { useState } from 'react';
import { ControlsPanel } from './ControlsPanel.jsx';
import { SettingsPanel } from './SettingsPanel.jsx';

export function MainMenu({ onPlay, settings, onSettingsChange }) {
  const [panel, setPanel] = useState(null);

  return (
    <section className="main-menu">
      <div className="menu-water-light" aria-hidden="true" />
      <div className="menu-card">
        <p className="eyebrow">Una aventura artesanal bajo el agua</p>
        <h1>Pan de Marea</h1>
        <p className="subtitle">La Última Panadería</p>
        <div className="ornament" aria-hidden="true"><span /><b>✦</b><span /></div>
        <p className="level-name">Nivel I · La Panadería Hundida</p>
        <p className="objective-copy">
          Reúne Levaduras de Burbuja, enciende el horno familiar y abre la ruta al Mercado Sumergido.
        </p>
        <div className="menu-actions">
          <button className="primary-button" type="button" onClick={onPlay}>Jugar</button>
          <button type="button" onClick={() => setPanel(panel === 'controls' ? null : 'controls')}>Controles</button>
          <button type="button" onClick={() => setPanel(panel === 'settings' ? null : 'settings')}>Ajustes</button>
        </div>
        {panel === 'controls' && <ControlsPanel />}
        {panel === 'settings' && (
          <SettingsPanel settings={settings} onChange={onSettingsChange} />
        )}
        <button
          className="sound-shortcut"
          type="button"
          aria-label={settings.muted ? 'Activar sonido' : 'Silenciar sonido'}
          onClick={() => onSettingsChange({ muted: !settings.muted })}
        >
          {settings.muted ? 'Sonido apagado' : 'Sonido activo'}
        </button>
      </div>
      <p className="menu-footer">Una hogaza de esperanza en un mundo anegado.</p>
    </section>
  );
}
