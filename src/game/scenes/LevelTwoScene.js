import Phaser from 'phaser';
import { AssetResolver } from '../assets/AssetResolver.js';
import { AbyssalSpitter } from '../entities/AbyssalSpitter.js';
import { BlackCoralSentinel } from '../entities/BlackCoralSentinel.js';
import { BrineCrawler } from '../entities/BrineCrawler.js';
import { BubbleYeast } from '../entities/BubbleYeast.js';
import { MarketExit } from '../entities/MarketExit.js';
import { Player } from '../entities/Player.js';
import { PressureOven } from '../entities/PressureOven.js';
import { PressureRegulator } from '../entities/PressureRegulator.js';
import { CorruptedDoughProjectile } from '../projectiles/CorruptedDoughProjectile.js';
import {
  DEBUG_LEVEL_LAYOUT,
  LEVEL_IDS,
  MARKET_OBJECTIVES,
  MARKET_OXYGEN,
  PLAYER,
  PRESSURE_RECIPE,
  SENTINEL,
  SPITTER,
} from '../constants.js';
import { LEVEL_TWO_DATA } from '../data/levelTwoData.js';
import { eventBus } from '../EventBus.js';
import { AudioManager } from '../systems/AudioManager.js';
import { CheckpointSystem } from '../systems/CheckpointSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { MarketProgressionSystem } from '../systems/MarketProgressionSystem.js';
import { OxygenSystem } from '../systems/OxygenSystem.js';
import { PressureRecipeSystem } from '../systems/PressureRecipeSystem.js';
import { sessionProgress } from '../systems/SessionProgress.js';
import { validateJumpLink } from '../systems/JumpReachSystem.js';
import { BACKGROUND_LAYOUTS, createParallaxBackground } from '../art/backgroundLayout.js';
import { createPixelFloor, createPixelPlatform, hasPixelTileset, playPixelEffect } from '../art/levelArt.js';

export class LevelTwoScene extends Phaser.Scene {
  constructor() {
    super(LEVEL_IDS.market);
  }

