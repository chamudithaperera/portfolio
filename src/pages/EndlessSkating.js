import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Phaser from 'phaser';

import cruiseFrame from '../assets/sri-lankan-skating/01_cruise.png';
import accelerateFrame from '../assets/sri-lankan-skating/02_accelerate.png';
import crouchFrame from '../assets/sri-lankan-skating/03_crouch.png';
import takeoffFrame from '../assets/sri-lankan-skating/04_jump_takeoff.png';
import airborneFrame from '../assets/sri-lankan-skating/05_airborne.png';
import flipStartFrame from '../assets/sri-lankan-skating/06_backflip_start.png';
import flipInvertedFrame from '../assets/sri-lankan-skating/07_backflip_inverted.png';
import flipRecoveryFrame from '../assets/sri-lankan-skating/08_flip_recovery.png';
import landingFrame from '../assets/sri-lankan-skating/09_landing.png';
import recoveryFrame from '../assets/sri-lankan-skating/10_deep_crouch_recovery.png';
import boardPreview from '../assets/sri-lankan-skating/board/wooden_skateboard.png';
import distantSigiriya from '../assets/sri-lankan-skating/distant/distant_sigiriya.png';
import distantElla from '../assets/sri-lankan-skating/distant/distant_ella.png';
import midTemple from '../assets/sri-lankan-skating/midground/midground_temple_palms.png';
import midTea from '../assets/sri-lankan-skating/midground/midground_tea_bridge.png';
import foregroundJungle from '../assets/sri-lankan-skating/foreground/foreground_tropical_jungle.png';
import rockRound from '../assets/sri-lankan-skating/rocks/rock_01_round_mossy.png';
import rockTall from '../assets/sri-lankan-skating/rocks/rock_02_tall.png';
import rockCluster from '../assets/sri-lankan-skating/rocks/rock_03_flat_cluster.png';
import coconutPalm from '../assets/sri-lankan-skating/trees/tree_01_coconut_palm.png';
import bodhiTree from '../assets/sri-lankan-skating/trees/tree_02_bodhi_tree.png';
import jackfruitTree from '../assets/sri-lankan-skating/trees/tree_03_jackfruit_tree.png';
import templeGateway from '../assets/sri-lankan-skating/temples/temple_01_ancient_stone_gateway.png';
import templeStupa from '../assets/sri-lankan-skating/temples/temple_02_stupa_and_pillars.png';
import balloonSunset from '../assets/sri-lankan-skating/balloons/balloon_01_lotus_sunset.png';
import balloonBlue from '../assets/sri-lankan-skating/balloons/balloon_02_blue_gold_lotus.png';
import rampWood from '../assets/sri-lankan-skating/ramps/ramp_01_festival_wooden.png';
import rampStone from '../assets/sri-lankan-skating/ramps/ramp_02_ancient_stone.png';
import lotusCoins from '../assets/sri-lankan-skating/coins/lotus_coin_spritesheet_6x64.png';
import playIcon from '../assets/sri-lankan-skating/menu_icons/play.svg';
import pauseIcon from '../assets/sri-lankan-skating/menu_icons/pause.svg';
import restartIcon from '../assets/sri-lankan-skating/menu_icons/restart.svg';
import homeIcon from '../assets/sri-lankan-skating/menu_icons/home.svg';
import settingsIcon from '../assets/sri-lankan-skating/menu_icons/settings.svg';
import soundOnIcon from '../assets/sri-lankan-skating/menu_icons/sound_on.svg';
import soundOffIcon from '../assets/sri-lankan-skating/menu_icons/sound_off.svg';
import fullscreenIcon from '../assets/sri-lankan-skating/menu_icons/fullscreen.svg';

const SAVE_KEY = 'sri-lankan-skater:v1:save';
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const FIXED_STEP = 1 / 60;
const MAX_FRAME_STEPS = 5;
const PLAYER_SCREEN_X = 350;
const CHARACTER_SCALE = 0.42;
const PLAYER_ANCHOR_Y = 0.84;
const GRAVITY = 1780;
const ROTATION_SPEED = -5.35;
const SAFE_LANDING_ANGLE = 0.86;

const assetRegistry = {
  character: {
    cruise: cruiseFrame,
    accelerate: accelerateFrame,
    crouch: crouchFrame,
    takeoff: takeoffFrame,
    airborne: airborneFrame,
    flipStart: flipStartFrame,
    flipInverted: flipInvertedFrame,
    flipRecovery: flipRecoveryFrame,
    landing: landingFrame,
    recovery: recoveryFrame,
  },
  board: boardPreview,
  environments: {
    sigiriya: {
      label: 'Sigiriya Sunset',
      distant: distantSigiriya,
      midground: midTemple,
      foreground: foregroundJungle,
      skyTop: 0xff9f6e,
      skyBottom: 0x5d5aa8,
      groundTop: 0xd6a35a,
      groundBottom: 0x355533,
      haze: 0xffcf9f,
    },
    ella: {
      label: 'Ella Highlands',
      distant: distantElla,
      midground: midTea,
      foreground: foregroundJungle,
      skyTop: 0x92c7de,
      skyBottom: 0x395f8d,
      groundTop: 0xa5b96b,
      groundBottom: 0x254f37,
      haze: 0xd8f3ff,
    },
  },
  rocks: [rockRound, rockTall, rockCluster],
  trees: [coconutPalm, bodhiTree, jackfruitTree],
  temples: [templeGateway, templeStupa],
  balloons: [balloonSunset, balloonBlue],
  ramps: [rampWood, rampStone],
  coins: lotusCoins,
  icons: {
    play: playIcon,
    pause: pauseIcon,
    restart: restartIcon,
    home: homeIcon,
    settings: settingsIcon,
    soundOn: soundOnIcon,
    soundOff: soundOffIcon,
    fullscreen: fullscreenIcon,
  },
};

const defaultSave = {
  version: 1,
  bestDistance: 0,
  bestScore: 0,
  lifetimeCoins: 0,
  completedMissions: [],
  achievements: [],
  selectedEnvironment: 'sigiriya',
  selectedMode: 'classic',
  sound: { muted: false, musicVolume: 0.35, effectsVolume: 0.65 },
  graphics: { quality: 'high', reducedEffects: false },
  stats: {
    runs: 0,
    totalDistance: 0,
    totalFlips: 0,
    totalCoins: 0,
    balloonBounces: 0,
    rampLaunches: 0,
  },
};

