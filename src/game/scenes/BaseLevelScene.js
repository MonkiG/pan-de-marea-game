import Phaser from 'phaser';
import { AssetResolver } from '../assets/AssetResolver.js';
import { AbyssalSpitter } from '../entities/AbyssalSpitter.js';
import { BlackCoralSentinel } from '../entities/BlackCoralSentinel.js';
import { BrineCrawler } from '../entities/BrineCrawler.js';
import { BubbleYeast } from '../entities/BubbleYeast.js';
import { Player } from '../entities/Player.js';
import { PressureRegulator } from '../entities/PressureRegulator.js';
import { CorruptedDoughProjectile } from '../projectiles/CorruptedDoughProjectile.js';
import { DEBUG_LEVEL_LAYOUT, PLAYER, SPITTER } from '../constants.js';
import { eventBus } from '../EventBus.js';
import { AudioManager } from '../systems/AudioManager.js';
import { CheckpointSystem } from '../systems/CheckpointSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { MarketProgressionSystem } from '../systems/MarketProgressionSystem.js';
import { OxygenSystem } from '../systems/OxygenSystem.js';
import { PressureRecipeSystem } from '../systems/PressureRecipeSystem.js';
import { sessionProgress } from '../systems/SessionProgress.js';
import { validateJumpLink } from '../systems/JumpReachSystem.js';
import { resolveLevelPlacements, validateLevelSupports } from '../systems/LevelSupportSystem.js';
import { createParallaxBackground } from '../art/backgroundLayout.js';
import { createPixelFloor, createPixelPlatform, hasPixelTileset, playPixelEffect } from '../art/levelArt.js';

/**
 * Escena base de un nivel de Pan de Marea, dirigida por datos.
 *
 * Cada nivel concreto extiende esta clase y aporta su definición mediante
 * `getConfig()`. Todas las mecánicas avanzadas (escupemasas, proyectiles,
 * cobertura, corrientes, peligros, reguladores, checkpoint, jefe) se crean
 * sólo si la clave correspondiente existe en los datos del nivel, de modo que
 * un tutorial ligero y una escalada densa comparten exactamente el mismo motor.
 */
export class BaseLevelScene extends Phaser.Scene {
  /**
   * @returns {object} definición del nivel. Debe incluir al menos:
   *   levelId, levelName, data, oxygenConfig, yeastRequired, regulatorsRequired,
   *   bakeTimeMs, breadName, breadKind ('thermal'|'pressure'), objectives,
   *   hasSentinel, audio {oven, exit}, exitLockedPrompt, camera, background,
   *   yeastRecovery, stationRecovery, lowOxygenHint.
   */
  getConfig() {
    throw new Error('getConfig() debe implementarse en la subclase del nivel.');
  }

  create(data = {}) {
    this.config = this.getConfig();
    this.levelId = this.config.levelId;
    const supportErrors = validateLevelSupports(this.config.data);
    if (supportErrors.length > 0) {
      throw new Error(`[${this.config.levelName}] Layout sin apoyo:\n${supportErrors.join('\n')}`);
    }
    this.levelData = resolveLevelPlacements(this.config.data);
    this.objectives = this.config.objectives;

    this.game.registry.set('currentLevel', this.levelId);
    this.status = 'playing';
    this.settings = {
      muted: false,
      screenShake: true,
      reducedParticles: false,
      ...(this.game.registry.get('settings') ?? {}),
    };
    this.assetResolver = new AssetResolver(this.textures, (payload) => eventBus.emit('fallback:used', payload));
    this.audioManager = new AudioManager(this);
    this.audioManager.setMuted(this.settings.muted);
    this.inventory = new InventorySystem();
    this.oxygenSystem = new OxygenSystem(this.config.oxygenConfig);
    this.progression = new MarketProgressionSystem(this.config.regulatorsRequired);
    this.recipeSystem = new PressureRecipeSystem(this.config.yeastRequired, this.config.regulatorsRequired);
    this.checkpointSystem = new CheckpointSystem();

    this.restoreFromCheckpoint(data);

    this.physics.world.setBounds(0, 0, this.levelData.worldWidth, this.levelData.worldHeight);
    this.cameras.main.setBounds(0, 0, this.levelData.worldWidth, this.levelData.worldHeight);
    this.createBackground();
    this.createGeometry();
    this.createAmbientDetails();

    const spawn = this.getSpawnPoint();
    this.player = new Player(this, spawn.x, spawn.y);
    this.createCollectibles();
    this.createEnemies();
    this.createProjectiles();
    this.createRegulators();
    this.oven = this.createOven();
    this.exitObject = this.createExit();
    this.createOxygenSources();
    this.createCheckpoint();
    this.createHazardsAndCurrents();
    this.createPhysicsLinks();
    this.configureCamera();
    this.validateTraversal();
    this.createDebugLayout();

    this.input.keyboard.addCapture([
      'UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE', 'A', 'D', 'W', 'J', 'X', 'E', 'ENTER', 'ESC',
    ]);
    this.input.keyboard.on('keydown-ESC', this.handleEscape, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.emitSnapshot(true);
    eventBus.emit('level:started', { levelId: this.levelId });
    eventBus.emit('game:ready', this.getSnapshot());
  }

  getSpawnPoint() {
    if (this.restoredState?.spawn) return this.restoredState.spawn;
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const reviewX = Number(new URLSearchParams(window.location.search).get('review-x'));
      if (Number.isFinite(reviewX) && reviewX > 0) {
        return {
          ...this.levelData.spawn,
          x: Phaser.Math.Clamp(reviewX, 60, this.levelData.worldWidth - 60),
        };
      }
    }
    return this.levelData.spawn;
  }

