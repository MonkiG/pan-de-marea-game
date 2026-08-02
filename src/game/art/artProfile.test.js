import { describe, expect, it } from 'vitest';
import { ART_PROFILES, resolveArtProfile } from './artProfile.js';

describe('resolveArtProfile', () => {
  it('uses pixel-v1 when no profile is configured', () => {
    expect(resolveArtProfile()).toBe(ART_PROFILES.pixelV1);
  });

  it('keeps legacy available as an explicit fallback', () => {
    expect(resolveArtProfile(ART_PROFILES.legacy)).toBe(ART_PROFILES.legacy);
  });

  it('does not let an unknown value disable the official art profile', () => {
    expect(resolveArtProfile('unknown')).toBe(ART_PROFILES.pixelV1);
  });
});
