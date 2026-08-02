import Phaser from 'phaser';
import { BubbleYeast } from '../entities/BubbleYeast.js';
import { BrineCrawler } from '../entities/BrineCrawler.js';
import { Oven } from '../entities/Oven.js';
import { Player } from '../entities/Player.js';
import { ThermalGate } from '../entities/ThermalGate.js';
import { CRAWLER, LEVEL_IDS, OBJECTIVES, OXYGEN, PLAYER, RECIPE } from '../constants.js';
import { eventBus } from '../EventBus.js';
import { LEVEL_ONE_DATA } from '../data/levelOneData.js';
import { AudioManager } from '../systems/AudioManager.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { OxygenSystem } from '../systems/OxygenSystem.js';
import { RecipeSystem, canUnlockGate } from '../systems/RecipeSystem.js';
import { MovementDebugOverlay } from '../systems/MovementDebugOverlay.js';
import { validateJumpLink } from '../systems/JumpReachSystem.js';
import { sessionProgress } from '../systems/SessionProgress.js';

export class LevelOneScene extends Phaser.Scene {
  constructor() {
    super('level-one');
  }

  create() {
    this.game.registry.set('currentLevel', LEVEL_IDS.bakery);
    this.status = 'playing';
    this.settings = {
      muted: false,
      screenShake: true,
      reducedParticles: false,
      ...(this.game.registry.get('settings') ?? {}),
    };
    this.startedAt = this.time.now;
    this.elapsedBeforePause = 0;
    this.lastSnapshotAt = -Infinity;
    this.enemiesDefeated = 0;
    this.objective = OBJECTIVES.explore;
    this.contextPrompt = '';
    this.tutorialPrompt = '';
    this.tutorialUntil = 0;
    this.tutorialsSeen = new Set();
    this.ventUsed = false;
    this.ending = false;

    this.inventory = new InventorySystem();
    this.oxygenSystem = new OxygenSystem();
    this.recipeSystem = new RecipeSystem();
    this.audioManager = new AudioManager();
    this.audioManager.setMuted(this.settings.muted);

    this.physics.world.setBounds(0, 0, LEVEL_ONE_DATA.worldWidth, LEVEL_ONE_DATA.worldHeight);
    this.cameras.main.setBounds(0, 0, LEVEL_ONE_DATA.worldWidth, LEVEL_ONE_DATA.worldHeight);
    this.createBackground();
    this.createLevelGeometry();
    this.createAmbientDetails();

    this.player = new Player(this, LEVEL_ONE_DATA.spawn.x, LEVEL_ONE_DATA.spawn.y);
    this.yeasts = this.add.group();
    LEVEL_ONE_DATA.collectibles.forEach((data) => this.yeasts.add(new BubbleYeast(this, data)));
    this.enemies = this.add.group();
    LEVEL_ONE_DATA.enemies.forEach((data) => {
      this.enemies.add(new BrineCrawler(this, data, this.player, () => this.onEnemyDefeated()));
    });
    this.oven = new Oven(this, LEVEL_ONE_DATA.oven);
    this.gate = new ThermalGate(this, LEVEL_ONE_DATA.gate);
    this.createOxygenVent();
    this.createPhysicsLinks();
    this.configureCamera();
    this.debugOverlay = new MovementDebugOverlay(this, this.player, LEVEL_ONE_DATA);
    this.validateLevelTraversal();

    this.input.keyboard.addCapture([
      'UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE', 'A', 'D', 'W', 'J', 'X', 'E', 'ENTER', 'ESC',
    ]);
    this.input.keyboard.on('keydown-ESC', this.handleEscape, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.showTutorial('movement', 'A / D o flechas para moverte', 3300);
    this.emitSnapshot(true);
    eventBus.emit('game:ready', this.getSnapshot());
  }

  createBackground() {
    const layers = [
      { key: 'bakery-bg-1', factor: 0.1, alpha: 0.72, tileScale: 0.42 },
      { key: 'bakery-bg-2', factor: 0.28, alpha: 0.72, tileScale: 0.39 },
      { key: 'bakery-bg-3', factor: 0.55, alpha: 0.62, tileScale: 0.37 },
    ];
    this.add.rectangle(0, 0, LEVEL_ONE_DATA.worldWidth, 360, 0x062731).setOrigin(0);
    layers.forEach(({ key, factor, alpha, tileScale }) => {
      if (!this.textures.exists(key)) return;
      const layer = this.add.tileSprite(0, 0, LEVEL_ONE_DATA.worldWidth + 900, 360, key)
        .setOrigin(0)
        .setScrollFactor(factor, 1)
        .setAlpha(alpha);
      layer.setTileScale(tileScale, tileScale);
      layer.tilePositionY = 180;
    });
    this.add.rectangle(0, 0, LEVEL_ONE_DATA.worldWidth, 360, 0x073744, 0.18).setOrigin(0).setDepth(2);
  }

  createLevelGeometry() {
    this.walkableSurfaces = this.add.group();
    const texture = this.textures.exists('tileset') && this.textures.get('tileset').has('tile-platform-long')
      ? 'tileset'
      : 'fallback-platform';
    const floorFrame = texture === 'tileset' ? 'tile-platform-long' : undefined;
    for (let x = 160; x < LEVEL_ONE_DATA.worldWidth; x += 318) {
      this.add.image(x, 344, texture, floorFrame).setDisplaySize(320, 42).setDepth(8);
    }
    this.createOneWaySurface(
      LEVEL_ONE_DATA.worldWidth / 2,
      LEVEL_ONE_DATA.collision.floorTop,
      LEVEL_ONE_DATA.worldWidth,
      LEVEL_ONE_DATA.collision.floorHeight,
    );
    LEVEL_ONE_DATA.platforms.forEach((data) => {
      const frame = texture === 'tileset' && this.textures.get(texture).has(data.frame) ? data.frame : floorFrame;
      this.add.image(data.x, data.y, texture, frame)
        .setDisplaySize(data.width, data.height)
        .setDepth(8);
      this.createOneWaySurface(
        data.x,
        data.y - data.height / 2,
        data.width - LEVEL_ONE_DATA.collision.platformHorizontalInset * 2,
        LEVEL_ONE_DATA.collision.platformThickness,
      );
    });

    LEVEL_ONE_DATA.decorations.forEach((data) => {
      if (texture !== 'tileset' || !this.textures.get(texture).has(data.frame)) return;
      this.add.image(data.x, data.y, texture, data.frame)
        .setDisplaySize(data.width, data.height)
        .setOrigin(0.5, 1)
        .setDepth(7)
        .setAlpha(0.88);
    });
  }

  createOneWaySurface(x, top, width, height) {
    const surface = this.add.zone(x, top + height / 2, width, height);
    this.physics.add.existing(surface, true);
    surface.body.checkCollision.up = true;
    surface.body.checkCollision.down = false;
    surface.body.checkCollision.left = false;
    surface.body.checkCollision.right = false;
    this.walkableSurfaces.add(surface);
    return surface;
  }

  createAmbientDetails() {
    const bubbleCount = this.settings.reducedParticles ? 8 : 22;
    for (let index = 0; index < bubbleCount; index += 1) {
      const bubble = this.add.circle(
        Phaser.Math.Between(80, LEVEL_ONE_DATA.worldWidth - 80),
        Phaser.Math.Between(80, 330),
        Phaser.Math.Between(1, 3),
        0xb5fff5,
        Phaser.Math.FloatBetween(0.12, 0.35),
      ).setDepth(5);
      this.tweens.add({
        targets: bubble,
        y: bubble.y - Phaser.Math.Between(45, 105),
        alpha: 0,
        duration: Phaser.Math.Between(2600, 5200),
        delay: Phaser.Math.Between(0, 1800),
        repeat: -1,
        onRepeat: () => {
          bubble.y += Phaser.Math.Between(45, 105);
          bubble.alpha = Phaser.Math.FloatBetween(0.12, 0.35);
        },
      });
    }
  }

  createOxygenVent() {
    const data = LEVEL_ONE_DATA.oxygenVent;
    this.ventGlow = this.add.circle(data.x, data.y - 10, 24, 0x83fff0, 0.2).setDepth(9);
    this.add.rectangle(data.x, data.y + 6, 48, 15, 0x476d70).setDepth(9);
    this.tweens.add({ targets: this.ventGlow, alpha: 0.5, scale: 1.25, yoyo: true, repeat: -1, duration: 900 });
    this.ventZone = this.add.zone(data.x, data.y - 20, data.radius * 2, 90);
    this.physics.add.existing(this.ventZone, true);
  }

  createPhysicsLinks() {
    this.physics.add.collider(this.player, this.walkableSurfaces);
    this.physics.add.collider(this.enemies, this.walkableSurfaces);
    this.physics.add.overlap(this.player, this.yeasts, (_player, yeast) => this.collectYeast(yeast));
    this.physics.add.overlap(this.player.attackZone, this.enemies, (_zone, enemy) => {
      if (this.player.canHit(enemy)) enemy.takeDamage(1, this.player.x);
    });
    this.physics.add.overlap(this.player, this.ventZone, () => this.useOxygenVent());
  }

  configureCamera() {
    const camera = this.cameras.main;
    camera.startFollow(this.player, true, 0.08, 0.1);
    camera.setDeadzone(120, 80);
    camera.setFollowOffset(-55, 12);
    camera.roundPixels = true;
  }

  update(time, delta) {
    if (this.status !== 'playing') return;
    this.player.update(time, delta);
    this.enemies.children.each((enemy) => enemy?.update(time, delta));
    this.yeasts.children.each((yeast) => yeast?.updateAttraction(this.player));

    const desiredOffset = this.player.facing > 0 ? -55 : 55;
    this.cameras.main.followOffset.x = Phaser.Math.Linear(this.cameras.main.followOffset.x, desiredOffset, 0.04);

    const oxygen = this.oxygenSystem.tick(delta, !this.ending);
    for (let index = 0; index < oxygen.damageCount; index += 1) this.damagePlayer(1, this.player.x);

    this.updateTutorials(time);
    this.updateInteractions();
    this.oven.setAvailable(this.recipeSystem.canCraft(this.inventory));
    this.debugOverlay?.update();
    this.emitSnapshot(false, time);
  }

  validateLevelTraversal() {
    const platforms = new Map(LEVEL_ONE_DATA.platforms.map((platform) => [platform.id, platform]));
    LEVEL_ONE_DATA.jumpLinks.forEach((link) => {
      const from = platforms.get(link.from);
      const to = platforms.get(link.to);
      if (!from || !to) return;
      const result = validateJumpLink(from, to, PLAYER);
      if (!result.reachable) {
        console.warn(
          `[Nivel] Salto ${link.from} -> ${link.to} excede el margen seguro: `
            + `${result.gap.toFixed(0)}px / ${result.recommendedReach.toFixed(0)}px.`,
        );
      }
    });
  }

  updateTutorials(time) {
    if (this.player.x > 300) this.showTutorial('jump', 'Espacio o W para saltar', 3000);
    if (this.player.x > 620 && this.objective === OBJECTIVES.explore) this.objective = OBJECTIVES.collect;
    if (this.player.x > 1450) this.showTutorial('attack', 'J o X para atacar', 3000);
    if (this.oxygenSystem.isLow()) this.showTutorial('oxygen-low', 'Oxígeno bajo: busca burbujas de recuperación', 3600);
    if (time >= this.tutorialUntil) this.tutorialPrompt = '';
  }

  updateInteractions() {
    this.contextPrompt = '';
    const interactPressed = this.player.consumeInteractPressed();
    if (this.oven.isNearby(this.player)) {
      if (this.recipeSystem.completed) this.contextPrompt = 'El Pan Térmico está listo';
      else if (!this.recipeSystem.canCraft(this.inventory)) {
        const missing = Math.max(0, RECIPE.yeastRequired - this.inventory.availableYeast);
        this.contextPrompt = `Horno: faltan ${missing} Levadura${missing === 1 ? '' : 's'}`;
      } else {
        this.contextPrompt = 'Presiona E para usar el horno';
        this.objective = OBJECTIVES.bake;
        if (interactPressed) this.startBaking();
      }
      return;
    }

    if (this.gate.isNearby(this.player)) {
      if (!canUnlockGate(this.recipeSystem.hasThermalBread)) {
        this.contextPrompt = 'La compuerta necesita un Pan Térmico';
      } else {
        this.contextPrompt = 'Presiona E para activar la compuerta';
        if (interactPressed) this.activateGate();
      }
    }
  }

  collectYeast(yeast) {
    if (!yeast?.collect(() => {
      this.inventory.collect();
      this.oxygenSystem.recover(OXYGEN.yeastRecovery);
      this.audioManager.play('collect');
      this.burst(yeast.x, yeast.y, 0xffc657);
      if (this.inventory.totalCollected >= RECIPE.yeastRequired) this.objective = OBJECTIVES.oven;
      this.emitSnapshot(true);
    })) return;
    this.showTutorial('yeast', 'La Levadura de Burbuja recupera oxígeno', 2800);
  }

  useOxygenVent() {
    if (this.ventUsed) return;
    this.ventUsed = true;
    this.oxygenSystem.recover(OXYGEN.ventRecovery);
    this.burst(this.ventZone.x, this.ventZone.y, 0x8effef);
    this.showTutorial('vent', 'Respiras una corriente de aire antiguo', 2800);
    this.emitSnapshot(true);
  }

  startBaking() {
    if (!this.recipeSystem.canCraft(this.inventory)) return;
    this.player.setControlsEnabled(false);
    this.contextPrompt = 'Horneando Pan Térmico…';
    this.audioManager.play('oven');
    this.oven.bake(RECIPE.bakeTimeMs, () => {
      if (!this.recipeSystem.craft(this.inventory)) {
        this.player.setControlsEnabled(true);
        return;
      }
      this.player.setControlsEnabled(true);
      this.objective = OBJECTIVES.gate;
      this.contextPrompt = '¡Pan Térmico preparado!';
      this.burst(this.oven.x, this.oven.y - 45, 0xff8a36);
      this.emitSnapshot(true);
    });
  }

  activateGate() {
    if (!this.recipeSystem.consumeThermalBread()) return;
    this.ending = true;
    this.player.setControlsEnabled(false);
    this.contextPrompt = 'Activando la Marea Térmica…';
    this.audioManager.play('gate');
    this.gate.activate(() => {
      this.cameras.main.shake(650, this.settings.screenShake ? 0.014 : 0);
      this.burst(this.gate.x, this.gate.y - 70, 0xffaa45, true);
      this.contextPrompt = 'La ruta al Mercado Sumergido está abierta';
      this.objective = OBJECTIVES.complete;
      this.time.delayedCall(1200, () => this.completeLevel());
    });
    this.emitSnapshot(true);
  }

  completeLevel() {
    if (this.status === 'complete') return;
    this.status = 'complete';
    this.player.setControlsEnabled(false);
    this.cameras.main.fadeOut(700, 2, 18, 22);
    sessionProgress.completeLevel(LEVEL_IDS.bakery, {
      elapsedMs: this.getElapsedMs(),
      enemiesDefeated: this.enemiesDefeated,
      yeastCollected: this.inventory.totalCollected,
    });
    const snapshot = this.getSnapshot();
    eventBus.emit('level:completed', snapshot);
    eventBus.emit('game:complete', snapshot);
    eventBus.emit('game:snapshot', snapshot);
  }

  damagePlayer(amount, sourceX) {
    if (this.status !== 'playing' || this.ending) return;
    if (!this.player.takeDamage(amount, sourceX)) return;
    this.emitSnapshot(true);
    if (this.player.health <= 0) this.defeatLevel();
  }

  defeatLevel() {
    if (this.status === 'defeat') return;
    this.status = 'defeat';
    this.player.defeat();
    const snapshot = this.getSnapshot();
    eventBus.emit('game:defeat', snapshot);
    eventBus.emit('game:snapshot', snapshot);
  }

  onEnemyDefeated() {
    this.enemiesDefeated += 1;
    this.audioManager.play('enemy-defeat');
    this.emitSnapshot(true);
  }

  showTutorial(id, message, duration) {
    if (this.tutorialsSeen.has(id)) return;
    this.tutorialsSeen.add(id);
    this.tutorialPrompt = message;
    this.tutorialUntil = this.time.now + duration;
  }

  burst(x, y, color, large = false) {
    const requested = large ? 18 : 10;
    const count = this.settings.reducedParticles ? Math.ceil(requested / 3) : requested;
    for (let index = 0; index < count; index += 1) {
      const particle = this.add.image(x, y, 'fallback-particle').setTint(color).setDepth(20);
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-70, 70),
        y: y + Phaser.Math.Between(-70, 20),
        alpha: 0,
        scale: Phaser.Math.FloatBetween(0.5, 1.8),
        duration: Phaser.Math.Between(450, 850),
        onComplete: () => particle.destroy(),
      });
    }
  }

  handleEscape() {
    if (this.status === 'playing') this.pauseGame();
  }

  pauseGame() {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    const snapshot = this.getSnapshot();
    eventBus.emit('game:pause', snapshot);
    eventBus.emit('game:snapshot', snapshot);
    this.scene.pause();
  }

  resumeGame() {
    if (this.status !== 'paused') return;
    this.status = 'playing';
    this.scene.resume();
    this.emitSnapshot(true);
  }

  restartGame() {
    if (this.status === 'paused') this.scene.resume();
    this.scene.restart();
  }

  returnToMenu() {
    this.audioManager.stopAll();
  }

  setMuted(muted) {
    this.settings.muted = Boolean(muted);
    this.audioManager.setMuted(muted);
  }

  setSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    this.audioManager.setMuted(this.settings.muted);
    this.game.registry.set('settings', this.settings);
  }

  getElapsedMs() {
    return Math.max(0, this.time.now - this.startedAt);
  }

  getSnapshot() {
    return {
      status: this.status,
      levelId: LEVEL_IDS.bakery,
      levelName: 'La Panadería Hundida',
      health: this.player?.health ?? PLAYER.maxHealth,
      maxHealth: PLAYER.maxHealth,
      oxygen: Math.round(this.oxygenSystem?.value ?? OXYGEN.max),
      maxOxygen: OXYGEN.max,
      yeastCollected: this.inventory?.totalCollected ?? 0,
      yeastAvailable: this.inventory?.availableYeast ?? 0,
      yeastRequired: RECIPE.yeastRequired,
      thermalBread: this.recipeSystem?.hasThermalBread ?? false,
      pressureBread: false,
      breadReady: this.recipeSystem?.hasThermalBread ?? false,
      breadName: 'Pan Térmico',
      regulatorsActive: 0,
      regulatorsRequired: 0,
      checkpointActive: false,
      objective: this.objective,
      prompt: this.contextPrompt || this.tutorialPrompt,
      elapsedMs: this.getElapsedMs(),
      enemiesDefeated: this.enemiesDefeated,
      lowOxygen: this.oxygenSystem?.isLow() ?? false,
      damageTaken: 0,
      checkpointsUsed: 0,
      fallbacksUsed: [],
    };
  }

  emitSnapshot(force = false, now = this.time.now) {
    if (!force && now - this.lastSnapshotAt < 250) return;
    this.lastSnapshotAt = now;
    eventBus.emit('game:snapshot', this.getSnapshot());
  }

  shutdown() {
    this.input.keyboard.off('keydown-ESC', this.handleEscape, this);
    this.audioManager?.stopAll();
    this.debugOverlay?.destroy();
  }
}
