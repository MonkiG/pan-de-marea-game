import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AUDIO_MANIFEST } from '../src/game/audio/audioManifest.js';

const SAMPLE_RATE = 48_000;
const TARGET_PEAK = 10 ** (-1 / 20);
const OUTPUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/audio/sfx');
const TAU = Math.PI * 2;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const envelope = (time, duration, attack = 0.008, release = 0.08) => {
  const fadeIn = clamp(time / Math.max(attack, 0.0001), 0, 1);
  const fadeOut = clamp((duration - time) / Math.max(release, 0.0001), 0, 1);
  return Math.min(fadeIn, fadeOut);
};

const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
};

const createSamples = (duration) => new Float64Array(Math.round(duration * SAMPLE_RATE));

function addTone(samples, {
  start = 0, duration, from, to = from, amplitude = 0.5, wave = 'sine',
  attack = 0.006, release = 0.06, vibratoHz = 0, vibratoDepth = 0,
}) {
  const first = Math.max(0, Math.round(start * SAMPLE_RATE));
  const count = Math.min(samples.length - first, Math.round(duration * SAMPLE_RATE));
  for (let index = 0; index < count; index += 1) {
    const time = index / SAMPLE_RATE;
    const sweep = from * time + ((to - from) * time * time) / (2 * duration);
    const vibrato = vibratoHz
      ? (vibratoDepth / vibratoHz) * Math.sin(TAU * vibratoHz * time)
      : 0;
    const sine = Math.sin(TAU * (sweep + vibrato));
    const oscillator = wave === 'triangle'
      ? (2 / Math.PI) * Math.asin(sine)
      : wave === 'square'
        ? Math.sign(sine)
        : sine;
    samples[first + index] += oscillator * amplitude * envelope(time, duration, attack, release);
  }
}

function addNoise(samples, {
  start = 0, duration, amplitude = 0.3, seed = 1, color = 0.12,
  attack = 0.004, release = 0.08,
}) {
  const random = seededRandom(seed);
  const first = Math.max(0, Math.round(start * SAMPLE_RATE));
  const count = Math.min(samples.length - first, Math.round(duration * SAMPLE_RATE));
  let filtered = 0;
  for (let index = 0; index < count; index += 1) {
    const time = index / SAMPLE_RATE;
    const white = random() * 2 - 1;
    filtered += color * (white - filtered);
    samples[first + index] += filtered * amplitude * envelope(time, duration, attack, release);
  }
}

function addBubble(samples, start, pitch = 620, amplitude = 0.28, duration = 0.12) {
  addTone(samples, {
    start, duration, from: pitch * 1.2, to: pitch * 0.55, amplitude,
    wave: 'sine', attack: 0.002, release: duration * 0.75,
  });
}

function addClick(samples, start, pitch = 900, amplitude = 0.28) {
  addNoise(samples, { start, duration: 0.035, amplitude, seed: Math.round(start * 10_000) + pitch, color: 0.42, release: 0.028 });
  addTone(samples, { start, duration: 0.055, from: pitch, to: pitch * 0.55, amplitude: amplitude * 0.8, release: 0.045 });
}

