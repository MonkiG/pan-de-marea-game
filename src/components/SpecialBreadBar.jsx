import { SPECIAL_BREAD_RECIPES } from '../game/data/recipeData.js';

const LOCK_ICON = '/pixel-art/v1/recipes/icon-lock.png';

/**
 * Barra de panes especiales del HUD. Muestra el slot seleccionado, las recetas
 * futuras bloqueadas y el cooldown del pan activo. Sólo lectura: el disparo se
 * hace con la tecla K en el juego.
 */
export function SpecialBreadBar({ special }) {
  if (!special?.slots?.length) return null;
  const { slots, selectedId, cooldownRemainingMs = 0, unavailablePulse } = special;
  const selectedRecipe = SPECIAL_BREAD_RECIPES[selectedId];
  const cooldownRatio = selectedRecipe?.cooldownMs
    ? Math.max(0, Math.min(1, cooldownRemainingMs / selectedRecipe.cooldownMs))
    : 0;

  return (
    <div
      className={`special-bread ${unavailablePulse ? 'is-unavailable' : ''}`}
      role="group"
      aria-label="Panes especiales"
    >
      <ul className="special-bread-slots">
        {slots.map((slot) => {
          const isSelected = slot.id === selectedId;
          return (
            <li
              key={slot.id}
              className={`special-slot ${isSelected ? 'is-selected' : ''} ${slot.unlocked ? '' : 'is-locked'}`}
            >
              <img className="special-slot-icon" src={slot.icon} alt="" />
              {slot.unlocked
                ? <b className="special-count">{slot.infinite && slot.count > 0 ? '∞' : slot.count}</b>
                : <img className="special-lock" src={LOCK_ICON} alt="" />}
              {isSelected && cooldownRatio > 0 && (
                <span className="special-cooldown" style={{ transform: `scaleY(${cooldownRatio})` }} />
              )}
            </li>
          );
        })}
      </ul>
      <span className="special-hint">Q Cambiar · K Usar</span>
    </div>
  );
}