const missions = [
  { id: 'distance-500', label: 'Travel 500 m', target: 500, metric: 'distance', reward: 25 },
  { id: 'distance-1500', label: 'Travel 1,500 m', target: 1500, metric: 'distance', reward: 75 },
  { id: 'coins-20', label: 'Collect 20 lotus coins', target: 20, metric: 'coins', reward: 40 },
  { id: 'coins-air-5', label: 'Collect 5 coins in the air', target: 5, metric: 'airCoins', reward: 45 },
  { id: 'flips-1', label: 'Land 1 backflip', target: 1, metric: 'flips', reward: 30 },
  { id: 'flips-3', label: 'Land 3 backflips in one run', target: 3, metric: 'flips', reward: 90 },
  { id: 'combo-2', label: 'Chain a 2x trick combo', target: 2, metric: 'combo', reward: 50 },
  { id: 'ramps-2', label: 'Launch from 2 ramps', target: 2, metric: 'ramps', reward: 35 },
  { id: 'balloons-2', label: 'Bounce from 2 balloons', target: 2, metric: 'balloons', reward: 45 },
  { id: 'zen-800', label: 'Zen glide for 800 m', target: 800, metric: 'zenDistance', reward: 35 },
];

function createDefaultSave() {
  return JSON.parse(JSON.stringify(defaultSave));
}

function loadSaveData() {
  if (typeof window === 'undefined') return createDefaultSave();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVE_KEY) || 'null');
    if (!parsed || parsed.version !== 1 || typeof parsed !== 'object') {
      return createDefaultSave();
    }
    return {
      ...createDefaultSave(),
      ...parsed,
      sound: { ...defaultSave.sound, ...(parsed.sound || {}) },
      graphics: { ...defaultSave.graphics, ...(parsed.graphics || {}) },
      stats: { ...defaultSave.stats, ...(parsed.stats || {}) },
    };
  } catch (error) {
    return createDefaultSave();
  }
}

function saveData(data) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (error) {
    void error;
  }
}

class SeededRandom {
  constructor(seed = 1337) {
    this.seed = seed >>> 0;
  }

  next() {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  range(min, max) {
    return min + (max - min) * this.next();
  }

  pick(items) {
    return items[Math.floor(this.next() * items.length) % items.length];
  }
}

class TerrainGenerator {
  constructor(seed = 1337) {
    this.random = new SeededRandom(seed);
    this.spacing = 260;
    this.points = [];
    for (let index = -4; index < 22; index += 1) {
      this.points.push(this.createPoint(index));
    }
  }

  createPoint(index) {
    const x = index * this.spacing;
    const rolling = Math.sin(index * 0.82) * 42 + Math.sin(index * 0.31 + 2.4) * 34;
    const descent = -Math.min(index, 80) * 0.72;
    const difficulty = Phaser.Math.Clamp(index / 26, 0, 1);
    const feature = Math.sin(index * 1.73) * (22 + difficulty * 30);
    const y = 510 + rolling + feature + descent;
    return { x, y: Phaser.Math.Clamp(y, 315, 610) };
  }

  ensureUntil(worldX) {
    while (this.points[this.points.length - 1].x < worldX + GAME_WIDTH * 1.8) {
      const lastIndex = Math.round(this.points[this.points.length - 1].x / this.spacing);
      this.points.push(this.createPoint(lastIndex + 1));
    }
    while (this.points.length > 12 && this.points[4].x < worldX - GAME_WIDTH) {
      this.points.shift();
    }
  }

  samplePoints(worldX, width, step = 18) {
    this.ensureUntil(worldX + width);
    const points = [];
    const start = worldX - 120;
    const end = worldX + width + 160;
    for (let x = start; x <= end; x += step) {
      points.push({ x, y: this.heightAt(x) });
    }
    return points;
  }

  getSegment(x) {
    this.ensureUntil(x);
    let index = 1;
    while (index < this.points.length - 2 && this.points[index + 1].x < x) {
      index += 1;
    }
    return Phaser.Math.Clamp(index, 1, this.points.length - 3);
  }

  heightAt(x) {
    const index = this.getSegment(x);
    const p0 = this.points[index - 1];
    const p1 = this.points[index];
    const p2 = this.points[index + 1];
    const p3 = this.points[index + 2];
    const t = Phaser.Math.Clamp((x - p1.x) / (p2.x - p1.x), 0, 1);
    return Phaser.Math.Interpolation.CatmullRom([p0.y, p1.y, p2.y, p3.y], t);
  }

  slopeAt(x) {
    return (this.heightAt(x + 8) - this.heightAt(x - 8)) / 16;
  }

  normalAt(x) {
    const slope = this.slopeAt(x);
    const length = Math.sqrt(slope * slope + 1);
    return { x: -slope / length, y: 1 / length };
  }

  angleAt(x) {
    return Math.atan(this.slopeAt(x));
  }

  hasGroundAt() {
    return true;
  }
}

class AudioManager {
  constructor(save) {
    this.save = save;
    this.context = null;
  }

  ensure() {
    if (this.context || this.save.sound.muted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) this.context = new AudioContext();
  }

