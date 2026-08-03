import { useState } from 'react';
import { ControlsPanel } from './ControlsPanel.jsx';
import { SettingsPanel } from './SettingsPanel.jsx';

export function MainMenu({
  onOpenLevels,
  settings,
  onSettingsChange,
}) {
  const [panel, setPanel] = useState(null);

  return (
    <section className="main-menu">
      <div className="menu-water-light" aria-hidden="true" />
      <div className="menu-card">
        <p className="eyebrow">Una aventura artesanal bajo el agua</p>
        <h1>Pan de Marea</h1>
        <p className="subtitle">La Última Panadería</p>
        <div className="ornament" aria-hidden="true"><span /><b>✦</b><span /></div>
        <div className="menu-actions">
          <button className="primary-button" type="button" onClick={onOpenLevels}>Jugar</button>
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
          aria-label={settings.musicMuted && settings.sfxMuted ? 'Activar sonido' : 'Silenciar sonido'}
          onClick={() => {
            const allMuted = settings.musicMuted && settings.sfxMuted;
            onSettingsChange({ musicMuted: !allMuted, sfxMuted: !allMuted });
          }}
        >
          {settings.musicMuted && settings.sfxMuted ? 'Sonido apagado' : 'Sonido activo'}
        </button>
      </div>
    </section>
  );
}