const designs = {
  jump(samples) {
    addTone(samples, { duration: 0.22, from: 155, to: 610, amplitude: 0.58, wave: 'triangle', release: 0.07 });
    addBubble(samples, 0.105, 760, 0.3, 0.125);
  },
  attack(samples) {
    addNoise(samples, { duration: 0.25, amplitude: 0.72, seed: 12, color: 0.09, release: 0.12 });
    addTone(samples, { duration: 0.26, from: 290, to: 82, amplitude: 0.46, wave: 'triangle', release: 0.11 });
    addClick(samples, 0.205, 1050, 0.32);
  },
  hurt(samples) {
    addTone(samples, { duration: 0.4, from: 310, to: 92, amplitude: 0.62, wave: 'square', vibratoHz: 18, vibratoDepth: 18, release: 0.14 });
    addNoise(samples, { duration: 0.23, amplitude: 0.45, seed: 23, color: 0.18, release: 0.16 });
  },
  collect(samples) {
    [660, 830, 990, 1320].forEach((pitch, index) => {
      const start = index * 0.09;
      addTone(samples, { start, duration: 0.25, from: pitch, to: pitch * 1.08, amplitude: 0.32, wave: 'triangle', release: 0.18 });
      addBubble(samples, start + 0.035, pitch * 0.72, 0.16, 0.11);
    });
  },
  oven(samples) {
    addTone(samples, { duration: 1.12, from: 72, to: 152, amplitude: 0.42, wave: 'triangle', attack: 0.08, release: 0.24, vibratoHz: 7, vibratoDepth: 5 });
    addNoise(samples, { start: 0.08, duration: 0.86, amplitude: 0.28, seed: 41, color: 0.035, attack: 0.12, release: 0.24 });
    [0.12, 0.25, 0.39].forEach((start, index) => addClick(samples, start, 570 + index * 110, 0.22));
    addTone(samples, { start: 0.72, duration: 0.48, from: 330, to: 510, amplitude: 0.3, wave: 'sine', attack: 0.04, release: 0.28 });
  },
  gate(samples) {
    addTone(samples, { duration: 1.82, from: 48, to: 78, amplitude: 0.5, wave: 'triangle', attack: 0.05, release: 0.35, vibratoHz: 5, vibratoDepth: 3 });
    addNoise(samples, { start: 0.06, duration: 1.62, amplitude: 0.46, seed: 52, color: 0.025, attack: 0.08, release: 0.35 });
    [0.08, 0.34, 0.62, 0.91].forEach((start, index) => addClick(samples, start, 310 + index * 55, 0.34));
    addNoise(samples, { start: 1.28, duration: 0.68, amplitude: 0.5, seed: 54, color: 0.1, attack: 0.03, release: 0.4 });
    addTone(samples, { start: 1.42, duration: 0.72, from: 180, to: 410, amplitude: 0.32, release: 0.38 });
  },
  'enemy-defeat'(samples) {
    addTone(samples, { duration: 0.62, from: 260, to: 58, amplitude: 0.64, wave: 'triangle', vibratoHz: 13, vibratoDepth: 12, release: 0.22 });
    addNoise(samples, { duration: 0.32, amplitude: 0.4, seed: 65, color: 0.14, release: 0.22 });
    addBubble(samples, 0.34, 420, 0.28, 0.17);
    addBubble(samples, 0.48, 650, 0.2, 0.14);
  },
  'spitter-projectile'(samples) {
    addNoise(samples, { duration: 0.25, amplitude: 0.62, seed: 72, color: 0.22, release: 0.13 });
    addTone(samples, { duration: 0.31, from: 145, to: 390, amplitude: 0.48, wave: 'triangle', release: 0.14 });
    addBubble(samples, 0.19, 360, 0.27, 0.14);
  },
  regulator(samples) {
    addTone(samples, { duration: 1.1, from: 88, to: 185, amplitude: 0.38, wave: 'triangle', attack: 0.06, release: 0.26 });
    [0.08, 0.2, 0.32, 0.44, 0.58].forEach((start, index) => addClick(samples, start, 430 + index * 45, 0.3));
    addNoise(samples, { start: 0.5, duration: 0.46, amplitude: 0.34, seed: 84, color: 0.08, release: 0.22 });
    addTone(samples, { start: 0.76, duration: 0.47, from: 420, to: 630, amplitude: 0.32, release: 0.28 });
  },
  'oxygen-station'(samples) {
    [0.02, 0.12, 0.21, 0.33, 0.47, 0.61].forEach((start, index) => addBubble(samples, start, 430 + index * 85, 0.25, 0.15));
    addNoise(samples, { duration: 0.8, amplitude: 0.24, seed: 93, color: 0.08, release: 0.28 });
    addTone(samples, { start: 0.46, duration: 0.52, from: 440, to: 720, amplitude: 0.28, wave: 'triangle', release: 0.3 });
  },
  checkpoint(samples) {
    [440, 660, 880].forEach((pitch, index) => {
      addTone(samples, { start: index * 0.16, duration: 0.42, from: pitch, to: pitch * 1.03, amplitude: 0.36, wave: 'triangle', release: 0.28 });
    });
    addBubble(samples, 0.49, 740, 0.2, 0.18);
  },
  'pressure-oven'(samples) {
    addTone(samples, { duration: 1.55, from: 44, to: 132, amplitude: 0.52, wave: 'triangle', attack: 0.1, release: 0.34, vibratoHz: 8, vibratoDepth: 4 });
    addNoise(samples, { start: 0.08, duration: 1.34, amplitude: 0.4, seed: 112, color: 0.03, attack: 0.12, release: 0.3 });
    [0.18, 0.43, 0.71].forEach((start, index) => addClick(samples, start, 380 + index * 75, 0.28));
    addNoise(samples, { start: 1.18, duration: 0.56, amplitude: 0.56, seed: 114, color: 0.15, release: 0.32 });
    addTone(samples, { start: 1.36, duration: 0.52, from: 360, to: 720, amplitude: 0.38, wave: 'triangle', release: 0.3 });
  },
  'market-exit'(samples) {
    addTone(samples, { duration: 1.92, from: 52, to: 112, amplitude: 0.48, wave: 'triangle', attack: 0.06, release: 0.38 });
    addNoise(samples, { start: 0.04, duration: 1.7, amplitude: 0.42, seed: 126, color: 0.035, attack: 0.08, release: 0.38 });
    [0.1, 0.38, 0.7, 1.02].forEach((start, index) => addClick(samples, start, 300 + index * 68, 0.36));
    addTone(samples, { start: 1.25, duration: 1.05, from: 190, to: 520, amplitude: 0.34, wave: 'triangle', attack: 0.08, release: 0.46 });
    addBubble(samples, 1.7, 580, 0.22, 0.2);
  },
  'recipe-open'(samples) {
    addTone(samples, { duration: 0.34, from: 260, to: 620, amplitude: 0.44, wave: 'triangle', release: 0.16 });
    addClick(samples, 0.025, 720, 0.2);
    addBubble(samples, 0.17, 680, 0.18, 0.14);
  },
  'recipe-close'(samples) {
    addTone(samples, { duration: 0.26, from: 520, to: 210, amplitude: 0.4, wave: 'triangle', release: 0.13 });
    addClick(samples, 0.16, 430, 0.18);
  },
  'recipe-select'(samples) {
    addClick(samples, 0.008, 980, 0.22);
    addTone(samples, { start: 0.035, duration: 0.11, from: 610, to: 760, amplitude: 0.3, wave: 'triangle', release: 0.08 });
  },
  'recipe-locked'(samples) {
    addClick(samples, 0.012, 340, 0.3);
    addClick(samples, 0.105, 270, 0.24);
    addTone(samples, { duration: 0.22, from: 190, to: 120, amplitude: 0.25, wave: 'square', release: 0.1 });
  },
  'recipe-craft'(samples) {
    addTone(samples, { duration: 0.82, from: 85, to: 210, amplitude: 0.36, wave: 'triangle', attack: 0.06, release: 0.22 });
    addNoise(samples, { start: 0.05, duration: 0.58, amplitude: 0.25, seed: 141, color: 0.045, attack: 0.06, release: 0.2 });
    [0.09, 0.22, 0.35].forEach((start, index) => addClick(samples, start, 520 + index * 90, 0.2));
    [440, 660, 880].forEach((pitch, index) => addTone(samples, {
      start: 0.48 + index * 0.11, duration: 0.42, from: pitch, to: pitch * 1.04,
      amplitude: 0.26, wave: 'triangle', release: 0.28,
    }));
  },
  'bread-equip'(samples) {
    addTone(samples, { duration: 0.25, from: 390, to: 720, amplitude: 0.38, wave: 'triangle', release: 0.14 });
    addClick(samples, 0.02, 820, 0.18);
    addBubble(samples, 0.13, 610, 0.14, 0.12);
  },
  'bread-unavailable'(samples) {
    addTone(samples, { duration: 0.2, from: 220, to: 145, amplitude: 0.35, wave: 'square', release: 0.11 });
    addClick(samples, 0.025, 300, 0.2);
  },
  'baguette-launch'(samples) {
    addNoise(samples, { duration: 0.27, amplitude: 0.55, seed: 163, color: 0.09, release: 0.15 });
    addTone(samples, { duration: 0.31, from: 145, to: 520, amplitude: 0.46, wave: 'triangle', release: 0.14 });
    addBubble(samples, 0.19, 690, 0.18, 0.12);
  },
  'baguette-impact'(samples) {
    addNoise(samples, { duration: 0.31, amplitude: 0.68, seed: 174, color: 0.18, release: 0.2 });
    addTone(samples, { duration: 0.28, from: 420, to: 95, amplitude: 0.52, wave: 'triangle', release: 0.16 });
    addClick(samples, 0.025, 1080, 0.34);
    addBubble(samples, 0.19, 520, 0.2, 0.14);
    addBubble(samples, 0.27, 760, 0.14, 0.12);
  },
};

