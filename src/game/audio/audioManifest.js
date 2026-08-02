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
});

export const AUDIO_ASSETS = Object.freeze(Object.values(AUDIO_MANIFEST));

