import { useEffect, useRef } from 'react';
import { MUSIC_MANIFEST } from '../game/audio/musicManifest.js';

const MAIN_THEME = MUSIC_MANIFEST.main;

export function MenuMusic({ active, muted }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.src = `/${MAIN_THEME.file}`;
    audio.loop = true;
    audio.volume = MAIN_THEME.volume;
    return () => audio.pause();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted || !active) {
      audio.pause();
      return;
    }
    audio.play().catch(() => {});
  }, [active, muted]);

  useEffect(() => {
    if (!active || muted) return undefined;
    const audio = audioRef.current;
    const unlock = () => {
      if (audio?.paused) audio.play().catch(() => {});
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [active, muted]);

  return <audio ref={audioRef} preload="metadata" aria-hidden="true" />;
}