function finalize(samples) {
  let average = 0;
  for (const sample of samples) average += sample;
  average /= samples.length;

  let peak = 0;
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] -= average;
    peak = Math.max(peak, Math.abs(samples[index]));
  }
  const scale = peak > 0 ? TARGET_PEAK / peak : 1;
  const edge = Math.round(SAMPLE_RATE * 0.006);
  for (let index = 0; index < samples.length; index += 1) {
    const fadeIn = Math.min(1, index / edge);
    const fadeOut = Math.min(1, (samples.length - 1 - index) / edge);
    samples[index] = clamp(samples[index] * scale * fadeIn * fadeOut, -TARGET_PEAK, TARGET_PEAK);
  }
}

function encodeWav(samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < samples.length; index += 1) {
    buffer.writeInt16LE(Math.round(samples[index] * 32767), 44 + index * 2);
  }
  return buffer;
}

await mkdir(OUTPUT_DIR, { recursive: true });
for (const [logicalKey, asset] of Object.entries(AUDIO_MANIFEST)) {
  const samples = createSamples(asset.durationMs / 1000);
  designs[logicalKey](samples);
  finalize(samples);
  const output = path.join(OUTPUT_DIR, path.basename(asset.file));
  await writeFile(output, encodeWav(samples));
  console.info(`WROTE ${path.relative(process.cwd(), output)} (${asset.durationMs} ms)`);
}