  restoreFromCheckpoint(data) {
    const checkpointKey = `${this.levelId}-checkpoint`;
    const storedCheckpoint = data.resumeFromCheckpoint ? this.game.registry.get(checkpointKey) : null;
    if (!data.resumeFromCheckpoint) this.game.registry.remove(checkpointKey);
    const restored = storedCheckpoint?.state ?? null;
    this.restoredState = restored;
    if (storedCheckpoint) this.checkpointSystem.activate(storedCheckpoint.id, restored);

    this.collectedYeastIds = new Set(restored?.collectedYeastIds ?? []);
    this.defeatedEnemyIds = new Set(restored?.defeatedEnemyIds ?? []);
    this.usedOxygenStations = new Set(restored?.usedOxygenStations ?? []);
    this.inventory.totalCollected = restored?.totalCollected ?? 0;
    this.inventory.availableYeast = restored?.availableYeast ?? 0;
    this.progression.restore(restored?.activeRegulatorIds ?? []);
    this.recipeSystem.restore(restored?.recipe ?? {});
    this.oxygenSystem.value = restored?.oxygen ?? this.config.oxygenConfig.max;
    this.enemiesDefeated = restored?.enemiesDefeated ?? 0;
    this.damageTaken = restored?.damageTaken ?? 0;
    this.checkpointsUsed = restored?.checkpointsUsed ?? 0;
    this.checkpointActive = Boolean(storedCheckpoint);
    this.sentinelDefeated = this.config.hasSentinel
      ? this.defeatedEnemyIds.has(this.levelData.sentinel?.id)
      : true;
    this.startedAt = this.time.now - (restored?.elapsedMs ?? 0);
    this.lastSnapshotAt = -Infinity;
    this.objective = restored?.objective ?? this.objectives.explore;
    this.contextPrompt = '';
    this.tutorialPrompt = '';
    this.tutorialUntil = 0;
    this.tutorialsSeen = new Set(restored?.tutorialsSeen ?? []);
    this.ending = false;
  }

  createBackground() {
    const { baseColor, overlayColor, layers, resolveTexture } = this.config.background;
    createParallaxBackground(this, {
      worldWidth: this.levelData.worldWidth,
      worldHeight: this.levelData.worldHeight,
      baseColor,
      overlayColor,
      layers,
      resolveTexture: (layer) => resolveTexture(layer, this),
    });
  }

  createGeometry() {
    this.walkableSurfaces = this.add.group();
    this.solidObstacles = this.add.group();
    const pixelTiles = hasPixelTileset(this);
    const texture = this.assetResolver.resolve(
      'sharedTileset', 'fallback-platform', [pixelTiles ? 'tile-platform-center' : 'tile-platform-long'],
    );
    const floorFrame = texture === 'tileset' ? 'tile-platform-long' : undefined;
    if (pixelTiles) {
      createPixelFloor(this, {
        texture, worldWidth: this.levelData.worldWidth, top: this.levelData.collision.floorTop, depth: 8,
      });
    } else {
      const floorY = this.levelData.collision.floorTop + this.levelData.collision.floorHeight / 2;
      for (let x = 160; x < this.levelData.worldWidth; x += 318) {
        this.add.image(x, floorY, texture, floorFrame)
          .setDisplaySize(320, this.levelData.collision.floorHeight).setDepth(8);
      }
    }
    this.createOneWaySurface(
      this.levelData.worldWidth / 2,
      this.levelData.collision.floorTop,
      this.levelData.worldWidth,
      this.levelData.collision.floorHeight,
    );
    this.levelData.platforms.forEach((platform) => {
      this.createFloatingPlatform(platform, { texture, pixelTiles, floorFrame });
    });

    this.createDecorations(texture, pixelTiles);
    this.createCovers();
    if (this.config.hasSentinel && !this.sentinelDefeated) this.createSentinelBarrier();
  }

  createFloatingPlatform(platform, { texture, pixelTiles, floorFrame }) {
    const top = platform.y - platform.height / 2;
    const colliderWidth = platform.width - this.levelData.collision.platformHorizontalInset * 2;

    if (pixelTiles) {
      createPixelPlatform(this, { texture, x: platform.x, top, width: platform.width, depth: 8 });
    } else {
      const frame = texture === 'tileset' && this.textures.get(texture).has(platform.frame)
        ? platform.frame
        : floorFrame;
      this.add.image(platform.x, top, texture, frame)
        .setOrigin(0.5, 0)
        .setDisplaySize(platform.width, platform.height)
        .setDepth(8);
    }

    this.createOneWaySurface(
      platform.x,
      top,
      colliderWidth,
      this.levelData.collision.platformThickness,
    );
  }