  beep(type) {
    if (this.save.sound.muted) return;
    this.ensure();
    if (!this.context) return;
    const ctx = this.context;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const volume = this.save.sound.effectsVolume;
    const config = {
      jump: [420, 0.08, 'triangle'],
      coin: [880, 0.07, 'sine'],
      land: [220, 0.08, 'triangle'],
      flip: [660, 0.14, 'sine'],
      crash: [90, 0.24, 'sawtooth'],
      bounce: [520, 0.12, 'square'],
      menu: [340, 0.06, 'sine'],
    }[type] || [300, 0.08, 'sine'];
    oscillator.type = config[2];
    oscillator.frequency.setValueAtTime(config[0], now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume * 0.09), now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + config[1]);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + config[1] + 0.025);
  }

  dispose() {
    if (this.context) {
      this.context.close?.();
      this.context = null;
    }
  }
}

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#171033');
    const title = this.add.text(width / 2, height / 2 - 70, 'Sri Lankan Endless Skating', {
      fontFamily: 'Space Grotesk, Arial',
      fontSize: '42px',
      color: '#fff7d6',
      fontStyle: '700',
    }).setOrigin(0.5);
    this.add.rectangle(width / 2, height / 2 + 5, 420, 8, 0xffffff, 0.2);
    const bar = this.add.rectangle(width / 2 - 210, height / 2 + 5, 0, 8, 0xf5c86a, 1).setOrigin(0, 0.5);
    const label = this.add.text(width / 2, height / 2 + 38, 'Loading 0%', {
      fontFamily: 'Inter, Arial',
      fontSize: '15px',
      color: '#fef3c7',
    }).setOrigin(0.5);
    this.load.on('progress', (value) => {
      bar.width = 420 * value;
      label.setText(`Loading ${Math.round(value * 100)}%`);
    });
    this.load.on('loaderror', (file) => {
      label.setText(`Could not load ${file?.key || 'an asset'}`);
      label.setColor('#fecaca');
    });

    Object.entries(assetRegistry.character).forEach(([key, src]) => this.load.image(`character-${key}`, src));
    Object.entries(assetRegistry.environments).forEach(([key, env]) => {
      this.load.image(`env-${key}-distant`, env.distant);
      this.load.image(`env-${key}-midground`, env.midground);
      this.load.image(`env-${key}-foreground`, env.foreground);
    });
    assetRegistry.rocks.forEach((src, index) => this.load.image(`rock-${index}`, src));
    assetRegistry.trees.forEach((src, index) => this.load.image(`tree-${index}`, src));
    assetRegistry.temples.forEach((src, index) => this.load.image(`temple-${index}`, src));
    assetRegistry.balloons.forEach((src, index) => this.load.image(`balloon-${index}`, src));
    assetRegistry.ramps.forEach((src, index) => this.load.image(`ramp-${index}`, src));
    this.load.spritesheet('lotus-coin', assetRegistry.coins, { frameWidth: 64, frameHeight: 64 });
    Object.entries(assetRegistry.icons).forEach(([key, src]) => this.load.svg(`icon-${key}`, src, { width: 64, height: 64 }));
    this.load.image('board-preview', assetRegistry.board);

    this.load.once('complete', () => {
      title.setText('Ready');
      this.scene.start('MenuScene');
    });
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.save = this.game.registry.get('save');
    this.audio = this.game.registry.get('audio');
    this.renderMenu();
  }

  makeButton(x, y, text, icon, onClick) {
    const container = this.add.container(x, y).setSize(310, 54);
    const bg = this.add.rectangle(0, 0, 310, 54, 0x1f2937, 0.74)
      .setStrokeStyle(1, 0xf5c86a, 0.42)
      .setInteractive({ useHandCursor: true });
    const iconImage = this.add.image(-124, 0, icon).setDisplaySize(28, 28);
    const label = this.add.text(-92, 0, text, {
      fontFamily: 'Inter, Arial',
      fontSize: '18px',
      color: '#fff7d6',
      fontStyle: '700',
    }).setOrigin(0, 0.5);
    container.add([bg, iconImage, label]);
    bg.on('pointerover', () => bg.setFillStyle(0x334155, 0.88));
    bg.on('pointerout', () => bg.setFillStyle(0x1f2937, 0.74));
    bg.on('pointerdown', () => {
      this.audio.beep('menu');
      onClick();
    });
    return container;
  }

  renderMenu() {
    this.children.removeAll();
    const { width, height } = this.scale;
    const env = assetRegistry.environments[this.save.selectedEnvironment] || assetRegistry.environments.sigiriya;
    this.cameras.main.setBackgroundColor(env.skyBottom);
    this.add.image(width / 2, height / 2, `env-${this.save.selectedEnvironment}-distant`).setDisplaySize(width, height).setAlpha(0.82);
    this.add.rectangle(width / 2, height / 2, width, height, 0x120b2a, 0.42);
    this.add.image(width - 154, height - 104, 'board-preview').setScale(0.66).setAlpha(0.8).setRotation(-0.12);
    this.add.image(width - 150, height - 210, 'character-cruise').setScale(0.42).setAlpha(0.94);

    this.add.text(76, 78, 'Sri Lankan\nEndless Skating', {
      fontFamily: 'Space Grotesk, Arial',
      fontSize: '58px',
      color: '#fff7d6',
      lineSpacing: -10,
      fontStyle: '700',
    });
    this.add.text(80, 224, 'Momentum, lotus coins, misty hills and sunset ruins.', {
      fontFamily: 'Inter, Arial',
      fontSize: '18px',
      color: '#f8e7bd',
    });
    this.add.text(80, 266, `Best ${Math.round(this.save.bestDistance).toLocaleString()} m  •  Coins ${this.save.lifetimeCoins.toLocaleString()}`, {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '15px',
      color: '#f5c86a',
    });

    this.makeButton(236, 355, 'Classic Mode', 'icon-play', () => this.startGame('classic'));
    this.makeButton(236, 424, 'Zen Mode', 'icon-play', () => this.startGame('zen'));
    this.makeButton(236, 493, `Environment: ${env.label}`, 'icon-settings', () => this.toggleEnvironment());
    this.makeButton(236, 562, this.save.sound.muted ? 'Sound Off' : 'Sound On', this.save.sound.muted ? 'icon-soundOff' : 'icon-soundOn', () => this.toggleSound());

    const activeMissions = getActiveMissions(this.save);
    this.add.text(width - 440, 88, 'Active Missions', {
      fontFamily: 'Space Grotesk, Arial',
      fontSize: '24px',
      color: '#fff7d6',
      fontStyle: '700',
    });
    activeMissions.forEach((mission, index) => {
      this.add.text(width - 440, 130 + index * 34, `${index + 1}. ${mission.label} (+${mission.reward})`, {
        fontFamily: 'Inter, Arial',
        fontSize: '15px',
        color: '#dbeafe',
      });
    });
    this.add.text(width - 440, 250, 'Controls\nSpace / tap: jump\nHold in air: backflip\nEsc: pause  •  R: restart', {
      fontFamily: 'Inter, Arial',
      fontSize: '15px',
      color: '#f8e7bd',
      lineSpacing: 7,
    });
  }

  startGame(mode) {
    this.save.selectedMode = mode;
    saveData(this.save);
    this.scene.start('GameScene', { mode, environment: this.save.selectedEnvironment });
  }

  toggleEnvironment() {
    this.save.selectedEnvironment = this.save.selectedEnvironment === 'sigiriya' ? 'ella' : 'sigiriya';
    saveData(this.save);
    this.renderMenu();
  }

  toggleSound() {
    this.save.sound.muted = !this.save.sound.muted;
    saveData(this.save);
    this.renderMenu();
  }
}