  create(data = {}) {
    this.game.registry.set('currentLevel', LEVEL_IDS.market);
    this.status = 'playing';
    this.settings = {
      muted: false,
      screenShake: true,
      reducedParticles: false,
      ...(this.game.registry.get('settings') ?? {}),
    };
    this.assetResolver = new AssetResolver(this.textures, (payload) => eventBus.emit('fallback:used', payload));
    this.audioManager = new AudioManager();
    this.audioManager.setMuted(this.settings.muted);
    this.inventory = new InventorySystem();
    this.oxygenSystem = new OxygenSystem(MARKET_OXYGEN);
    this.progression = new MarketProgressionSystem(PRESSURE_RECIPE.regulatorsRequired);
    this.recipeSystem = new PressureRecipeSystem(
      PRESSURE_RECIPE.yeastRequired,
      PRESSURE_RECIPE.regulatorsRequired,
    );
    this.checkpointSystem = new CheckpointSystem();

    const storedCheckpoint = data.resumeFromCheckpoint
      ? this.game.registry.get('level-two-checkpoint')
      : null;
    if (!data.resumeFromCheckpoint) this.game.registry.remove('level-two-checkpoint');
    const restored = storedCheckpoint?.state ?? null;
    if (storedCheckpoint) this.checkpointSystem.activate(storedCheckpoint.id, restored);

    this.collectedYeastIds = new Set(restored?.collectedYeastIds ?? []);
    this.defeatedEnemyIds = new Set(restored?.defeatedEnemyIds ?? []);
    this.usedOxygenStations = new Set(restored?.usedOxygenStations ?? []);
    this.inventory.totalCollected = restored?.totalCollected ?? 0;
    this.inventory.availableYeast = restored?.availableYeast ?? 0;
    this.progression.restore(restored?.activeRegulatorIds ?? []);
    this.recipeSystem.restore(restored?.recipe ?? {});
    this.oxygenSystem.value = restored?.oxygen ?? MARKET_OXYGEN.max;
    this.enemiesDefeated = restored?.enemiesDefeated ?? 0;
    this.damageTaken = restored?.damageTaken ?? 0;
    this.checkpointsUsed = restored?.checkpointsUsed ?? 0;
    this.checkpointActive = Boolean(storedCheckpoint);
    this.sentinelDefeated = this.defeatedEnemyIds.has(LEVEL_TWO_DATA.sentinel.id);
    this.startedAt = this.time.now - (restored?.elapsedMs ?? 0);
    this.lastSnapshotAt = -Infinity;
    this.objective = restored?.objective ?? MARKET_OBJECTIVES.explore;
    this.contextPrompt = '';
    this.tutorialPrompt = '';
    this.tutorialUntil = 0;
    this.tutorialsSeen = new Set(restored?.tutorialsSeen ?? []);
    this.ending = false;

    this.physics.world.setBounds(0, 0, LEVEL_TWO_DATA.worldWidth, LEVEL_TWO_DATA.worldHeight);
    this.cameras.main.setBounds(0, 0, LEVEL_TWO_DATA.worldWidth, LEVEL_TWO_DATA.worldHeight);
    this.createBackground();
    this.createGeometry();
    this.createAmbientDetails();

    const spawn = restored?.spawn ?? LEVEL_TWO_DATA.spawn;
    this.player = new Player(this, spawn.x, spawn.y);
    this.yeasts = this.add.group();
    LEVEL_TWO_DATA.collectibles
      .filter((item) => !this.collectedYeastIds.has(item.id))
      .forEach((item) => this.yeasts.add(new BubbleYeast(this, item)));

    this.enemies = this.add.group();
    LEVEL_TWO_DATA.crawlers
      .filter((enemy) => !this.defeatedEnemyIds.has(enemy.id))
      .forEach((enemy) => {
        const crawler = new BrineCrawler(this, enemy, this.player, (target) => this.onEnemyDefeated(target));
        crawler.body.setGravityY(PLAYER.gravity);
        this.enemies.add(crawler);
      });
    LEVEL_TWO_DATA.spitters
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
        spitter.body.setGravityY(PLAYER.gravity);
        this.enemies.add(spitter);
      });
    if (!this.sentinelDefeated) {
      this.sentinel = new BlackCoralSentinel(
        this,
        LEVEL_TWO_DATA.sentinel,
        this.player,
        this.assetResolver,
        (target) => this.onEnemyDefeated(target),
      );
      this.sentinel.body.setGravityY(PLAYER.gravity);
      this.enemies.add(this.sentinel);
    }

    this.projectileTexture = this.assetResolver.resolve('corruptedDoughProjectile', 'fallback-projectile');
    this.projectiles = this.physics.add.group({
      classType: CorruptedDoughProjectile,
      maxSize: 12,
      runChildUpdate: false,
    });
    this.regulators = LEVEL_TWO_DATA.regulators.map((regulator) => new PressureRegulator(
      this,
      regulator,
      this.assetResolver,
      this.progression.activeRegulators.has(regulator.id),
    ));
    this.pressureOven = new PressureOven(this, LEVEL_TWO_DATA.pressureOven, this.assetResolver);
    this.marketExit = new MarketExit(this, LEVEL_TWO_DATA.exit, this.assetResolver);
    this.createOxygenStations();
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
    this.showTutorial('market-entry', 'Encuentra una salida del mercado', 3400);
    this.emitSnapshot(true);
    eventBus.emit('level:started', { levelId: LEVEL_IDS.market });
    eventBus.emit('game:ready', this.getSnapshot());
  }

  createBackground() {
    createParallaxBackground(this, {
      worldWidth: LEVEL_TWO_DATA.worldWidth,
      worldHeight: LEVEL_TWO_DATA.worldHeight,
      baseColor: 0x053943,
      overlayColor: 0x062c34,
      layers: BACKGROUND_LAYOUTS.market,
      resolveTexture: ({ id }) => this.assetResolver.resolve(id, 'fallback-market-background'),
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
        texture, worldWidth: LEVEL_TWO_DATA.worldWidth, top: LEVEL_TWO_DATA.collision.floorTop, depth: 8,
      });
    } else {
      for (let x = 160; x < LEVEL_TWO_DATA.worldWidth; x += 318) {
        this.add.image(x, 697, texture, floorFrame).setDisplaySize(320, 45).setDepth(8);
      }
    }
    this.createOneWaySurface(
      LEVEL_TWO_DATA.worldWidth / 2,
      LEVEL_TWO_DATA.collision.floorTop,
      LEVEL_TWO_DATA.worldWidth,
      LEVEL_TWO_DATA.collision.floorHeight,
    );
    LEVEL_TWO_DATA.platforms.forEach((platform) => {
      const top = platform.y - platform.height / 2;
      if (pixelTiles) {
        createPixelPlatform(this, { texture, x: platform.x, top, width: platform.width, depth: 8 });
      } else {
        const frame = texture === 'tileset' && this.textures.get(texture).has(platform.frame)
          ? platform.frame
          : floorFrame;
        this.add.image(platform.x, platform.y, texture, frame)
          .setDisplaySize(platform.width, platform.height)
          .setDepth(8);
      }
      this.createOneWaySurface(
        platform.x,
        top,
        platform.width - LEVEL_TWO_DATA.collision.platformHorizontalInset * 2,
        LEVEL_TWO_DATA.collision.platformThickness,
      );
    });

    const stallTexture = this.assetResolver.resolve('marketStall', 'fallback-market-stall');
    LEVEL_TWO_DATA.decorations.forEach((decoration, index) => {
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
    LEVEL_TWO_DATA.covers.forEach((cover, index) => {
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
    if (!this.sentinelDefeated) this.createSentinelBarrier();
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
    const barrier = LEVEL_TWO_DATA.sentinelBarrier;
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
    const count = this.settings.reducedParticles ? 16 : 44;
    for (let index = 0; index < count; index += 1) {
      const bubble = this.add.circle(
        Phaser.Math.Between(60, LEVEL_TWO_DATA.worldWidth - 60),
        Phaser.Math.Between(80, LEVEL_TWO_DATA.worldHeight - 40),
        Phaser.Math.Between(1, 3),
        0xb7fff3,
        Phaser.Math.FloatBetween(0.1, 0.3),
      ).setDepth(5);
      this.tweens.add({
        targets: bubble,
        y: bubble.y - Phaser.Math.Between(70, 150),
        alpha: 0,
        duration: Phaser.Math.Between(3200, 6200),
        delay: Phaser.Math.Between(0, 2200),
        repeat: -1,
        onRepeat: () => {
          bubble.y += Phaser.Math.Between(70, 150);
          bubble.alpha = Phaser.Math.FloatBetween(0.1, 0.3);
        },
      });
    }
  }

  createOxygenStations() {
    this.oxygenStationZones = this.add.group();
    const texture = this.assetResolver.resolve('oxygenVent', 'fallback-regulator', ['oxygen-vent-0']);
    LEVEL_TWO_DATA.oxygenStations.forEach((station) => {
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
    const data = LEVEL_TWO_DATA.checkpoint;
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
    LEVEL_TWO_DATA.hazards.forEach((hazard, index) => {
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
    this.currentVisuals = LEVEL_TWO_DATA.currents.map((current) => {
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
    this.physics.add.collider(this.projectiles, this.walkableSurfaces, (projectile) => this.splashProjectile(projectile));
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
    this.physics.add.overlap(this.player, this.checkpointZone, () => this.activateCheckpoint());
    this.physics.add.overlap(this.player, this.hazardZones, (_player, hazard) => this.damagePlayer(1, hazard.x));
  }

  configureCamera() {
    const camera = this.cameras.main;
    camera.startFollow(this.player, true, 0.075, 0.09);
    camera.setDeadzone(130, 92);
    camera.setFollowOffset(-60, 35);
    camera.roundPixels = true;
  }

  update(time, delta) {
    if (this.status !== 'playing') return;
    this.player.update(time, delta);
    this.enemies.children.each((enemy) => enemy?.update(time, delta));
    this.yeasts.children.each((yeast) => yeast?.updateAttraction(this.player));
    this.projectiles.children.each((projectile) => projectile?.update(time, delta));
    this.applyCurrents(delta);

    const desiredOffset = this.player.facing > 0 ? -60 : 60;
    this.cameras.main.followOffset.x = Phaser.Math.Linear(this.cameras.main.followOffset.x, desiredOffset, 0.04);
    const oxygen = this.oxygenSystem.tick(delta, !this.ending);
    for (let index = 0; index < oxygen.damageCount; index += 1) this.damagePlayer(1, this.player.x);

    this.updateTutorials(time);
    this.updateInteractions();
    this.pressureOven.setAvailable(this.recipeSystem.canCraft(this.inventory, this.progression.activeCount));
    this.emitSnapshot(false, time);
  }

  applyCurrents(delta) {
    LEVEL_TWO_DATA.currents.forEach((current) => {
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
    if (this.player.x > 1500) this.showTutorial('regulators', 'Activa los tres reguladores con E', 3400);
    if (this.player.x > 1760) this.showTutorial('spitter', 'Los enemigos elevados atacan a distancia', 3400);
    if (this.player.x > 1900) this.showTutorial('cover', 'Busca cobertura entre los puestos', 3000);
    if (this.player.x > 5150) this.showTutorial('sentinel', 'Los golpes del Centinela son lentos, pero fuertes', 3600);
    if (this.oxygenSystem.isLow()) this.showTutorial('market-oxygen-low', 'Oxígeno bajo: busca una estación azul', 3300);
    if (time >= this.tutorialUntil) this.tutorialPrompt = '';
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
        this.objective = MARKET_OBJECTIVES.regulators;
        if (interactPressed) this.activateRegulator(nearbyRegulator);
      }
      return;
    }

    if (this.pressureOven.isNearby(this.player)) {
      if (!this.sentinelDefeated) this.contextPrompt = 'El guardián bloquea la estación';
      else if (this.recipeSystem.completed) this.contextPrompt = 'El Pan de Presión está listo';
      else if (!this.progression.allRegulatorsActive) {
        this.contextPrompt = `Faltan ${PRESSURE_RECIPE.regulatorsRequired - this.progression.activeCount} reguladores`;
      } else if (!this.inventory.canSpend(PRESSURE_RECIPE.yeastRequired)) {
        this.contextPrompt = `Faltan ${PRESSURE_RECIPE.yeastRequired - this.inventory.availableYeast} Levaduras`;
      } else {
        this.contextPrompt = 'Presiona E para preparar el Pan de Presión';
        this.objective = MARKET_OBJECTIVES.bake;
        if (interactPressed) this.startBaking();
      }
      return;
    }

    if (this.marketExit.isNearby(this.player)) {
      if (!this.progression.canUnlockExit(this.recipeSystem.hasPressureBread)) {
        this.contextPrompt = 'La salida necesita presión estable y el Pan de Presión';
      } else {
        this.contextPrompt = 'Presiona E para abrir la salida';
        if (interactPressed) this.activateExit();
      }
    }
  }

  collectYeast(yeast) {
    const id = yeast?.id;
    if (!yeast?.collect(() => {
      this.collectedYeastIds.add(id);
      this.inventory.collect();
      this.oxygenSystem.recover(MARKET_OXYGEN.yeastRecovery);
      this.audioManager.play('collect');
      this.burst(yeast.x, yeast.y, 0xffca57);
      if (this.inventory.totalCollected >= PRESSURE_RECIPE.yeastRequired) {
        this.objective = this.progression.allRegulatorsActive ? MARKET_OBJECTIVES.sentinel : MARKET_OBJECTIVES.regulators;
      } else {
        this.objective = MARKET_OBJECTIVES.collect;
      }
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
        ? (this.inventory.totalCollected >= PRESSURE_RECIPE.yeastRequired ? MARKET_OBJECTIVES.sentinel : MARKET_OBJECTIVES.collect)
        : MARKET_OBJECTIVES.regulators;
      this.emitSnapshot(true);
    });
  }

  useOxygenStation(station) {
    if (this.usedOxygenStations.has(station.stationId)) return;
    this.usedOxygenStations.add(station.stationId);
    station.stationSprite?.setAlpha(0.3);
    this.oxygenSystem.recover(MARKET_OXYGEN.stationRecovery);
    this.audioManager.play('oxygen-station');
    this.burst(station.x, station.y, 0x82fff1, true, 12);
    this.emitSnapshot(true);
  }

  activateCheckpoint() {
    if (this.checkpointActive) return;
    this.checkpointActive = true;
    this.checkpointsUsed += 1;
    if (this.checkpointSprite.texture.key === 'market-checkpoint-sheet') {
      this.checkpointSprite.setFrame('market-checkpoint-2').clearTint();
    } else this.checkpointSprite.setTint(0xffcc72);
    const checkpoint = LEVEL_TWO_DATA.checkpoint;
    const state = this.getCheckpointState({ x: checkpoint.x, y: LEVEL_TWO_DATA.spawn.y });
    this.checkpointSystem.activate(checkpoint.id, state);
    this.game.registry.set('level-two-checkpoint', this.checkpointSystem.getSnapshot());
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
      oxygen: MARKET_OXYGEN.max,
      elapsedMs: this.getElapsedMs(),
      enemiesDefeated: this.enemiesDefeated,
      damageTaken: this.damageTaken,
      checkpointsUsed: this.checkpointsUsed,
      objective: this.objective,
      tutorialsSeen: [...this.tutorialsSeen],
    };
  }

  startBaking() {
    if (!this.recipeSystem.canCraft(this.inventory, this.progression.activeCount)) return;
    this.player.setControlsEnabled(false);
    this.contextPrompt = 'Horneando Pan de Presión…';
    this.audioManager.play('pressure-oven');
    this.pressureOven.bake(PRESSURE_RECIPE.bakeTimeMs, () => {
      if (!this.recipeSystem.craft(this.inventory, this.progression.activeCount)) {
        this.player.setControlsEnabled(true);
        return;
      }
      this.player.setControlsEnabled(true);
      this.objective = MARKET_OBJECTIVES.exit;
      this.contextPrompt = '¡Pan de Presión preparado!';
      this.burst(this.pressureOven.x, this.pressureOven.y - 50, 0xffbd5f, true, 18);
      this.emitSnapshot(true);
    });
  }

  activateExit() {
    if (!this.progression.canUnlockExit(this.recipeSystem.hasPressureBread)) return;
    if (!this.recipeSystem.consumePressureBread()) return;
    this.ending = true;
    this.player.setControlsEnabled(false);
    this.contextPrompt = 'Estabilizando la salida…';
    this.audioManager.play('market-exit');
    this.marketExit.activate(() => {
      this.cameras.main.stopFollow();
      this.cameras.main.pan(this.marketExit.x, this.marketExit.y - 70, 900, 'Sine.easeInOut');
      this.cameras.main.shake(520, this.settings.screenShake ? 0.012 : 0);
      this.burst(this.marketExit.x, this.marketExit.y - 80, 0x72ffe0, true, 22);
      this.objective = MARKET_OBJECTIVES.complete;
      this.contextPrompt = 'La presión abre la ruta al siguiente sector';
      this.time.delayedCall(1300, () => this.completeLevel());
    });
    this.emitSnapshot(true);
  }

  onEnemyDefeated(enemy) {
    if (!enemy?.id || this.defeatedEnemyIds.has(enemy.id)) return;
    this.defeatedEnemyIds.add(enemy.id);
    this.enemiesDefeated += 1;
    this.audioManager.play('enemy-defeat');
    eventBus.emit('enemy:defeated', { id: enemy.id, levelId: LEVEL_IDS.market });
    if (enemy.id === LEVEL_TWO_DATA.sentinel.id) {
      this.sentinelDefeated = true;
      this.removeSentinelBarrier();
      this.cameras.main.shake(420, this.settings.screenShake ? 0.012 : 0);
      this.objective = MARKET_OBJECTIVES.oven;
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
    this.game.registry.remove('level-two-checkpoint');
    this.completionProgression = sessionProgress.completeLevel(LEVEL_IDS.market, {
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
    const platforms = new Map(LEVEL_TWO_DATA.platforms.map((platform) => [platform.id, platform]));
    LEVEL_TWO_DATA.jumpLinks.forEach((link) => {
      const from = platforms.get(link.from);
      const to = platforms.get(link.to);
      if (!from || !to) return;
      const result = validateJumpLink(from, to, PLAYER);
      if (!result.reachable) console.warn(`[Mercado] Salto ${link.from} -> ${link.to} excede el margen seguro.`);
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
    if (this.tutorialsSeen.has(id)) return;
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
    const fromCheckpoint = this.status === 'defeat' && Boolean(this.game.registry.get('level-two-checkpoint'));
    if (!fromCheckpoint) this.game.registry.remove('level-two-checkpoint');
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
    return {
      status: this.status,
      levelId: LEVEL_IDS.market,
      levelName: LEVEL_TWO_DATA.name,
      health: this.player?.health ?? PLAYER.maxHealth,
      maxHealth: PLAYER.maxHealth,
      oxygen: Math.round(this.oxygenSystem?.value ?? MARKET_OXYGEN.max),
      maxOxygen: MARKET_OXYGEN.max,
      yeastCollected: this.inventory?.totalCollected ?? 0,
      yeastAvailable: this.inventory?.availableYeast ?? 0,
      yeastRequired: PRESSURE_RECIPE.yeastRequired,
      thermalBread: false,
      pressureBread: this.recipeSystem?.hasPressureBread ?? false,
      breadReady: this.recipeSystem?.hasPressureBread ?? false,
      breadName: 'Pan de Presión',
      regulatorsActive: this.progression?.activeCount ?? 0,
      regulatorsRequired: PRESSURE_RECIPE.regulatorsRequired,
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
