const controls = [
  ['A / D · ← / →', 'Moverse'],
  ['W · ↑ · Espacio', 'Saltar'],
  ['J · X', 'Atacar'],
  ['E · Enter', 'Interactuar'],
  ['Esc', 'Pausa'],
];

export function ControlsPanel() {
  return (
    <div className="inline-panel" aria-label="Controles del juego">
      {controls.map(([keys, action]) => (
        <div className="control-row" key={action}><kbd>{keys}</kbd><span>{action}</span></div>
      ))}
    </div>
  );
}
