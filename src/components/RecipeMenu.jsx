import { useEffect, useRef } from 'react';

const REASON_TEXT = Object.freeze({
  locked: 'Se desbloquea en otro nivel.',
  ingredients: 'Levadura disponible insuficiente.',
  full: 'Ya tienes el máximo de este pan.',
  unknown: 'Receta desconocida.',
});

const FEEDBACK_TEXT = Object.freeze({
  crafted: '¡Pan preparado!',
  locked: 'Esa receta se desbloquea en otro nivel.',
  ingredients: 'No tienes Levadura disponible suficiente.',
  full: 'No puedes almacenar más de este pan.',
});

/**
 * Menú React del horno submarino. Presenta el pedido de misión y los panes
 * especiales; el bloqueo de la escena y el consumo real ocurren en Phaser.
 */
export function RecipeMenu({ menu, onCraft, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const { ingredients, mission, specials, feedback } = menu;
  const missionDone = mission.completed;

  return (
    <div className="overlay recipe-overlay" role="dialog" aria-modal="true" aria-label="Horno submarino">
      <div className="overlay-card recipe-card">
        <p className="eyebrow">Estación de horneado</p>
        <h2>Horno submarino</h2>
        <p className="recipe-yeast">
          <span><b>{ingredients.available}</b> Levadura total</span>
          <span><b>{ingredients.spendable}</b> disponible</span>
          <span><b>{ingredients.reserved}</b> reservada al objetivo</span>
        </p>

        <section className="recipe-section" aria-label="Pedido del nivel">
          <h3>Pedido del nivel</h3>
          <div className="recipe-mission">
            <div className="recipe-info">
              <strong>{mission.name}</strong>
              <span>
                Cuesta {mission.cost} Levadura{mission.cost === 1 ? '' : 's'}
                {mission.requirements?.regulators ? ` · ${mission.requirements.regulators} reguladores` : ''}
              </span>
            </div>
            <button
              type="button"
              className="primary-button"
              disabled={missionDone || !mission.canCraft}
              onClick={() => onCraft(mission.id)}
            >
              {missionDone ? 'Preparado' : 'Elaborar'}
            </button>
          </div>
        </section>

        <section className="recipe-section" aria-label="Panes especiales">
          <h3>Panes especiales</h3>
          <ul className="recipe-cards">
            {specials.map((recipe) => (
              <li
                key={recipe.id}
                className={`recipe-card-item ${recipe.unlocked ? '' : 'is-locked'}`}
              >
                <img className="recipe-icon" src={recipe.icon} alt="" />
                <div className="recipe-info">
                  <strong>{recipe.name}</strong>
                  <span>{recipe.description}</span>
                  {!recipe.unlocked && <span className="recipe-stock is-muted">Receta futura</span>}
                  {recipe.unlocked && recipe.infinite && (
                    <span className="recipe-stock">
                      {recipe.count > 0 ? 'Preparada · munición ∞' : `Requiere ${recipe.cost} Levaduras`}
                    </span>
                  )}
                  {recipe.unlocked && !recipe.infinite && (
                    <span className="recipe-stock">
                      {recipe.count}/{recipe.maxStack} · {recipe.cost} Levadura
                    </span>
                  )}
                  {recipe.unlocked && !recipe.canCraft && recipe.reason
                    && !(recipe.infinite && recipe.count > 0) && (
                    <span className="recipe-reason">{REASON_TEXT[recipe.reason]}</span>
                  )}
                </div>
                <button
                  type="button"
                  className={recipe.unlocked ? 'primary-button' : 'ghost-button'}
                  aria-disabled={recipe.unlocked ? undefined : 'true'}
                  disabled={recipe.unlocked && !recipe.canCraft}
                  onClick={() => onCraft(recipe.id)}
                >
                  {!recipe.unlocked ? 'Bloqueada'
                    : recipe.infinite && recipe.count > 0 ? 'Preparada' : 'Elaborar'}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <p className="recipe-feedback" aria-live="polite">
          {feedback ? FEEDBACK_TEXT[feedback] ?? '' : ''}
        </p>

        <div className="overlay-actions recipe-actions">
          <button ref={closeRef} type="button" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
