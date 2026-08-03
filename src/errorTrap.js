import { eventBus } from './game/EventBus.js';

let installed = false;

/**
 * Red de seguridad global: reenvía errores no atrapados (incluidos los que
 * escapan del render loop de Phaser y hoy congelan el juego en silencio) al
 * bus de eventos, donde React ya muestra el overlay de "Reintentar".
 * No previene el log por defecto de la consola.
 */
export function installGlobalErrorTrap() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (event) => {
    const error = event?.error ?? new Error(event?.message ?? 'Error no atrapado');
    eventBus.emit('game:error', error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    eventBus.emit('game:error', reason instanceof Error ? reason : new Error(String(reason)));
  });
}
