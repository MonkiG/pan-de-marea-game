import Phaser from 'phaser';
import { FallbackFactory } from '../systems/FallbackFactory.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    FallbackFactory.createAll(this);
    this.scene.start('preload');
  }
}
