const track = (key, file, volume) => Object.freeze({
  key,
  file,
  volume,
});

export const MUSIC_MANIFEST = Object.freeze({
  main: track('music-main', 'audio/music/riviera-swing-main.wav', 0.38),
  'level-one': track('music-level-one', 'audio/music/tidal-siege-tutorial.wav', 0.38),
  'level-two': track('music-level-two', 'audio/music/heroic-depths-level-1.wav', 0.38),
});

export const MUSIC_ASSETS = Object.freeze(Object.values(MUSIC_MANIFEST));
