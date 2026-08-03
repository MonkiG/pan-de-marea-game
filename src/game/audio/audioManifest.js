const sfx = (key, file, durationMs, volume, cooldownMs) => Object.freeze({
  key: `sfx-${key}`,
  file: `audio/sfx/${file}.wav`,
  durationMs,
  volume,
  cooldownMs,
});

export const AUDIO_MANIFEST = Object.freeze({
  jump: sfx('jump', 'jump', 240, 0.58, 70),
  attack: sfx('attack', 'attack', 320, 0.68, 120),
  hurt: sfx('hurt', 'hurt', 440, 0.78, 250),
  collect: sfx('collect', 'yeast-collect', 620, 0.64, 120),
  oven: sfx('oven', 'oven', 1250, 0.62, 900),
  gate: sfx('gate', 'gate', 2200, 0.72, 1500),
  'enemy-defeat': sfx('enemy-defeat', 'enemy-defeat', 760, 0.72, 220),
  'spitter-projectile': sfx('spitter-projectile', 'spitter-projectile', 380, 0.66, 90),
  regulator: sfx('regulator', 'regulator', 1280, 0.68, 800),
  'oxygen-station': sfx('oxygen-station', 'oxygen-station', 1050, 0.58, 500),
  checkpoint: sfx('checkpoint', 'checkpoint', 900, 0.62, 650),
  'pressure-oven': sfx('pressure-oven', 'pressure-oven', 1950, 0.7, 1300),
  'market-exit': sfx('market-exit', 'market-exit', 2400, 0.74, 1800),
  'recipe-open': sfx('recipe-open', 'recipe-open', 420, 0.5, 250),
  'recipe-close': sfx('recipe-close', 'recipe-close', 300, 0.46, 200),
  'recipe-select': sfx('recipe-select', 'recipe-select', 160, 0.45, 80),
  'recipe-locked': sfx('recipe-locked', 'recipe-locked', 260, 0.52, 220),
  'recipe-craft': sfx('recipe-craft', 'recipe-craft', 1100, 0.66, 900),
  'bread-equip': sfx('bread-equip', 'bread-equip', 300, 0.5, 180),
  'bread-unavailable': sfx('bread-unavailable', 'bread-unavailable', 240, 0.48, 220),
  'baguette-launch': sfx('baguette-launch', 'baguette-launch', 350, 0.68, 180),
  'baguette-impact': sfx('baguette-impact', 'baguette-impact', 420, 0.72, 100),
});

export const AUDIO_ASSETS = Object.freeze(Object.values(AUDIO_MANIFEST));

