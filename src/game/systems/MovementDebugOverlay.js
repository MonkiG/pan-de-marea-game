import Phaser from 'phaser';
import { DEBUG_LEVEL_GEOMETRY, DEBUG_MOVEMENT } from '../constants.js';

export class MovementDebugOverlay {
  constructor(scene, player, levelData) {
    this.scene = scene;
    this.player = player;
    this.levelData = levelData;
    this.enabled = DEBUG_MOVEMENT || DEBUG_LEVEL_GEOMETRY;
    if (!this.enabled) return;
    this.graphics = scene.add.graphics().setDepth(1000);
    this.label = scene.add.text(8, 94, '', {
      fontFamily: 'monospace', fontSize: '11px', color: '#ffffff', backgroundColor: '#001014cc',
    }).setScrollFactor(0).setDepth(1001);
  }

  update() {
    if (!this.enabled) return;
    const graphics = this.graphics.clear();
    if (DEBUG_LEVEL_GEOMETRY) {
      graphics.lineStyle(1, 0x54f0dc, 0.9);
      this.scene.walkableSurfaces.getChildren().forEach(({ body }) => {
        if (body?.enable) graphics.strokeRect(body.x, body.y, body.width, body.height);
      });
      const platforms = new Map(this.levelData.platforms.map((platform) => [platform.id, platform]));
      graphics.lineStyle(1, 0xffcf5b, 0.75);
      this.levelData.jumpLinks.forEach((link) => {
        const from = platforms.get(link.from);
        const to = platforms.get(link.to);
        if (!from || !to) return;
        graphics.lineBetween(from.x, from.y - from.height / 2, to.x, to.y - to.height / 2);
        graphics.fillStyle(0xffcf5b, 0.9).fillCircle(from.x, from.y - from.height / 2, 3);
        graphics.fillCircle(to.x, to.y - to.height / 2, 3);
      });
    }
    if (DEBUG_MOVEMENT) {
      const body = this.player.body;
      const groundCheck = this.player.getGroundCheckRect();
      graphics.lineStyle(1, 0x6aff72, 1).strokeRect(body.x, body.y, body.width, body.height);
      graphics.lineStyle(1, 0xff5f6d, 1).strokeRectShape(groundCheck);
      graphics.lineStyle(2, 0x67b7ff, 1).lineBetween(
        this.player.x,
        this.player.y,
        this.player.x + body.velocity.x * 0.25,
        this.player.y + body.velocity.y * 0.25,
      );
      this.label.setText([
        `vX ${body.velocity.x.toFixed(1)}  vY ${body.velocity.y.toFixed(1)}`,
        `suelo ${this.player.isGrounded() ? 'sí' : 'no'}  x ${this.player.x.toFixed(0)}`,
      ]);
    }
  }

  destroy() {
    this.graphics?.destroy();
    this.label?.destroy();
  }
}
