export function SettingsPanel({ settings, onChange }) {
  return (
    <div className="inline-panel settings-panel" aria-label="Ajustes de accesibilidad">
      <label>
        <input type="checkbox" checked={settings.muted} onChange={(event) => onChange({ muted: event.target.checked })} />
        Silenciar sonido
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
