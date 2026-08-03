import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AUDIO_MANIFEST } from '../src/game/audio/audioManifest.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

for (const [logicalKey, asset] of Object.entries(AUDIO_MANIFEST)) {
  const filePath = path.join(ROOT, 'assets', asset.file);
  try {
    const wav = await readFile(filePath);
    const signature = `${wav.toString('ascii', 0, 4)}/${wav.toString('ascii', 8, 12)}`;
    const audioFormat = wav.readUInt16LE(20);
    const channels = wav.readUInt16LE(22);
    const sampleRate = wav.readUInt32LE(24);
    const bitsPerSample = wav.readUInt16LE(34);
    const dataBytes = wav.readUInt32LE(40);
    const sampleCount = dataBytes / 2;
    const durationMs = (sampleCount / sampleRate) * 1000;
    let peak = 0;
    let firstAudible = sampleCount;
    let tailSquares = 0;
    const tailSamples = Math.min(sampleCount, Math.round(sampleRate * 0.006));
    for (let index = 0; index < sampleCount; index += 1) {
      const value = wav.readInt16LE(44 + index * 2) / 32768;
      const absolute = Math.abs(value);
      peak = Math.max(peak, absolute);
      if (firstAudible === sampleCount && absolute >= 0.002) firstAudible = index;
      if (index >= sampleCount - tailSamples) tailSquares += value * value;
    }
    const firstAudibleMs = (firstAudible / sampleRate) * 1000;
    const tailRms = Math.sqrt(tailSquares / tailSamples);
    const checks = [
      [signature === 'RIFF/WAVE', `firma ${signature}`],
      [audioFormat === 1, `formato PCM ${audioFormat}`],
      [channels === 1, `${channels} canales`],
      [sampleRate === 48_000, `${sampleRate} Hz`],
      [bitsPerSample === 16, `${bitsPerSample} bits`],
      [Math.abs(durationMs - asset.durationMs) <= 1, `${durationMs.toFixed(1)} ms`],
      [peak >= 0.7 && peak <= 0.9, `pico ${(20 * Math.log10(peak)).toFixed(2)} dBFS`],
      [firstAudibleMs <= 18, `inicio audible ${firstAudibleMs.toFixed(1)} ms`],
      [tailRms <= 0.012, `cola RMS ${tailRms.toFixed(5)}`],
    ];
    const failed = checks.filter(([passed]) => !passed).map(([, message]) => message);
    if (failed.length) errors.push(`${logicalKey}: ${failed.join(', ')}`);
    else console.info(`PASS ${asset.file}: ${durationMs.toFixed(0)} ms, ${(20 * Math.log10(peak)).toFixed(2)} dBFS`);
  } catch (error) {
    errors.push(`${logicalKey}: ${error.message}`);
  }
}

if (errors.length) {
  errors.forEach((error) => console.error(`FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.info(`Biblioteca de audio válida: ${Object.keys(AUDIO_MANIFEST).length} SFX.`);
}