function getActiveMissions(save) {
  const completed = new Set(save.completedMissions || []);
  const pool = missions.filter((mission) => !completed.has(mission.id));
  return (pool.length ? pool : missions).slice(0, 3);
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.worldX = 0;
    this.accumulator = 0;
    this.entities = [];
    this.coins = [];
    this.obstacles = [];
    this.ramps = [];
    this.balloons = [];
    this.decor = [];
    this.particles = [];
    this.inputState = { held: false, pressed: false };
  }

  create(data) {
    this.save = this.game.registry.get('save');
    this.audio = this.game.registry.get('audio');
    this.mode = data.mode || this.save.selectedMode || 'classic';
    this.environmentKey = data.environment || this.save.selectedEnvironment || 'sigiriya';
    this.environment = assetRegistry.environments[this.environmentKey] || assetRegistry.environments.sigiriya;
    this.random = new SeededRandom(20261010);
    this.terrain = new TerrainGenerator(20261010);
    this.worldX = 0;
    this.nextSpawnX = 620;
    this.nextDecorX = 260;
    this.runStats = {
      distance: 0,
      score: 0,
      coins: 0,
      airCoins: 0,
      flips: 0,
      combo: 1,
      ramps: 0,
      balloons: 0,
      zenDistance: 0,
    };
    this.completedThisRun = new Set();
    this.gameOver = false;
    this.pausedByMenu = false;

    this.createWorld();
    this.createPlayer();
    this.createHud();
    this.createInput();
    this.updateHud(true);
  }

  createWorld() {
    const { width, height } = this.scale;
    this.sky = this.add.graphics().setScrollFactor(0).setDepth(-90);
    this.distant = this.add.tileSprite(width / 2, height / 2, width * 1.15, height, `env-${this.environmentKey}-distant`).setDepth(-80);
    this.midground = this.add.tileSprite(width / 2, height / 2, width * 1.15, height, `env-${this.environmentKey}-midground`).setDepth(-65);
    this.foreground = this.add.tileSprite(width / 2, height / 2, width * 1.15, height, `env-${this.environmentKey}-foreground`).setDepth(-32).setAlpha(0.76);
    this.haze = this.add.rectangle(width / 2, height / 2, width, height, this.environment.haze, 0.12).setDepth(-45).setScrollFactor(0);
    this.sun = this.add.circle(width * 0.74, height * 0.18, 44, 0xffdf91, 0.72).setDepth(-85).setScrollFactor(0);
    this.moon = this.add.circle(width * 0.22, height * 0.18, 24, 0xdbeafe, 0).setDepth(-85).setScrollFactor(0);
    this.terrainFill = this.add.graphics().setDepth(-5);
    this.terrainLine = this.add.graphics().setDepth(2);
    this.anims.create({
      key: 'coin-spin',
      frames: this.anims.generateFrameNumbers('lotus-coin', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1,
    });
  }

  createPlayer() {
    const groundY = this.terrain.heightAt(PLAYER_SCREEN_X);
    this.player = {
      x: PLAYER_SCREEN_X,
      y: groundY,
      vx: 345,
      vy: 0,
      speed: 345,
      rotation: this.terrain.angleAt(PLAYER_SCREEN_X),
      angularVelocity: 0,
      grounded: true,
      state: 'READY',
      frame: 'character-cruise',
      flipsInAir: 0,
      cumulativeRotation: 0,
      jumpBuffer: 0,
      coyote: 0,
      landingTimer: 0,
      crashTimer: 0,
      lastGroundAngle: 0,
    };
    this.playerSprite = this.add.image(this.player.x, this.player.y, this.player.frame)
      .setScale(CHARACTER_SCALE)
      .setOrigin(0.5, PLAYER_ANCHOR_Y)
      .setDepth(12);
    this.shadow = this.add.ellipse(this.player.x, this.player.y + 8, 96, 18, 0x120b20, 0.25).setDepth(1);
  }

  createHud() {
    const hudStyle = {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '16px',
      color: '#fff7d6',
      stroke: '#15101e',
      strokeThickness: 4,
    };
    this.hudText = this.add.text(22, 18, '', hudStyle).setDepth(80).setScrollFactor(0);
    this.comboText = this.add.text(22, 96, '', { ...hudStyle, fontSize: '20px', color: '#f5c86a' }).setDepth(80).setScrollFactor(0);
    this.noticeText = this.add.text(this.scale.width / 2, 108, '', {
      fontFamily: 'Space Grotesk, Arial',
      fontSize: '26px',
      color: '#fff7d6',
      stroke: '#15101e',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(85).setScrollFactor(0).setAlpha(0);
    this.pauseButton = this.add.image(this.scale.width - 36, 35, 'icon-pause').setDisplaySize(34, 34).setDepth(90).setScrollFactor(0).setInteractive({ useHandCursor: true });
    this.pauseButton.on('pointerdown', (pointer) => {
      pointer.event?.stopPropagation?.();
      this.togglePause();
    });
  }

  createInput() {
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.input.keyboard.on('keydown-SPACE', (event) => event.preventDefault());
    this.input.on('pointerdown', (pointer) => {
      if (pointer.y < 82 && pointer.x > this.scale.width - 92) return;
      this.inputState.held = true;
      this.inputState.pressed = true;
    });
    this.input.on('pointerup', () => {
      this.inputState.held = false;
    });
    this.visibilityHandler = () => {
      this.inputState.held = false;
      if (document.hidden && !this.gameOver) this.pauseGame();
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
    this.blurHandler = () => {
      this.inputState.held = false;
    };
    window.addEventListener('blur', this.blurHandler);
  }

  update(time, deltaMs) {
    if (Phaser.Input.Keyboard.JustDown(this.escape)) this.togglePause();
    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) this.restart();
    if (this.pausedByMenu || this.gameOver) return;

    const keyboardPressed = Phaser.Input.Keyboard.JustDown(this.space);
    const keyboardHeld = this.space.isDown;
    if (keyboardPressed) {
      this.inputState.pressed = true;
      this.audio.ensure();
    }
    this.inputState.held = this.inputState.held || keyboardHeld;

    this.accumulator += Math.min(deltaMs / 1000, 0.08);
    let steps = 0;
    while (this.accumulator >= FIXED_STEP && steps < MAX_FRAME_STEPS) {
      this.fixedUpdate(FIXED_STEP);
      this.accumulator -= FIXED_STEP;
      steps += 1;
    }
    this.renderWorld(time / 1000);
    this.inputState.pressed = false;
  }

  fixedUpdate(dt) {
    this.terrain.ensureUntil(this.worldX + GAME_WIDTH * 2);
    this.spawnAhead();
    this.updatePlayer(dt);
    this.updateObjects(dt);
    this.runStats.distance = Math.max(this.runStats.distance, this.worldX / 10);
    if (this.mode === 'zen') this.runStats.zenDistance = this.runStats.distance;
    this.runStats.score = Math.floor(this.runStats.distance * 2 + this.runStats.coins * 15 + this.runStats.flips * 250 * this.runStats.combo);
    this.checkMissions();
    this.updateHud();
  }

  updatePlayer(dt) {
    const player = this.player;
    const groundY = this.terrain.heightAt(player.x + this.worldX);
    const groundAngle = this.terrain.angleAt(player.x + this.worldX);
    const slope = this.terrain.slopeAt(player.x + this.worldX);
    player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);
    if (this.inputState.pressed) player.jumpBuffer = 0.12;

    if (player.grounded) {
      const slopeAccel = Phaser.Math.Clamp(slope * 620, -430, 520);
      player.speed += slopeAccel * dt;
      player.speed -= 34 * dt;
      player.speed = Phaser.Math.Clamp(player.speed, 250, 720);
      player.vx = player.speed;
      this.worldX += player.speed * dt;
      player.y = Phaser.Math.Linear(player.y, groundY, 0.42);
      player.rotation = Phaser.Math.Angle.RotateTo(player.rotation, groundAngle, 0.12);
      player.lastGroundAngle = groundAngle;
      player.coyote = 0.1;
      player.landingTimer = Math.max(0, player.landingTimer - dt);
      player.state = this.inputState.held ? 'CROUCHING' : player.speed > 450 ? 'ACCELERATING' : 'RIDING';
      if (player.jumpBuffer > 0 || this.inputState.pressed) {
        player.grounded = false;
        player.state = 'TAKEOFF';
        player.vy = -690 - Math.min(120, player.speed * 0.12);
        player.vx = player.speed;
        player.angularVelocity = 0;
        player.cumulativeRotation = 0;
        player.flipsInAir = 0;
        player.jumpBuffer = 0;
        this.audio.beep('jump');
      }
    } else {
      player.coyote = Math.max(0, player.coyote - dt);
      this.worldX += player.vx * dt;
      player.vy += GRAVITY * dt;
      player.y += player.vy * dt;
      if (this.inputState.held) {
        player.angularVelocity = Phaser.Math.Linear(player.angularVelocity, ROTATION_SPEED, 0.18);
      } else {
        player.angularVelocity = Phaser.Math.Linear(player.angularVelocity, 0, 0.075);
      }
      const previousRotation = player.rotation;
      player.rotation += player.angularVelocity * dt;
      player.cumulativeRotation += previousRotation - player.rotation;
      player.flipsInAir = Math.floor(Math.max(0, player.cumulativeRotation) / (Math.PI * 2));
      player.state = this.inputState.held || Math.abs(player.angularVelocity) > 0.9 ? 'FLIPPING' : 'AIRBORNE';

      if (player.vy > 0 && player.y >= groundY - 2) {
        this.landPlayer(groundY, groundAngle);
      }
    }
  }

  landPlayer(groundY, groundAngle) {
    const player = this.player;
    const wrapped = Math.atan2(Math.sin(player.rotation - groundAngle), Math.cos(player.rotation - groundAngle));
    const impact = Math.abs(player.vy);
    const safe = Math.abs(wrapped) < SAFE_LANDING_ANGLE && impact < 1180;
    if (!safe && this.mode !== 'zen') {
      this.crash('Bad landing');
      return;
    }
    player.grounded = true;
    player.y = groundY;
    player.rotation = groundAngle;
    player.speed = Phaser.Math.Clamp(player.vx + (player.flipsInAir > 0 ? 54 : 0), 260, 760);
    player.vy = 0;
    player.landingTimer = 0.28;
    player.state = 'LANDING';
    if (player.flipsInAir > 0) {
      this.runStats.flips += player.flipsInAir;
      this.runStats.combo = Math.min(9, this.runStats.combo + player.flipsInAir);
      this.showNotice(`${player.flipsInAir}x backflip`);
      this.audio.beep('flip');
    } else {
      this.runStats.combo = Math.max(1, this.runStats.combo - 0.15);
      this.audio.beep('land');
    }
    this.addDust(player.x, player.y, 10);
  }

  updateObjects(dt) {
    const worldLeft = this.worldX - 160;
    const worldRight = this.worldX + GAME_WIDTH + 360;
    this.coins.forEach((coin) => {
      coin.sprite.rotation += dt * 4.5;
      const screenX = coin.worldX - this.worldX;
      coin.sprite.setPosition(screenX, coin.worldY);
      if (!coin.collected && Phaser.Math.Distance.Between(screenX, coin.worldY, this.player.x, this.player.y - 72) < 54) {
        coin.collected = true;
        coin.sprite.disableBody(true, true);
        this.runStats.coins += 1;
        if (!this.player.grounded) this.runStats.airCoins += 1;
        this.addCoinBurst(screenX, coin.worldY);
        this.audio.beep('coin');
      }
      if (coin.worldX < worldLeft || coin.worldX > worldRight) coin.sprite.setVisible(false);
    });

    this.obstacles.forEach((obstacle) => {
      const screenX = obstacle.worldX - this.worldX;
      obstacle.sprite.setPosition(screenX, obstacle.worldY);
      if (!obstacle.hit && Math.abs(screenX - this.player.x) < obstacle.radiusX && Math.abs(obstacle.worldY - (this.player.y - 30)) < obstacle.radiusY) {
        obstacle.hit = true;
        if (this.mode === 'zen') {
          this.player.speed = Math.max(250, this.player.speed * 0.72);
          this.showNotice('Gentle stumble');
        } else {
          this.crash('Rock crash');
        }
      }
    });

    this.ramps.forEach((ramp) => {
      const screenX = ramp.worldX - this.worldX;
      ramp.sprite.setPosition(screenX, ramp.worldY);
      if (!ramp.used && this.player.grounded && Math.abs(screenX - this.player.x) < 54 && Math.abs(this.player.y - ramp.worldY) < 58) {
        ramp.used = true;
        this.player.grounded = false;
        this.player.vy = -780;
        this.player.vx = Math.max(this.player.speed + 90, 470);
        this.player.state = 'TAKEOFF';
        this.runStats.ramps += 1;
        this.addDust(this.player.x, this.player.y, 14);
        this.audio.beep('jump');
      }
    });

    this.balloons.forEach((balloon) => {
      balloon.bob += dt;
      const screenX = balloon.worldX - this.worldX;
      const y = balloon.baseY + Math.sin(balloon.bob * 1.8) * 12;
      balloon.sprite.setPosition(screenX, y);
      if (!balloon.used && Phaser.Math.Distance.Between(screenX, y + 90, this.player.x, this.player.y - 110) < 76) {
        balloon.used = true;
        this.player.vy = -720;
        this.player.vx = Math.max(this.player.vx, 430);
        this.player.grounded = false;
        this.player.state = 'BALLOON_BOUNCE';
        this.runStats.balloons += 1;
        this.showNotice('Balloon bounce');
        this.audio.beep('bounce');
      }
    });

    this.decor.forEach((item) => {
      item.sprite.x = item.worldX - this.worldX * item.factor;
      if (item.groundLocked) {
        item.sprite.y = this.terrain.heightAt(item.worldX) + item.offsetY;
      }
    });

    this.particles.forEach((particle) => {
      particle.life -= dt;
      particle.sprite.x += particle.vx * dt;
      particle.sprite.y += particle.vy * dt;
      particle.vy += 900 * dt;
      particle.sprite.setAlpha(Math.max(0, particle.life / particle.maxLife));
      if (particle.life <= 0) particle.sprite.destroy();
    });
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  spawnAhead() {
    const target = this.worldX + GAME_WIDTH * 1.5;
    while (this.nextSpawnX < target) {
      const difficulty = Phaser.Math.Clamp(this.nextSpawnX / 7000, 0, 1);
      const ground = this.terrain.heightAt(this.nextSpawnX);
      this.spawnCoins(this.nextSpawnX, ground, difficulty);
      if (this.nextSpawnX > 1800 && this.random.next() < 0.42 + difficulty * 0.2) {
        this.spawnRock(this.nextSpawnX + this.random.range(120, 260));
      }
      if (this.random.next() < 0.36) this.spawnRamp(this.nextSpawnX + this.random.range(300, 460));
      if (this.random.next() < 0.24) this.spawnBalloon(this.nextSpawnX + this.random.range(420, 640));
      this.nextSpawnX += 520 + this.random.range(0, 190) - difficulty * 70;
    }

    while (this.nextDecorX < target) {
      this.spawnDecor(this.nextDecorX);
      this.nextDecorX += 280 + this.random.range(0, 220);
    }
  }

  spawnCoins(startX, groundY, difficulty) {
    const arc = this.random.next() < 0.42;
    for (let index = 0; index < 7; index += 1) {
      const worldX = startX + index * 58;
      const y = arc
        ? this.terrain.heightAt(worldX) - 120 - Math.sin(index / 6 * Math.PI) * (70 + difficulty * 45)
        : this.terrain.heightAt(worldX) - 92;
      const sprite = this.physics.add.sprite(worldX - this.worldX, y, 'lotus-coin').setDepth(9).setScale(0.72);
      sprite.play('coin-spin');
      this.coins.push({ sprite, worldX, worldY: y, collected: false });
    }
  }

  spawnRock(worldX) {
    const index = Math.floor(this.random.range(0, 3));
    const ground = this.terrain.heightAt(worldX);
    const scale = this.random.range(0.58, 0.9);
    const sprite = this.add.image(worldX - this.worldX, ground + 4, `rock-${index}`).setOrigin(0.5, 0.84).setScale(scale).setDepth(8);
    this.obstacles.push({ sprite, worldX, worldY: ground, radiusX: 42 * scale, radiusY: 54 * scale, hit: false });
  }

  spawnRamp(worldX) {
    const ground = this.terrain.heightAt(worldX);
    const index = this.random.next() < 0.5 ? 0 : 1;
    const sprite = this.add.image(worldX - this.worldX, ground + 1, `ramp-${index}`).setOrigin(0.48, 0.85).setScale(0.74).setDepth(7);
    sprite.rotation = this.terrain.angleAt(worldX);
    this.ramps.push({ sprite, worldX, worldY: ground, used: false });
  }

  spawnBalloon(worldX) {
    const index = this.random.next() < 0.5 ? 0 : 1;
    const baseY = Math.max(150, this.terrain.heightAt(worldX) - this.random.range(220, 300));
    const sprite = this.add.image(worldX - this.worldX, baseY, `balloon-${index}`).setScale(0.34).setDepth(4);
    this.balloons.push({ sprite, worldX, baseY, bob: this.random.range(0, Math.PI * 2), used: false });
  }

  spawnDecor(worldX) {
    const choice = this.random.next();
    const ground = this.terrain.heightAt(worldX);
    if (choice < 0.58) {
      const index = Math.floor(this.random.range(0, 3));
      const sprite = this.add.image(worldX - this.worldX * 0.82, ground + 18, `tree-${index}`).setOrigin(0.5, 1).setScale(this.random.range(0.36, 0.58)).setDepth(3).setAlpha(0.9);
      this.decor.push({ sprite, worldX, factor: 0.82, groundLocked: true, offsetY: 18 });
    } else {
      const index = Math.floor(this.random.range(0, 2));
      const sprite = this.add.image(worldX - this.worldX * 0.55, ground - 70, `temple-${index}`).setOrigin(0.5, 1).setScale(this.random.range(0.28, 0.42)).setDepth(-1).setAlpha(0.78);
      this.decor.push({ sprite, worldX, factor: 0.55, groundLocked: true, offsetY: -70 });
    }
  }

  renderWorld(time) {
    const { width, height } = this.scale;
    const day = (Math.sin(this.worldX / 2500) + 1) / 2;
    this.sky.clear();
    this.sky.fillGradientStyle(this.environment.skyTop, this.environment.skyTop, this.environment.skyBottom, this.environment.skyBottom, 1);
    this.sky.fillRect(0, 0, width, height);
    this.sun.setPosition(width * (0.18 + day * 0.62), height * (0.16 + Math.sin(this.worldX / 1800) * 0.05));
    this.sun.setAlpha(0.35 + day * 0.48);
    this.moon.setAlpha(Math.max(0, 0.45 - day * 0.5));
    this.distant.tilePositionX = this.worldX * 0.12;
    this.midground.tilePositionX = this.worldX * 0.34;
    this.foreground.tilePositionX = this.worldX * 0.72;
    this.haze.setAlpha(0.08 + (1 - day) * 0.15);

    this.drawTerrain();
    this.playerSprite.setTexture(this.getPlayerFrame());
    this.playerSprite.setPosition(this.player.x, this.player.y);
    this.playerSprite.setRotation(this.player.rotation);
    this.shadow.setPosition(this.player.x, this.terrain.heightAt(this.worldX + this.player.x) + 8);
    this.shadow.setScale(Phaser.Math.Clamp(1 - Math.max(0, this.terrain.heightAt(this.worldX + this.player.x) - this.player.y) / 450, 0.45, 1), 1);
  }

  drawTerrain() {
    const points = this.terrain.samplePoints(this.worldX, GAME_WIDTH, 18);
    this.terrainFill.clear();
    this.terrainLine.clear();
    this.terrainFill.fillGradientStyle(this.environment.groundTop, this.environment.groundTop, this.environment.groundBottom, this.environment.groundBottom, 1);
    this.terrainFill.beginPath();
    this.terrainFill.moveTo(points[0].x - this.worldX, points[0].y);
    points.forEach((point) => this.terrainFill.lineTo(point.x - this.worldX, point.y));
    this.terrainFill.lineTo(GAME_WIDTH + 220, GAME_HEIGHT + 120);
    this.terrainFill.lineTo(-220, GAME_HEIGHT + 120);
    this.terrainFill.closePath();
    this.terrainFill.fillPath();
    this.terrainLine.lineStyle(5, 0xffe0a3, 0.86);
    this.terrainLine.beginPath();
    this.terrainLine.moveTo(points[0].x - this.worldX, points[0].y);
    points.forEach((point) => this.terrainLine.lineTo(point.x - this.worldX, point.y));
    this.terrainLine.strokePath();
    this.terrainLine.lineStyle(12, 0x6b4a25, 0.34);
    this.terrainLine.beginPath();
    this.terrainLine.moveTo(points[0].x - this.worldX, points[0].y + 19);
    points.forEach((point) => this.terrainLine.lineTo(point.x - this.worldX, point.y + 19));
    this.terrainLine.strokePath();
  }

  getPlayerFrame() {
    if (this.player.state === 'CROUCHING') return 'character-crouch';
    if (this.player.state === 'ACCELERATING') return 'character-accelerate';
    if (this.player.state === 'TAKEOFF') return 'character-takeoff';
    if (this.player.state === 'LANDING') return 'character-landing';
    if (this.player.state === 'BALLOON_BOUNCE') return 'character-recovery';
    if (this.player.state === 'FLIPPING') {
      const angle = Math.abs(Math.atan2(Math.sin(this.player.rotation), Math.cos(this.player.rotation)));
      if (angle > Math.PI * 0.72) return 'character-flipInverted';
      if (angle > Math.PI * 0.35) return 'character-flipStart';
      return 'character-flipRecovery';
    }
    if (!this.player.grounded) return 'character-airborne';
    return 'character-cruise';
  }

  updateHud(force = false) {
    if (!force && this.lastHudUpdate && this.time.now - this.lastHudUpdate < 80) return;
    this.lastHudUpdate = this.time.now;
    this.hudText.setText([
      `${Math.floor(this.runStats.distance).toLocaleString()} m`,
      `Score ${this.runStats.score.toLocaleString()}`,
      `Lotus ${this.runStats.coins} / Wallet ${this.save.lifetimeCoins + this.runStats.coins}`,
      this.mode === 'zen' ? 'Zen Mode' : `Best ${Math.round(this.save.bestDistance).toLocaleString()} m`,
    ]);
    this.comboText.setText(this.runStats.flips ? `Combo x${Math.round(this.runStats.combo * 10) / 10} • Flips ${this.runStats.flips}` : '');
  }

  checkMissions() {
    getActiveMissions(this.save).forEach((mission) => {
      if (this.completedThisRun.has(mission.id)) return;
      const value = this.runStats[mission.metric] || 0;
      if (value >= mission.target) {
        this.completedThisRun.add(mission.id);
        this.save.completedMissions = Array.from(new Set([...(this.save.completedMissions || []), mission.id]));
        this.save.lifetimeCoins += mission.reward;
        saveData(this.save);
        this.showNotice(`Mission complete: ${mission.label}`);
        this.audio.beep('flip');
      }
    });
  }

  showNotice(text) {
    this.noticeText.setText(text).setAlpha(1).setScale(0.94);
    this.tweens.add({ targets: this.noticeText, alpha: 0, scale: 1.04, duration: 1600, ease: 'Sine.easeOut' });
  }

  addDust(x, y, count) {
    if (this.save.graphics.reducedEffects) return;
    for (let index = 0; index < count; index += 1) {
      const sprite = this.add.circle(x + this.random.range(-18, 18), y + this.random.range(-4, 8), this.random.range(2, 5), 0xf5c86a, 0.42).setDepth(11);
      this.particles.push({ sprite, vx: this.random.range(-140, -30), vy: this.random.range(-180, -35), life: 0.45, maxLife: 0.45 });
    }
  }

  addCoinBurst(x, y) {
    if (this.save.graphics.reducedEffects) return;
    for (let index = 0; index < 7; index += 1) {
      const sprite = this.add.circle(x, y, this.random.range(2, 4), 0xffdf72, 0.8).setDepth(12);
      this.particles.push({ sprite, vx: this.random.range(-95, 95), vy: this.random.range(-180, -60), life: 0.35, maxLife: 0.35 });
    }
  }

  crash(reason) {
    this.gameOver = true;
    this.audio.beep('crash');
    this.showNotice(reason);
    this.playerSprite.setTint(0xffb4a8);
    this.time.delayedCall(760, () => this.finishRun(reason));
  }

  finishRun(reason = 'Run finished') {
    const finalDistance = Math.floor(this.runStats.distance);
    const finalScore = Math.floor(this.runStats.score);
    this.save.bestDistance = Math.max(this.save.bestDistance, finalDistance);
    this.save.bestScore = Math.max(this.save.bestScore, finalScore);
    this.save.lifetimeCoins += this.runStats.coins;
    this.save.stats.runs += 1;
    this.save.stats.totalDistance += finalDistance;
    this.save.stats.totalFlips += this.runStats.flips;
    this.save.stats.totalCoins += this.runStats.coins;
    this.save.stats.balloonBounces += this.runStats.balloons;
    this.save.stats.rampLaunches += this.runStats.ramps;
    saveData(this.save);
    this.scene.start('GameOverScene', { stats: this.runStats, reason });
  }

  pauseGame() {
    this.pausedByMenu = true;
    this.physics.pause();
    this.scene.launch('PauseScene', { parent: this.scene.key });
  }

  togglePause() {
    if (this.pausedByMenu) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  resumeGame() {
    this.pausedByMenu = false;
    this.physics.resume();
    this.scene.stop('PauseScene');
  }

  restart() {
    this.scene.start('GameScene', { mode: this.mode, environment: this.environmentKey });
  }

  shutdown() {
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    window.removeEventListener('blur', this.blurHandler);
  }
}

class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create(data) {
    this.parentKey = data.parent || 'GameScene';
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x070816, 0.48).setDepth(100);
    this.add.text(width / 2, height / 2 - 130, 'Paused', {
      fontFamily: 'Space Grotesk, Arial',
      fontSize: '54px',
      color: '#fff7d6',
      fontStyle: '700',
    }).setOrigin(0.5).setDepth(101);
    this.button(width / 2, height / 2 - 36, 'Resume', 'icon-play', () => this.resume());
    this.button(width / 2, height / 2 + 36, 'Restart', 'icon-restart', () => {
      this.scene.stop(this.parentKey);
      this.scene.start('GameScene');
    });
    this.button(width / 2, height / 2 + 108, 'Main Menu', 'icon-home', () => {
      this.scene.stop(this.parentKey);
      this.scene.start('MenuScene');
    });
  }

  button(x, y, label, icon, action) {
    const bg = this.add.rectangle(x, y, 280, 54, 0x1f2937, 0.92).setStrokeStyle(1, 0xf5c86a, 0.5).setInteractive({ useHandCursor: true }).setDepth(101);
    this.add.image(x - 108, y, icon).setDisplaySize(27, 27).setDepth(102);
    this.add.text(x - 74, y, label, { fontFamily: 'Inter, Arial', fontSize: '18px', color: '#fff7d6', fontStyle: '700' }).setOrigin(0, 0.5).setDepth(102);
    bg.on('pointerdown', action);
  }

  resume() {
    this.scene.get(this.parentKey).resumeGame();
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    this.save = this.game.registry.get('save');
    const stats = data.stats || {};
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#111827');
    this.add.image(width / 2, height / 2, `env-${this.save.selectedEnvironment}-distant`).setDisplaySize(width, height).setAlpha(0.72);
    this.add.rectangle(width / 2, height / 2, width, height, 0x070816, 0.55);
    this.add.text(width / 2, 105, 'Run Complete', {
      fontFamily: 'Space Grotesk, Arial',
      fontSize: '56px',
      color: '#fff7d6',
      fontStyle: '700',
    }).setOrigin(0.5);
    const lines = [
      `Distance ${Math.floor(stats.distance || 0).toLocaleString()} m`,
      `Score ${Math.floor(stats.score || 0).toLocaleString()}`,
      `Lotus coins ${stats.coins || 0}`,
      `Backflips ${stats.flips || 0}`,
      `Best ${Math.floor(this.save.bestDistance).toLocaleString()} m`,
    ];
    this.add.text(width / 2, 205, lines.join('\n'), {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '22px',
      color: '#f8e7bd',
      align: 'center',
      lineSpacing: 14,
    }).setOrigin(0.5, 0);
    this.button(width / 2, height - 150, 'Restart', 'icon-restart', () => this.scene.start('GameScene'));
    this.button(width / 2, height - 82, 'Main Menu', 'icon-home', () => this.scene.start('MenuScene'));
  }

  button(x, y, label, icon, action) {
    const bg = this.add.rectangle(x, y, 280, 54, 0x1f2937, 0.92).setStrokeStyle(1, 0xf5c86a, 0.5).setInteractive({ useHandCursor: true });
    this.add.image(x - 108, y, icon).setDisplaySize(27, 27);
    this.add.text(x - 74, y, label, { fontFamily: 'Inter, Arial', fontSize: '18px', color: '#fff7d6', fontStyle: '700' }).setOrigin(0, 0.5);
    bg.on('pointerdown', action);
  }
}

function createGameConfig(parent, save, audio) {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#16102f',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    scene: [PreloadScene, MenuScene, GameScene, PauseScene, GameOverScene],
    callbacks: {
      postBoot: (game) => {
        game.registry.set('save', save);
        game.registry.set('audio', audio);
      },
    },
  };
}

function EndlessSkatingPage() {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 820);
    };
    handleOrientation();
    window.addEventListener('resize', handleOrientation);
    return () => window.removeEventListener('resize', handleOrientation);
  }, []);

  useEffect(() => {
    if (!mountRef.current || gameRef.current) return undefined;
    document.body.classList.add('skating-route-active');
    const save = loadSaveData();
    const audio = new AudioManager(save);
    const game = new Phaser.Game(createGameConfig(mountRef.current, save, audio));
    gameRef.current = game;

    return () => {
      document.body.classList.remove('skating-route-active');
      audio.dispose();
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <main className="skating-game-page">
      <div ref={mountRef} className="skating-phaser-shell" aria-label="Sri Lankan Endless Skating game canvas" />
      <Link className="skating-home-link" to="/games">
        <img src={homeIcon} alt="" aria-hidden="true" />
        Games
      </Link>
      {isPortrait ? (
        <div className="skating-orientation">
          <h1>Rotate for the best ride</h1>
          <p>This game is designed as a wide cinematic skating run. Landscape mode keeps the hills, jumps and controls readable.</p>
        </div>
      ) : null}
    </main>
  );
}

export default EndlessSkatingPage;