  /** Decoración ambiental. Sobrescribible por nivel (panadería usa frames del tileset). */
  createDecorations(texture, pixelTiles) {
    const stallTexture = this.assetResolver.resolve('marketStall', 'fallback-market-stall');
    (this.levelData.decorations ?? []).forEach((decoration, index) => {
      const pixelStall = stallTexture === 'market-stalls-sheet';
      const sprite = this.add.image(
        decoration.x, decoration.y, stallTexture, pixelStall ? `market-stall-${index % 5}` : undefined,
      )
        .setOrigin(0.5, 1)
        .setAlpha(0.74)
        .setDepth(6);
      if (pixelStall) sprite.setScale(Math.min(decoration.width / 128, decoration.height / 96));
      else sprite.setDisplaySize(decoration.width, decoration.height);
    });
  }

  createCovers() {
    const covers = this.levelData.covers ?? [];
    if (covers.length === 0) return;
    covers.forEach((cover, index) => {
      if (cover.kind === 'rocks') {
        const texture = this.assetResolver.resolve('sharedTileset', 'fallback-platform', ['tile-rocks']);
        const frame = texture === 'tileset' && this.textures.get(texture).has('tile-rocks')
          ? 'tile-rocks'
          : undefined;
        this.add.image(cover.x, cover.y, texture, frame)
          .setOrigin(0.5, 1)
          .setDisplaySize(cover.width, cover.height)
          .setDepth(9);
        this.createSolidObstacle(
          cover.x,
          cover.y - cover.height * 0.42,
          Math.max(24, cover.width - 18),
          cover.height * 0.84,
        );
        return;
      }
      const stallTexture = this.assetResolver.resolve('marketStall', 'fallback-market-stall');
      const pixelStall = stallTexture === 'market-stalls-sheet';
      const sprite = this.add.image(
        cover.x, cover.y, stallTexture, pixelStall ? `market-stall-${(index + 1) % 5}` : undefined,
      )
        .setOrigin(0.5, 1)
        .setDepth(9);
      if (pixelStall) sprite.setScale(Math.min(cover.width / 128, cover.height / 96));
      else sprite.setDisplaySize(cover.width, cover.height);
      this.createSolidObstacle(
        cover.x, cover.y - sprite.displayHeight / 2, Math.max(24, sprite.displayWidth - 14), sprite.displayHeight,
      );
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

  createSolidObstacle(x, y, width, height) {
    const obstacle = this.add.zone(x, y, width, height);
    this.physics.add.existing(obstacle, true);
    this.solidObstacles.add(obstacle);
    return obstacle;
  }

  createSentinelBarrier() {
    const barrier = this.levelData.sentinelBarrier;
    if (!barrier) return;
    this.barrierVisual = this.add.rectangle(barrier.x, barrier.y, barrier.width, barrier.height, 0x10272e, 0.94)
      .setStrokeStyle(3, 0x36d6c0)
      .setDepth(11);
    this.sentinelBarrier = this.createSolidObstacle(barrier.x, barrier.y, barrier.width, barrier.height);
  }

  removeSentinelBarrier() {
    this.sentinelBarrier?.destroy();
    this.barrierVisual?.destroy();
    this.sentinelBarrier = null;
    this.barrierVisual = null;
  }

  createAmbientDetails() {
    const dense = this.levelData.worldHeight > 400;
    const base = dense ? 44 : 22;
    const count = this.settings.reducedParticles ? Math.ceil(base / 2.6) : base;
    for (let index = 0; index < count; index += 1) {
      const bubble = this.add.circle(
        Phaser.Math.Between(60, this.levelData.worldWidth - 60),
        Phaser.Math.Between(80, this.levelData.worldHeight - 40),
        Phaser.Math.Between(1, 3),
        0xb7fff3,
        Phaser.Math.FloatBetween(0.1, 0.32),
      ).setDepth(5);
      const rise = dense ? Phaser.Math.Between(70, 150) : Phaser.Math.Between(45, 105);
      this.tweens.add({
        targets: bubble,
        y: bubble.y - rise,
        alpha: 0,
        duration: Phaser.Math.Between(2800, 6000),
        delay: Phaser.Math.Between(0, 2200),
        repeat: -1,
        onRepeat: () => {
          bubble.y += rise;
          bubble.alpha = Phaser.Math.FloatBetween(0.1, 0.32);
        },
      });
    }
  }

  createCollectibles() {
    this.yeasts = this.add.group();
    (this.levelData.collectibles ?? [])
      .filter((item) => !this.collectedYeastIds.has(item.id))
      .forEach((item) => this.yeasts.add(new BubbleYeast(this, item)));
  }

  createEnemies() {
    this.enemies = this.add.group();
    const withGravity = this.levelData.worldHeight > 400;
    (this.levelData.crawlers ?? this.levelData.enemies ?? [])
      .filter((enemy) => !this.defeatedEnemyIds.has(enemy.id))
      .forEach((enemy) => {
        const crawler = new BrineCrawler(this, enemy, this.player, (target) => this.onEnemyDefeated(target));
        if (withGravity) crawler.body.setGravityY(PLAYER.gravity);
        this.enemies.add(crawler);
      });
    (this.levelData.spitters ?? [])
      .filter((enemy) => !this.defeatedEnemyIds.has(enemy.id))
      .forEach((enemy) => {
        const spitter = new AbyssalSpitter(
          this,
          enemy,
          this.player,
          this.assetResolver,
          (...args) => this.fireProjectile(...args),
          (target) => this.onEnemyDefeated(target),
        );
        if (withGravity) spitter.body.setGravityY(PLAYER.gravity);
        this.enemies.add(spitter);
      });
    if (this.config.hasSentinel && this.levelData.sentinel && !this.sentinelDefeated) {
      this.sentinel = new BlackCoralSentinel(
        this,
        this.levelData.sentinel,
        this.player,
        this.assetResolver,
        (target) => this.onEnemyDefeated(target),
      );
      if (withGravity) this.sentinel.body.setGravityY(PLAYER.gravity);
      this.enemies.add(this.sentinel);
    }
  }

  createProjectiles() {
    this.projectileTexture = this.assetResolver.resolve('corruptedDoughProjectile', 'fallback-projectile');
    this.projectiles = this.physics.add.group({
      classType: CorruptedDoughProjectile,
      maxSize: 12,
      runChildUpdate: false,
    });
  }

  createRegulators() {
    this.regulators = (this.levelData.regulators ?? []).map((regulator) => new PressureRegulator(
      this,
      regulator,
      this.assetResolver,
      this.progression.activeRegulators.has(regulator.id),
    ));
  }

  /** Sobrescribible: crea el horno del nivel. */
  createOven() {
    return null;
  }

  /** Sobrescribible: crea la compuerta/salida del nivel. */
  createExit() {
    return null;
  }

  createOxygenSources() {
    this.oxygenStationZones = this.add.group();
    const stations = this.levelData.oxygenStations
      ?? (this.levelData.oxygenVent ? [{ id: 'vent', ...this.levelData.oxygenVent }] : []);
    const texture = this.assetResolver.resolve('oxygenVent', 'fallback-regulator', ['oxygen-vent-0']);
    stations.forEach((station) => {
      const pixelVent = texture === 'oxygen-vent-sheet';
      const sprite = this.add.sprite(
        station.x, station.y, texture, pixelVent ? 'oxygen-vent-0' : undefined,
      ).setOrigin(0.5, 1).setDepth(10);
      if (pixelVent && this.anims.exists('oxygen-vent-animation')) sprite.play('oxygen-vent-animation');
      else sprite.setTint(0x8dfff3);
      if (this.usedOxygenStations.has(station.id)) sprite.setAlpha(0.3);
      const zone = this.add.zone(station.x, station.y - 30, station.radius * 2, 100);
      zone.stationId = station.id;
      zone.stationSprite = sprite;
      this.physics.add.existing(zone, true);
      this.oxygenStationZones.add(zone);
    });
  }

  createCheckpoint() {
    const data = this.levelData.checkpoint;
    if (!data) {
      this.checkpointZone = null;
      return;
    }
    const texture = this.assetResolver.resolve('marketCheckpoint', 'fallback-checkpoint');
    const pixelCheckpoint = texture === 'market-checkpoint-sheet';
    this.checkpointSprite = this.add.image(
      data.x, data.y, texture, pixelCheckpoint ? `market-checkpoint-${this.checkpointActive ? 2 : 0}` : undefined,
    ).setOrigin(0.5, 1).setDepth(10);
    if (this.checkpointActive && !pixelCheckpoint) this.checkpointSprite.setTint(0xffcc72);
    this.checkpointZone = this.add.zone(data.x, data.y - 30, data.radius * 2, 100);
    this.physics.add.existing(this.checkpointZone, true);
  }

  createHazardsAndCurrents() {
    this.hazardZones = this.add.group();
    const hazardTexture = this.assetResolver.resolve('blackCoralHazard', 'fallback-hazard');
    (this.levelData.hazards ?? []).forEach((hazard, index) => {
      const pixelHazard = hazardTexture === 'black-coral-hazard-sheet';
      if (pixelHazard) {
        this.add.tileSprite(
          hazard.x, hazard.y, hazard.width, 32, hazardTexture, `black-coral-hazard-${index % 4}`,
        ).setOrigin(0.5, 1).setDepth(10);
      } else {
        this.add.image(hazard.x, hazard.y, hazardTexture)
          .setDisplaySize(hazard.width, hazard.height).setOrigin(0.5, 1).setDepth(10);
      }
      const collisionHeight = pixelHazard ? 32 : hazard.height;
      const zone = this.add.zone(hazard.x, hazard.y - collisionHeight / 2, hazard.width, collisionHeight);
      zone.hazardId = hazard.id;
      this.physics.add.existing(zone, true);
      this.hazardZones.add(zone);
    });
    this.currentVisuals = (this.levelData.currents ?? []).map((current) => {
      const visual = this.add.rectangle(current.x, current.y, current.width, current.height, 0x72e4da, 0.035)
        .setStrokeStyle(1, 0x72e4da, 0.12)
        .setDepth(4);
      this.tweens.add({ targets: visual, alpha: 0.11, yoyo: true, repeat: -1, duration: 1300 });
      return visual;
    });
  }

  createPhysicsLinks() {
    this.physics.add.collider(this.player, this.walkableSurfaces);
    this.physics.add.collider(this.player, this.solidObstacles);
    this.physics.add.collider(this.enemies, this.walkableSurfaces);
    this.physics.add.collider(this.enemies, this.solidObstacles);
    this.physics.add.collider(this.projectiles, this.solidObstacles, (projectile) => this.splashProjectile(projectile));
    this.physics.add.overlap(this.player, this.yeasts, (_player, yeast) => this.collectYeast(yeast));
    this.physics.add.overlap(this.player.attackZone, this.enemies, (_zone, enemy) => {
      this.player.hitEnemy(enemy);
    });
    this.physics.add.overlap(this.player, this.projectiles, (_player, projectile) => {
      if (!projectile.active) return;
      this.damagePlayer(SPITTER.projectileDamage, projectile.x);
      this.splashProjectile(projectile);
    });
    this.physics.add.overlap(this.player, this.oxygenStationZones, (_player, station) => this.useOxygenStation(station));
    if (this.checkpointZone) {
      this.physics.add.overlap(this.player, this.checkpointZone, () => this.activateCheckpoint());
    }
    this.physics.add.overlap(this.player, this.hazardZones, (_player, hazard) => this.damagePlayer(1, hazard.x));
  }

  configureCamera() {
    const cam = this.config.camera;
    const camera = this.cameras.main;
    camera.startFollow(this.player, true, cam.lerpX, cam.lerpY);
    camera.setDeadzone(cam.deadzoneX, cam.deadzoneY);
    camera.setFollowOffset(cam.offsetX, cam.offsetY);
    camera.roundPixels = true;
  }

  update(time, delta) {
    if (this.status !== 'playing') return;
    this.player.update(time, delta);
    this.enemies.children.each((enemy) => enemy?.update(time, delta));
    this.yeasts.children.each((yeast) => yeast?.updateAttraction(this.player));
    this.projectiles.children.each((projectile) => projectile?.update(time, delta));
    this.applyCurrents(delta);

    const desiredOffset = this.player.facing > 0 ? this.config.camera.offsetX : -this.config.camera.offsetX;
    this.cameras.main.followOffset.x = Phaser.Math.Linear(this.cameras.main.followOffset.x, desiredOffset, 0.04);
    const oxygen = this.oxygenSystem.tick(delta, !this.ending);
    for (let index = 0; index < oxygen.damageCount; index += 1) this.damagePlayer(1, this.player.x);

    this.updateTutorials(time);
    this.updateInteractions();
    this.oven?.setAvailable(this.canBake());
    this.emitSnapshot(false, time);
  }

  applyCurrents(delta) {
    (this.levelData.currents ?? []).forEach((current) => {
      const bounds = new Phaser.Geom.Rectangle(
        current.x - current.width / 2,
        current.y - current.height / 2,
        current.width,
        current.height,
      );
      if (!bounds.contains(this.player.x, this.player.y)) return;
      this.player.setVelocity(
        Phaser.Math.Clamp(this.player.body.velocity.x + current.forceX * delta / 1000, -PLAYER.maxRunSpeed, PLAYER.maxRunSpeed),
        Phaser.Math.Clamp(this.player.body.velocity.y + current.forceY * delta / 1000, -PLAYER.maxFallSpeed, PLAYER.maxFallSpeed),
      );
    });
  }

  hasLineOfSight(enemy, target) {
    const line = new Phaser.Geom.Line(enemy.x, enemy.y - 18, target.x, target.y - 30);
    return !this.solidObstacles.getChildren().some((obstacle) => {
      const body = obstacle.body;
      if (!body?.enable) return false;
      return Phaser.Geom.Intersects.LineToRectangle(
        line,
        new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height),
      );
    });
  }

  fireProjectile(spitter, targetX, targetY) {
    const projectile = this.projectiles.get(spitter.x + spitter.direction * 34, spitter.y - 26);
    if (!projectile) return false;
    const aim = new Phaser.Math.Vector2(
      targetX - projectile.x,
      targetY + Phaser.Math.Between(-22, 22) - projectile.y,
    ).normalize().scale(SPITTER.projectileSpeed);
    projectile.fire(projectile.x, projectile.y, aim.x, aim.y, spitter);
    this.audioManager.play('spitter-projectile');
    return true;
  }

  splashProjectile(projectile) {
    if (!projectile?.active) return;
    this.burst(projectile.x, projectile.y, 0x7bea4a, false, 5);
    projectile.deactivate();
  }

  updateTutorials(time) {
    (this.levelData.tutorials ?? []).forEach((tutorial) => {
      if (this.player.x >= tutorial.atX) this.showTutorial(tutorial.id, tutorial.message, tutorial.duration ?? 3200);
    });
    if (this.oxygenSystem.isLow()) this.showTutorial('oxygen-low', this.config.lowOxygenHint, 3400);
    if (time >= this.tutorialUntil) this.tutorialPrompt = '';
  }

  /** ¿Puede hornearse ahora mismo? (jefe libre + reguladores + levaduras) */
  canBake() {
    if (this.config.hasSentinel && !this.sentinelDefeated) return false;
    return this.recipeSystem.canCraft(this.inventory, this.progression.activeCount);
  }

  updateInteractions() {
    this.contextPrompt = '';
    const interactPressed = this.player.consumeInteractPressed();
    const nearbyRegulator = this.regulators.find((regulator) => regulator.isNearby(this.player));
    if (nearbyRegulator) {
      if (nearbyRegulator.state === 'active') this.contextPrompt = 'Regulador activo';
      else if (nearbyRegulator.state === 'activating') this.contextPrompt = 'Regulando presión…';
      else {
        this.contextPrompt = 'Presiona E para activar el regulador';
        this.objective = this.objectives.regulators ?? this.objective;
        if (interactPressed) this.activateRegulator(nearbyRegulator);
      }
      return;
    }

    if (this.oven?.isNearby(this.player)) {
      if (this.config.hasSentinel && !this.sentinelDefeated) {
        this.contextPrompt = this.config.ovenBlockedByBossPrompt ?? 'El guardián bloquea la estación';
      } else if (this.recipeSystem.completed) {
        this.contextPrompt = `El ${this.config.breadName} está listo`;
      } else if (!this.progression.allRegulatorsActive) {
        const missing = this.config.regulatorsRequired - this.progression.activeCount;
        this.contextPrompt = `Faltan ${missing} regulador${missing === 1 ? '' : 'es'}`;
      } else if (!this.inventory.canSpend(this.config.yeastRequired)) {
        const missing = this.config.yeastRequired - this.inventory.availableYeast;
        this.contextPrompt = `Faltan ${missing} Levadura${missing === 1 ? '' : 's'}`;
      } else {
        this.contextPrompt = `Presiona E para preparar el ${this.config.breadName}`;
        this.objective = this.objectives.bake;
        if (interactPressed) this.startBaking();
      }
      return;
    }

    if (this.exitObject?.isNearby(this.player)) {
      if (!this.progression.canUnlockExit(this.recipeSystem.hasPressureBread)) {
        this.contextPrompt = this.config.exitLockedPrompt;
      } else {
        this.contextPrompt = 'Presiona E para abrir la salida';
        if (interactPressed) this.activateExit();
      }
    }
  }

  nextResourceObjective() {
    if (!this.progression.allRegulatorsActive) return this.objectives.regulators ?? this.objectives.collect;
    if (this.config.hasSentinel && !this.sentinelDefeated) return this.objectives.boss ?? this.objectives.oven;
    return this.objectives.oven;
  }

  collectYeast(yeast) {
    const id = yeast?.id;
    if (!yeast?.collect(() => {
      this.collectedYeastIds.add(id);
      this.inventory.collect();
      this.oxygenSystem.recover(this.config.yeastRecovery);
      this.audioManager.play('collect');
      this.burst(yeast.x, yeast.y, 0xffca57);
      this.objective = this.inventory.totalCollected >= this.config.yeastRequired
        ? this.nextResourceObjective()
        : this.objectives.collect;
      this.emitSnapshot(true);
    })) return;
  }

  activateRegulator(regulator) {
    this.player.setControlsEnabled(false);
    regulator.activate(() => {
      this.progression.activateRegulator(regulator.id);
      this.player.setControlsEnabled(true);
      this.audioManager.play('regulator');
      this.cameras.main.shake(220, this.settings.screenShake ? 0.008 : 0);
      this.burst(regulator.x, regulator.y - 35, 0x6fffe4, true, 12);
      eventBus.emit('regulator:activated', { id: regulator.id, count: this.progression.activeCount });
      this.objective = this.progression.allRegulatorsActive
        ? (this.inventory.totalCollected >= this.config.yeastRequired
          ? this.nextResourceObjective() : this.objectives.collect)
        : (this.objectives.regulators ?? this.objective);
      this.emitSnapshot(true);
    });
  }

  useOxygenStation(station) {
    if (this.usedOxygenStations.has(station.stationId)) return;
    this.usedOxygenStations.add(station.stationId);
    station.stationSprite?.setAlpha(0.3);
    this.oxygenSystem.recover(this.config.stationRecovery);
    this.audioManager.play('oxygen-station');
    this.burst(station.x, station.y, 0x82fff1, true, 12);
    this.showTutorial('vent', 'Respiras una corriente de aire antiguo', 2600);
    this.emitSnapshot(true);
  }

  activateCheckpoint() {
    if (this.checkpointActive) return;
    this.checkpointActive = true;
    this.checkpointsUsed += 1;
    if (this.checkpointSprite?.texture.key === 'market-checkpoint-sheet') {
      this.checkpointSprite.setFrame('market-checkpoint-2').clearTint();
    } else this.checkpointSprite?.setTint(0xffcc72);
    const checkpoint = this.levelData.checkpoint;
    const state = this.getCheckpointState({ x: checkpoint.x, y: this.levelData.spawn.y });
    this.checkpointSystem.activate(checkpoint.id, state);
    this.game.registry.set(`${this.levelId}-checkpoint`, this.checkpointSystem.getSnapshot());
    this.audioManager.play('checkpoint');
    this.burst(checkpoint.x, checkpoint.y - 35, 0xffcf78, true, 14);
    eventBus.emit('level:checkpoint', { id: checkpoint.id });
    this.showTutorial('checkpoint', 'Checkpoint activado', 2500);
    this.emitSnapshot(true);
  }

  getCheckpointState(spawn) {
    return {
      spawn,
      activeRegulatorIds: [...this.progression.activeRegulators],
      collectedYeastIds: [...this.collectedYeastIds],
      defeatedEnemyIds: [...this.defeatedEnemyIds],
      usedOxygenStations: [...this.usedOxygenStations],
      totalCollected: this.inventory.totalCollected,
      availableYeast: this.inventory.availableYeast,
      recipe: {
        completed: this.recipeSystem.completed,
        hasPressureBread: this.recipeSystem.hasPressureBread,
      },
      oxygen: this.config.oxygenConfig.max,
      elapsedMs: this.getElapsedMs(),
      enemiesDefeated: this.enemiesDefeated,
      damageTaken: this.damageTaken,
      checkpointsUsed: this.checkpointsUsed,
      objective: this.objective,
      tutorialsSeen: [...this.tutorialsSeen],
    };
  }

  startBaking() {
    if (!this.canBake()) return;
    this.player.setControlsEnabled(false);
    this.contextPrompt = `Horneando ${this.config.breadName}…`;
    this.audioManager.play(this.config.audio.oven);
    this.oven.bake(this.config.bakeTimeMs, () => {
      if (!this.recipeSystem.craft(this.inventory, this.progression.activeCount)) {
        this.player.setControlsEnabled(true);
        return;
      }
      this.player.setControlsEnabled(true);
      this.objective = this.objectives.exit;
      this.contextPrompt = `¡${this.config.breadName} preparado!`;
      this.burst(this.oven.x, this.oven.y - 50, 0xffbd5f, true, 18);
      this.emitSnapshot(true);
    });
  }

  activateExit() {
    if (!this.progression.canUnlockExit(this.recipeSystem.hasPressureBread)) return;
    if (!this.recipeSystem.consumePressureBread()) return;
    this.ending = true;
    this.player.setControlsEnabled(false);
    this.contextPrompt = 'Estabilizando la salida…';
    this.audioManager.play(this.config.audio.exit);
    this.exitObject.activate(() => {
      this.cameras.main.stopFollow();
      this.cameras.main.pan(this.exitObject.x, this.exitObject.y - 70, 900, 'Sine.easeInOut');
      this.cameras.main.shake(520, this.settings.screenShake ? 0.012 : 0);
      this.burst(this.exitObject.x, this.exitObject.y - 80, 0x72ffe0, true, 22);
      this.objective = this.objectives.complete;
      this.contextPrompt = this.config.exitOpenPrompt ?? 'La ruta al siguiente sector está abierta';
      this.time.delayedCall(1300, () => this.completeLevel());
    });
    this.emitSnapshot(true);
  }

  onEnemyDefeated(enemy) {
    if (!enemy?.id || this.defeatedEnemyIds.has(enemy.id)) return;
    this.defeatedEnemyIds.add(enemy.id);
    this.enemiesDefeated += 1;
    this.audioManager.play('enemy-defeat');
    eventBus.emit('enemy:defeated', { id: enemy.id, levelId: this.levelId });
    if (this.config.hasSentinel && enemy.id === this.levelData.sentinel?.id) {
      this.sentinelDefeated = true;
      this.removeSentinelBarrier();
      this.cameras.main.shake(420, this.settings.screenShake ? 0.012 : 0);
      this.objective = this.objectives.oven;
      this.showTutorial('sentinel-down', 'La estación de presión está libre', 3000);
    }
    this.emitSnapshot(true);
  }

  damagePlayer(amount, sourceX) {
    if (this.status !== 'playing' || this.ending) return;
    if (!this.player.takeDamage(amount, sourceX)) return;
    this.damageTaken += amount;
    this.emitSnapshot(true);
    eventBus.emit('player:damaged', { amount, health: this.player.health });
    if (this.player.health <= 0) this.defeatLevel();
  }

  completeLevel() {
    if (this.status === 'complete') return;
    this.status = 'complete';
    this.player.setControlsEnabled(false);
    this.cameras.main.fadeOut(700, 2, 18, 22);
    this.game.registry.remove(`${this.levelId}-checkpoint`);
    this.completionProgression = sessionProgress.completeLevel(this.levelId, {
      elapsedMs: this.getElapsedMs(),
      enemiesDefeated: this.enemiesDefeated,
      damageTaken: this.damageTaken,
      yeastCollected: this.inventory.totalCollected,
    });
    const snapshot = this.getSnapshot();
    eventBus.emit('level:completed', snapshot);
    eventBus.emit('game:complete', snapshot);
    eventBus.emit('game:snapshot', snapshot);
  }

  defeatLevel() {
    if (this.status === 'defeat') return;
    this.status = 'defeat';
    this.player.defeat();
    const snapshot = this.getSnapshot();
    eventBus.emit('level:failed', snapshot);
    eventBus.emit('game:defeat', snapshot);
    eventBus.emit('game:snapshot', snapshot);
  }

  validateTraversal() {
    const platforms = new Map(this.levelData.platforms.map((platform) => [platform.id, platform]));
    (this.levelData.jumpLinks ?? []).forEach((link) => {
      const from = platforms.get(link.from);
      const to = platforms.get(link.to);
      if (!from || !to) return;
      const result = validateJumpLink(from, to, PLAYER);
      if (!result.reachable) {
        console.warn(`[${this.levelData.name ?? this.levelId}] Salto ${link.from} -> ${link.to} excede el margen seguro.`);
      }
    });
  }

  createDebugLayout() {
    if (!DEBUG_LEVEL_LAYOUT) return;
    this.debugGraphics = this.add.graphics().setDepth(1000);
    this.debugGraphics.lineStyle(1, 0x5effdb, 0.9);
    this.walkableSurfaces.getChildren().forEach(({ body }) => {
      if (body?.enable) this.debugGraphics.strokeRect(body.x, body.y, body.width, body.height);
    });
    this.debugGraphics.lineStyle(1, 0xff5c6f, 0.9);
    this.solidObstacles.getChildren().forEach(({ body }) => {
      if (body?.enable) this.debugGraphics.strokeRect(body.x, body.y, body.width, body.height);
    });
  }

  showTutorial(id, message, duration) {
    if (this.tutorialsSeen.has(id) || !message) return;
    this.tutorialsSeen.add(id);
    this.tutorialPrompt = message;
    this.tutorialUntil = this.time.now + duration;
  }

  burst(x, y, color, large = false, overrideCount = null) {
    const effectType = color === 0xffca57 ? 'yeast'
      : color === 0xffcf78 || color === 0xffbd5f ? 'warm'
        : color === 0x7bea4a ? 'hit' : 'pressure';
    if (playPixelEffect(this, x, y, effectType)) return;
    const requested = overrideCount ?? (large ? 18 : 10);
    const count = this.settings.reducedParticles ? Math.ceil(requested / 3) : requested;
    for (let index = 0; index < count; index += 1) {
      const particle = this.add.image(x, y, 'fallback-particle').setTint(color).setDepth(20);
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-75, 75),
        y: y + Phaser.Math.Between(-80, 24),
        alpha: 0,
        scale: Phaser.Math.FloatBetween(0.5, 1.8),
        duration: Phaser.Math.Between(450, 900),
        onComplete: () => particle.destroy(),
      });
    }
  }

  handleEscape() {
    if (this.status === 'playing') this.pauseGame();
  }

  pauseGame() {
    if (this.status !== 'playing') return;
    this.audioManager.stopAll();
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
    const checkpointKey = `${this.levelId}-checkpoint`;
    const fromCheckpoint = this.status === 'defeat' && Boolean(this.game.registry.get(checkpointKey));
    if (!fromCheckpoint) this.game.registry.remove(checkpointKey);
    this.scene.restart({ resumeFromCheckpoint: fromCheckpoint });
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
    const hasBread = this.recipeSystem?.hasPressureBread ?? false;
    return {
      status: this.status,
      levelId: this.levelId,
      levelName: this.config.levelName,
      health: this.player?.health ?? PLAYER.maxHealth,
      maxHealth: PLAYER.maxHealth,
      oxygen: Math.round(this.oxygenSystem?.value ?? this.config.oxygenConfig.max),
      maxOxygen: this.config.oxygenConfig.max,
      yeastCollected: this.inventory?.totalCollected ?? 0,
      yeastAvailable: this.inventory?.availableYeast ?? 0,
      yeastRequired: this.config.yeastRequired,
      thermalBread: this.config.breadKind === 'thermal' && hasBread,
      pressureBread: this.config.breadKind === 'pressure' && hasBread,
      breadReady: hasBread,
      breadName: this.config.breadName,
      regulatorsActive: this.progression?.activeCount ?? 0,
      regulatorsRequired: this.config.regulatorsRequired,
      checkpointActive: this.checkpointActive,
      objective: this.objective,
      prompt: this.contextPrompt || this.tutorialPrompt,
      elapsedMs: this.getElapsedMs(),
      enemiesDefeated: this.enemiesDefeated,
      damageTaken: this.damageTaken,
      checkpointsUsed: this.checkpointsUsed,
      lowOxygen: this.oxygenSystem?.isLow() ?? false,
      fallbacksUsed: import.meta.env.DEV ? this.assetResolver.getFallbacksUsed() : [],
      progression: this.completionProgression,
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
    this.debugGraphics?.destroy();
  }
}
