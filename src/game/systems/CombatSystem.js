export function applyDamage(state, amount, now, invulnerabilityMs = 0) {
  if (now < (state.invulnerableUntil ?? 0) || state.health <= 0) {
    return { ...state, applied: false };
  }

  const health = Math.max(0, state.health - Math.max(0, amount));
  return {
    ...state,
    health,
    invulnerableUntil: now + Math.max(0, invulnerabilityMs),
    applied: true,
  };
}
