import { OXYGEN } from '../constants.js';

export class OxygenSystem {
  constructor(config = {}) {
    this.config = { ...OXYGEN, ...config };
    this.reset();
  }

  reset() {
    this.value = this.config.max;
    this.damageAccumulatorMs = 0;
  }

  tick(deltaMs, active = true) {
    if (!active || deltaMs <= 0) return { value: this.value, damageCount: 0 };

    this.value = Math.max(
      0,
      this.value - this.config.drainPerSecond * (deltaMs / 1000),
    );

    let damageCount = 0;
    if (this.value === 0) {
      this.damageAccumulatorMs += deltaMs;
      damageCount = Math.floor(
        this.damageAccumulatorMs / this.config.zeroDamageIntervalMs,
      );
      if (damageCount > 0) {
        this.damageAccumulatorMs %= this.config.zeroDamageIntervalMs;
      }
    } else {
      this.damageAccumulatorMs = 0;
    }

    return { value: this.value, damageCount };
  }

  recover(amount) {
    this.value = Math.min(this.config.max, this.value + Math.max(0, amount));
    if (this.value > 0) this.damageAccumulatorMs = 0;
    return this.value;
  }

  isLow() {
    return this.value <= this.config.lowThreshold;
  }
}
