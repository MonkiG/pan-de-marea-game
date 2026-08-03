export function SettingsPanel({ settings, onChange }) {
  return (
    <div className="inline-panel settings-panel" aria-label="Ajustes de accesibilidad">
      <label>
        <input type="checkbox" checked={settings.musicMuted} onChange={(event) => onChange({ musicMuted: event.target.checked })} />
        Silenciar música
      </label>
      <label>
        <input type="checkbox" checked={settings.sfxMuted} onChange={(event) => onChange({ sfxMuted: event.target.checked })} />
        Silenciar efectos
      </label>
      <label>
        <input type="checkbox" checked={!settings.screenShake} onChange={(event) => onChange({ screenShake: !event.target.checked })} />
        Desactivar sacudidas
      </label>
      <label>
        <input type="checkbox" checked={settings.reducedParticles} onChange={(event) => onChange({ reducedParticles: event.target.checked })} />
        Reducir partículas
      </label>
    </div>
  );
}
