// tslint:disable
/* eslint-disable */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Play,
  RotateCw,
  Pause,
  Volume2,
  VolumeX,
  HelpCircle,
  Home,
  Shield,
  Zap,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Trophy,
  Activity,
  Compass,
} from 'lucide-react';
import {getConfig, THEME} from './constants';
import BackgroundMusic from './utils/BackgroundMusic';
import {
  createFixedStepper,
  drawAsset,
  formatTime,
  GameState,
  MenuOverlay,
  Overlay,
  prepareCanvas,
  useAssets,
  useAutoFocus,
  useInput,
  useIsMobile,
  gameAudio,
  clamp,
} from './utils/helper';
import {
  usePlayground,
  usePlaygroundGameLifecycle,
  useRpc,
} from './utils/usePlayground';
import {SpriteRenderer, SpriteActionConfig, SpriteAnimationState} from './SpriteRenderer';

const BACKGROUND_MUSIC_URL = 'assets/audio/bgm_ceylon_groove.mp3';

interface LandmarkInfo {
  key: string;
  name: string;
  zone: string;
  icon: string;
  color: string;
}

const LANDMARKS: LandmarkInfo[] = [
  {
    key: 'layer_landmark_stupa',
    name: 'Ruwanwelisaya Stupa',
    zone: 'Sacred Anuradhapura',
    icon: '🛕',
    color: '#F59E0B',
  },
  {
    key: 'layer_landmark_sigiriya',
    name: 'Sigiriya Rock Fortress',
    zone: 'Lion Rock Citadel',
    icon: '🏰',
    color: '#F97316',
  },
  {
    key: 'layer_landmark_ella_bridge',
    name: 'Nine Arch Bridge',
    zone: 'Ella Highlands',
    icon: '🌉',
    color: '#10B981',
  },
  {
    key: 'layer_landmark_lotus_tower',
    name: 'Colombo Lotus Tower',
    zone: 'Colombo Coastal Skyline',
    icon: '🪷',
    color: '#EC4899',
  },
];

// Asset manifest mapping with 3-layer background and landmarks system
const ASSETS_MANIFEST: Record<string, string> = {
  bg_lanka_sunset_sky: 'assets/images/bg_lanka_sunset_sky.png',
  layer_lanka_stupa_hills: 'assets/images/layer_lanka_stupa_hills.png',
  layer_lanka_jungle_palms: 'assets/images/layer_lanka_jungle_palms.png',
  layer_landmark_stupa: 'assets/images/layer_landmark_stupa.png',
  layer_landmark_sigiriya: 'assets/images/layer_landmark_sigiriya.png',
  layer_landmark_ella_bridge: 'assets/images/layer_landmark_ella_bridge.png',
  layer_landmark_lotus_tower: 'assets/images/layer_landmark_lotus_tower.png',
  obstacle_tuk_tuk: 'assets/images/obstacle_tuk_tuk.png',
  obstacle_coconut_cart: 'assets/images/obstacle_coconut_cart.png',
  obstacle_wooden_roadblock: 'assets/images/obstacle_wooden_roadblock.png',
  obstacle_clay_pot: 'assets/images/obstacle_clay_pot.png',
  obstacle_hanging_banner: 'assets/images/obstacle_hanging_banner.png',
  item_ancient_coin: 'assets/images/item_ancient_coin.png',
  item_king_coconut_powerup: 'assets/images/item_king_coconut_powerup.png',
  item_ceylon_ruby: 'assets/images/item_ceylon_ruby.png',
  ui_heart_icon: 'assets/images/ui_heart_icon.png',
  player_idle: 'assets/images/player_lanka_skater_idle.png',
  player_run: 'assets/images/player_lanka_skater_run.png',
  player_jump: 'assets/images/player_lanka_skater_jump.png',
  player_ground_slide: 'assets/images/player_lanka_skater_ground_slide.png',
  player_hurt: 'assets/images/player_lanka_skater_hurt.png',
  player_death: 'assets/images/player_lanka_skater_death.png',
  player_dizzy: 'assets/images/player_lanka_skater_dizzy.png',
};

// Spritesheet configuration
const PLAYER_SPRITE_CONFIGS: Record<string, SpriteActionConfig> = {
  RUN: {
    imageUrl: 'player_run',
    frameWidth: 512,
    frameHeight: 512,
    totalFrames: 16,
    fps: 16,
    loop: true,
  },
  JUMP: {
    imageUrl: 'player_jump',
    frameWidth: 512,
    frameHeight: 512,
    totalFrames: 16,
    fps: 16,
    loop: false,
  },
  GROUND_SLIDE: {
    imageUrl: 'player_ground_slide',
    frameWidth: 512,
    frameHeight: 512,
    totalFrames: 16,
    fps: 16,
    loop: true,
  },
  IDLE: {
    imageUrl: 'player_idle',
    frameWidth: 512,
    frameHeight: 512,
    totalFrames: 16,
    fps: 8,
    loop: true,
  },
  HURT: {
    imageUrl: 'player_hurt',
    frameWidth: 512,
    frameHeight: 512,
    totalFrames: 16,
    fps: 8,
    loop: false,
  },
  DEATH: {
    imageUrl: 'player_death',
    frameWidth: 512,
    frameHeight: 512,
    totalFrames: 16,
    fps: 8,
    loop: false,
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation?: number;
  rotSpeed?: number;
  type?: 'spark' | 'petal' | 'dust' | 'tea_leaf';
}

interface GhostTrail {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
  color: string;
  rotation: number;
  isSliding: boolean;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Obstacle {
  id: number;
  type: 'tuk_tuk' | 'coconut_cart' | 'roadblock' | 'clay_pot' | 'hanging_banner';
  x: number;
  y: number;
  width: number;
  height: number;
  speedMultiplier: number;
  hit: boolean;
  isOverhead: boolean;
}

interface Collectible {
  id: number;
  type: 'coin' | 'king_coconut' | 'ruby' | 'lotus' | 'tea_leaf';
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  baseY: number;
  bobTimer: number;
}

type DeckStyle = 'lotus' | 'batik' | 'emerald';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepperRef = useRef<ReturnType<typeof createFixedStepper>>();
  const lastCancelRef = useRef(false);

  // Playground SDK integration
  const {sdk, isReady} = usePlayground();
  const [exitChat] = useRpc<Record<string, unknown>, void>('ExitChat');

  const {assets, isReady: assetsReady} = useAssets(ASSETS_MANIFEST);
  const isMobile = useIsMobile();

  const canvasWidth = Number(getConfig('baseCanvasWidth')) || 1280;
  const canvasHeight = Number(getConfig('baseCanvasHeight')) || 720;
  const groundY = Number(getConfig('groundY')) || 620;

  if (!stepperRef.current) {
    const stepMs = Number(getConfig('stepMs')) || 16.666;
    const maxSubSteps = Number(getConfig('maxSubSteps')) || 5;
    stepperRef.current = createFixedStepper(stepMs, maxSubSteps);
  }

  // Audio mute states
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);

  // UI Dialog overlays
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<DeckStyle>('lotus');
  const [highScore, setHighScore] = useState(0);
  const [bestDistance, setBestDistance] = useState(0);

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    score: 0,
    level: 1,
    lives: Number(getConfig('startingLives')) || 3,
    distance: 0,
    coins: 0,
    combo: 0,
    maxCombo: 0,
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Track key back navigation
  useEffect(() => {
    (window as any).canHandleBackKey = gameState.status !== 'START';
  }, [gameState.status]);

  const inputRef = useInput(canvasRef, true, {
    width: canvasWidth,
    height: canvasHeight,
  });

  // Mobile virtual touch buttons state
  const touchJumpRef = useRef(false);
  const touchSlideRef = useRef(false);

  // Sound triggers on game over / victory
  useEffect(() => {
    if (gameState.status === 'GAME_OVER') {
      gameAudio.playDefeatMotif();
    } else if (gameState.status === 'VICTORY') {
      gameAudio.playVictoryFanfare();
    }
  }, [gameState.status]);

  // Sprite renderer ref
  const spriteRendererRef = useRef<SpriteRenderer>(
    new SpriteRenderer(PLAYER_SPRITE_CONFIGS)
  );

  // Skater state ref with enhanced physics, squash & stretch, lean angles, and coyote time
  const playerRef = useRef({
    x: 220,
    y: groundY - (Number(getConfig('playerHeight')) || 130),
    width: Number(getConfig('playerWidth')) || 130,
    height: Number(getConfig('playerHeight')) || 130,
    baseHeight: Number(getConfig('playerHeight')) || 130,
    slideHeight: Number(getConfig('playerSlideHeight')) || 65,
    vy: 0,
    isGrounded: true,
    isSliding: false,
    slideTimer: 0,
    jumpCount: 0,
    maxJumps: 2,
    invincibleTimer: 0,
    coconutShieldTimer: 0,
    rubyMultiplierTimer: 0,
    trickRotation: 0,
    trickType: 'none' as 'none' | 'kickflip' | 'spin360' | 'grab',
    isTrickSpinning: false,
    leanAngle: 0,
    squashScaleX: 1,
    squashScaleY: 1,
    wheelAngle: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    ghostTrails: [] as GhostTrail[],
    animState: {
      currentAction: 'RUN',
      currentFrame: 0,
      timer: 0,
    } as SpriteAnimationState,
  });

  // Simulation World State with dynamic 3-layer multi-depth parallax
  const worldRef = useRef({
    distance: 0,
    currentSpeed: Number(getConfig('baseSpeed')) || 480,
    bgSkyX: 0, // Layer 1 (0.10x parallax)
    bgStupaHillsX: 0, // Layer 2 (0.25x parallax - Buddhist stupa, Sigiriya rock, Nine Arch bridge, Lotus tower)
    bgJunglePalmsX: 0, // Layer 3 (0.45x parallax - midground tea & tropical palms)
    roadX: 0,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    nextObstacleDist: 600,
    nextItemDist: 280,
    nextId: 1,
    screenShake: 0,
    comboTimer: 0,
    lastMilestone: 0,
    currentLandmarkIndex: 0,
    nextLandmarkIndex: 1,
    currentLandmarkAlpha: 1.0,
    nextLandmarkAlpha: 0.0,
    lastAnnouncedLandmarkIndex: 0,
  });

  // Previous input flags for edge triggering
  const lastJumpInputRef = useRef(false);
  const lastSlideInputRef = useRef(false);

  // Initialize Game Run
  const initGame = useCallback(() => {
    const startLives = Number(getConfig('startingLives')) || 3;
    const baseSpeed = Number(getConfig('baseSpeed')) || 480;

    playerRef.current = {
      x: 220,
      y: groundY - (Number(getConfig('playerHeight')) || 130),
      width: Number(getConfig('playerWidth')) || 130,
      height: Number(getConfig('playerHeight')) || 130,
      baseHeight: Number(getConfig('playerHeight')) || 130,
      slideHeight: Number(getConfig('playerSlideHeight')) || 65,
      vy: 0,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
      jumpCount: 0,
      maxJumps: 2,
      invincibleTimer: 0,
      coconutShieldTimer: 0,
      rubyMultiplierTimer: 0,
      trickRotation: 0,
      trickType: 'none',
      isTrickSpinning: false,
      leanAngle: 0,
      squashScaleX: 1,
      squashScaleY: 1,
      wheelAngle: 0,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      ghostTrails: [],
      animState: {
        currentAction: 'RUN',
        currentFrame: 0,
        timer: 0,
      },
    };

    worldRef.current = {
      distance: 0,
      currentSpeed: baseSpeed,
      bgSkyX: 0,
      bgStupaHillsX: 0,
      bgJunglePalmsX: 0,
      roadX: 0,
      obstacles: [],
      collectibles: [],
      particles: [],
      floatingTexts: [],
      nextObstacleDist: 680,
      nextItemDist: 320,
      nextId: 1,
      screenShake: 0,
      comboTimer: 0,
      lastMilestone: 0,
      currentLandmarkIndex: 0,
      nextLandmarkIndex: 1,
      currentLandmarkAlpha: 1.0,
      nextLandmarkAlpha: 0.0,
      lastAnnouncedLandmarkIndex: 0,
    };

    setGameState({
      status: 'PLAYING',
      score: 0,
      level: 1,
      lives: startLives,
      distance: 0,
      coins: 0,
      combo: 0,
      maxCombo: 0,
    });

    setIsGameMenuOpen(false);
    setIsHowToPlayOpen(false);

    if (sdk) {
      sdk.startGame();
    }
  }, [sdk, groundY]);

  // Hook lifecycle reporting
  usePlaygroundGameLifecycle(gameState, sdk);

  // Autoplay handler
  const hasAutoplayed = useRef(false);
  useEffect(() => {
    if (
      !hasAutoplayed.current &&
      new URLSearchParams(window.location.search).has('autoplay')
    ) {
      hasAutoplayed.current = true;
      initGame();
    }
  }, [initGame]);

  // Particle Spawner Helper
  const spawnParticles = (
    x: number,
    y: number,
    count: number,
    color: string,
    speed = 180,
    size = 6,
    type: Particle['type'] = 'spark'
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.7 + 0.3) * speed;
      worldRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: Math.random() * size + 3,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 0.4 + 0.3,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 8,
        type,
      });
    }
  };

  // Add floating text
  const addFloatingText = (
    x: number,
    y: number,
    text: string,
    color = '#FBBF24',
    size = 22
  ) => {
    worldRef.current.floatingTexts.push({
      id: worldRef.current.nextId++,
      x,
      y,
      text,
      color,
      size,
      alpha: 1,
      life: 0,
      maxLife: 0.85,
    });
  };

  // Spawning procedural obstacle & item patterns
  const spawnObstaclesAndItems = (dist: number) => {
    const world = worldRef.current;
    const baseH = groundY;

    // Obstacle spawn
    if (dist >= world.nextObstacleDist) {
      const spacingMin = Number(getConfig('minObstacleSpacing')) || 380;
      world.nextObstacleDist = dist + spacingMin + Math.random() * 280;

      const rand = Math.random();
      let type: Obstacle['type'] = 'roadblock';
      let w = 140;
      let h = 85;
      let obsY = baseH - h;
      let isOverhead = false;
      let speedMult = 1.0;

      if (rand < 0.25) {
        // Wooden Roadblock
        type = 'roadblock';
        h = Number(getConfig('assetRoadblockHeight')) || 95;
        w = h * (Number(getConfig('assetRoadblockAspectRatio')) || 1.83);
        obsY = baseH - h;
      } else if (rand < 0.45) {
        // Clay Kalagediya Pot
        type = 'clay_pot';
        h = Number(getConfig('assetClayPotHeight')) || 75;
        w = h * (Number(getConfig('assetClayPotAspectRatio')) || 0.97);
        obsY = baseH - h;
      } else if (rand < 0.65) {
        // Rolling Coconut Pushcart (moves toward player)
        type = 'coconut_cart';
        h = Number(getConfig('assetCoconutCartHeight')) || 120;
        w = h * (Number(getConfig('assetCoconutCartAspectRatio')) || 1.6);
        obsY = baseH - h;
        speedMult = 1.25;
      } else if (rand < 0.82) {
        // Overhead Temple Festoon Banner (slide under!)
        type = 'hanging_banner';
        h = Number(getConfig('assetHangingBannerHeight')) || 230;
        w = h * (Number(getConfig('assetHangingBannerAspectRatio')) || 1.24);
        obsY = baseH - h;
        isOverhead = true;
      } else {
        // Decorated Sri Lankan Tuk-Tuk
        type = 'tuk_tuk';
        h = Number(getConfig('assetTukTukHeight')) || 155;
        w = h * (Number(getConfig('assetTukTukAspectRatio')) || 1.3);
        obsY = baseH - h;
      }

      world.obstacles.push({
        id: world.nextId++,
        type,
        x: canvasWidth + 80,
        y: obsY,
        width: w,
        height: h,
        speedMultiplier: speedMult,
        hit: false,
        isOverhead,
      });
    }

    // Collectibles spawn
    if (dist >= world.nextItemDist) {
      world.nextItemDist = dist + (Number(getConfig('coinPatternInterval')) || 220) + Math.random() * 180;

      const randItem = Math.random();
      if (randItem < 0.09) {
        // King Coconut Power-up
        const h = Number(getConfig('assetKingCoconutHeight')) || 60;
        const w = h * (Number(getConfig('assetKingCoconutAspectRatio')) || 0.85);
        world.collectibles.push({
          id: world.nextId++,
          type: 'king_coconut',
          x: canvasWidth + 100,
          y: baseH - 120,
          baseY: baseH - 120,
          width: w,
          height: h,
          collected: false,
          bobTimer: 0,
        });
      } else if (randItem < 0.18) {
        // Rare Ceylon Ruby
        const h = Number(getConfig('assetRubyHeight')) || 54;
        const w = h * (Number(getConfig('assetRubyAspectRatio')) || 0.75);
        world.collectibles.push({
          id: world.nextId++,
          type: 'ruby',
          x: canvasWidth + 100,
          y: baseH - 150,
          baseY: baseH - 150,
          width: w,
          height: h,
          collected: false,
          bobTimer: 0,
        });
      } else if (randItem < 0.3) {
        // Sacred Lotus Flower Collectible
        world.collectibles.push({
          id: world.nextId++,
          type: 'lotus',
          x: canvasWidth + 100,
          y: baseH - 110,
          baseY: baseH - 110,
          width: 48,
          height: 48,
          collected: false,
          bobTimer: 0,
        });
      } else if (randItem < 0.42) {
        // Fresh Ceylon Tea Leaves
        world.collectibles.push({
          id: world.nextId++,
          type: 'tea_leaf',
          x: canvasWidth + 100,
          y: baseH - 100,
          baseY: baseH - 100,
          width: 44,
          height: 44,
          collected: false,
          bobTimer: 0,
        });
      } else {
        // Golden Coins (Arc or Straight Line)
        const coinCount = Math.floor(Math.random() * 3) + 4;
        const isArc = Math.random() > 0.4;
        const coinH = Number(getConfig('assetCoinHeight')) || 46;
        const coinW = coinH * (Number(getConfig('assetCoinAspectRatio')) || 0.85);

        for (let i = 0; i < coinCount; i++) {
          const coinX = canvasWidth + 60 + i * 55;
          let coinY = baseH - 80;
          if (isArc) {
            const arcOffset = Math.sin((i / (coinCount - 1)) * Math.PI) * 115;
            coinY = baseH - 75 - arcOffset;
          }
          world.collectibles.push({
            id: world.nextId++,
            type: 'coin',
            x: coinX,
            y: coinY,
            baseY: coinY,
            width: coinW,
            height: coinH,
            collected: false,
            bobTimer: i * 0.25,
          });
        }
      }
    }
  };

  // Main Update Simulation Loop
  const update = (deltaTime: number) => {
    if (gameStateRef.current.status !== 'PLAYING' || isGameMenuOpen || isHowToPlayOpen) return;

    const dt = Math.min(deltaTime, 0.1);
    const p = playerRef.current;
    const world = worldRef.current;
    const input = inputRef.current;

    // Speed scaling
    const baseSpeed = Number(getConfig('baseSpeed')) || 480;
    const speedScalingRate = Number(getConfig('speedScalingRate')) || 8;
    world.currentSpeed = baseSpeed + (world.distance / 100) * speedScalingRate;

    // Track distance
    world.distance += (world.currentSpeed * dt) / 10;
    const currentMeters = Math.floor(world.distance);
    const newLevel = Math.floor(currentMeters / 500) + 1;

    // Milestone sound
    if (currentMeters > 0 && currentMeters % 250 === 0 && currentMeters !== world.lastMilestone) {
      world.lastMilestone = currentMeters;
      gameAudio.playLevelUpStinger();
      addFloatingText(canvasWidth / 2, 260, `MILESTONE: ${currentMeters}m!`, '#10B981', 28);
    }

    // Dynamic 4-Landmark Cycling & Smooth Eased Alpha Crossfade Blending
    const zoneDist = Number(getConfig('landmarkZoneDistance')) || 550;
    const transWindow = Number(getConfig('landmarkTransitionWindow')) || 160;
    const totalCycle = zoneDist * LANDMARKS.length;
    const landmarkCyclePos = world.distance % totalCycle;
    const landmarkZoneProgress = landmarkCyclePos / zoneDist;
    const currentLandmarkIdx = Math.floor(landmarkZoneProgress) % LANDMARKS.length;
    const nextLandmarkIdx = (currentLandmarkIdx + 1) % LANDMARKS.length;
    const subProgress = landmarkZoneProgress - Math.floor(landmarkZoneProgress);

    const fadeStart = Math.max(0, (zoneDist - transWindow) / zoneDist);
    let currAlpha = 1.0;
    let nextAlpha = 0.0;
    if (subProgress > fadeStart) {
      const t = (subProgress - fadeStart) / (1 - fadeStart);
      // S-curve smooth cosine ease for ultra-soft crossfade
      const easedT = 0.5 - 0.5 * Math.cos(t * Math.PI);
      nextAlpha = easedT;
      currAlpha = 1.0 - easedT;
    }

    world.currentLandmarkIndex = currentLandmarkIdx;
    world.nextLandmarkIndex = nextLandmarkIdx;
    world.currentLandmarkAlpha = currAlpha;
    world.nextLandmarkAlpha = nextAlpha;

    // Trigger landmark zone banner on entering new zone
    if (currentLandmarkIdx !== world.lastAnnouncedLandmarkIndex && currentMeters > 10) {
      world.lastAnnouncedLandmarkIndex = currentLandmarkIdx;
      const lm = LANDMARKS[currentLandmarkIdx];
      addFloatingText(canvasWidth / 2, 210, `ENTERING: ${lm.icon} ${lm.zone}`, lm.color, 26);
    }

    // 3-Layer Parallax Scrolling Accumulation at Staggered Multipliers:
    // Layer 1 (Furthest Back - Golden Sunset Sky): 0.08x
    // Layer 2 (Far Midground - Stupa, Sigiriya, Ella Bridge, Lotus Tower with Crossfade): 0.25x
    // Layer 3 (Midground - Jungle Palms & Coconut Trees): 0.55x
    world.bgSkyX += world.currentSpeed * 0.08 * dt;
    world.bgStupaHillsX += world.currentSpeed * 0.25 * dt;
    world.bgJunglePalmsX += world.currentSpeed * 0.55 * dt;
    world.roadX = (world.roadX + world.currentSpeed * dt) % 160;

    // Ambient floating particles
    if (Math.random() < 0.35) {
      const randP = Math.random();
      let pColor = '#FBBF24';
      let pSize = 5;
      let pType: Particle['type'] = 'petal';

      if (randP < 0.4) {
        pColor = Math.random() > 0.5 ? '#F472B6' : '#FDE047'; // Pink & Gold sacred lotus petals
        pSize = Math.random() * 4 + 4;
        pType = 'petal';
      } else if (randP < 0.75) {
        pColor = Math.random() > 0.5 ? '#10B981' : '#34D399'; // Emerald tea leaves
        pSize = Math.random() * 5 + 3;
        pType = 'tea_leaf';
      } else {
        pColor = '#F59E0B'; // Golden sun sparks
        pSize = Math.random() * 3 + 2;
        pType = 'spark';
      }

      world.particles.push({
        x: canvasWidth + 20,
        y: Math.random() * (groundY - 120) + 40,
        vx: -world.currentSpeed * (Math.random() * 0.4 + 0.6) - 50,
        vy: (Math.random() - 0.4) * 40,
        size: pSize,
        color: pColor,
        alpha: 0.85,
        life: 0,
        maxLife: Math.random() * 1.5 + 1.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 4,
        type: pType,
      });
    }

    // Input Handling
    const jumpPressed =
      input.actions.up ||
      input.actions.confirm ||
      touchJumpRef.current ||
      (input.pointer.down && input.pointer.y < canvasHeight * 0.5);

    const slidePressed =
      input.actions.down ||
      touchSlideRef.current ||
      (input.pointer.down && input.pointer.y >= canvasHeight * 0.5);

    // Update Coyote time & Jump buffer
    if (p.isGrounded) {
      p.coyoteTimer = 0.12; // 120ms leeway
    } else {
      p.coyoteTimer = Math.max(0, p.coyoteTimer - dt);
    }

    if (jumpPressed && !lastJumpInputRef.current) {
      p.jumpBufferTimer = 0.14; // 140ms buffer
    } else {
      p.jumpBufferTimer = Math.max(0, p.jumpBufferTimer - dt);
    }

    // --- Jump Handling with Pop Arc, Squash & Stretch ---
    const jumpVelocity = Number(getConfig('jumpVelocity')) || -880;
    const doubleJumpVelocity = Number(getConfig('doubleJumpVelocity')) || -780;

    // Trigger jump if buffered and (grounded or in coyote time)
    if (p.jumpBufferTimer > 0) {
      if (p.isGrounded || p.coyoteTimer > 0) {
        // First jump / Ollie
        p.vy = jumpVelocity;
        p.isGrounded = false;
        p.jumpCount = 1;
        p.isSliding = false;
        p.height = p.baseHeight;
        p.coyoteTimer = 0;
        p.jumpBufferTimer = 0;
        p.squashScaleX = 0.8; // launch stretch
        p.squashScaleY = 1.25;
        p.leanAngle = -0.18;

        gameAudio.playRetroJump();
        spawnParticles(p.x + p.width / 2, groundY, 10, '#D97706', 140, 5, 'dust');

        p.animState = {
          currentAction: 'JUMP',
          currentFrame: 0,
          timer: 0,
        };
      } else if (p.jumpCount < p.maxJumps) {
        // Aerial Double Jump / Kickflip / 360 Spin trick!
        p.vy = doubleJumpVelocity;
        p.jumpCount = 2;
        p.jumpBufferTimer = 0;
        p.isTrickSpinning = true;
        p.trickRotation = 0;
        p.squashScaleX = 1.15;
        p.squashScaleY = 0.85;

        // Random trick variety
        const trickRand = Math.random();
        p.trickType = trickRand < 0.4 ? 'kickflip' : trickRand < 0.75 ? 'spin360' : 'grab';

        gameAudio.playRetroJump();
        gameAudio.playPowerupChime();

        const trickPts = 300 * (p.rubyMultiplierTimer > 0 ? 3 : 1);
        setGameState((prev) => ({
          ...prev,
          score: prev.score + trickPts,
        }));

        const trickLabel =
          p.trickType === 'kickflip'
            ? '🔥 360 KICKFLIP!'
            : p.trickType === 'spin360'
            ? '⚡ BOARD SPIN 360!'
            : '🪷 LOTUS AIR GRAB!';

        addFloatingText(p.x + 30, p.y - 25, `${trickLabel} +${trickPts}`, '#FBBF24', 24);
        spawnParticles(p.x + p.width / 2, p.y + p.height / 2, 18, '#F59E0B', 240, 6, 'spark');
      }
    }

    // Variable jump height (jump cut on release)
    if (!jumpPressed && lastJumpInputRef.current && p.vy < -200) {
      p.vy *= 0.55;
    }
    lastJumpInputRef.current = jumpPressed;

    // --- Slide Handling with Spark Trails ---
    const slideDuration = Number(getConfig('slideDuration')) || 0.65;
    if (slidePressed && !lastSlideInputRef.current && p.isGrounded && !p.isSliding) {
      p.isSliding = true;
      p.slideTimer = slideDuration;
      p.height = p.slideHeight;
      p.y = groundY - p.slideHeight;
      p.squashScaleX = 1.3;
      p.squashScaleY = 0.7;
      p.leanAngle = 0.12;

      gameAudio.playJumpLandingThud();
      spawnParticles(p.x + p.width * 0.8, groundY, 8, '#F59E0B', 120, 4, 'spark');

      p.animState = {
        currentAction: 'GROUND_SLIDE',
        currentFrame: 0,
        timer: 0,
      };
    }
    lastSlideInputRef.current = slidePressed;

    // Update slide state
    if (p.isSliding) {
      p.slideTimer -= dt;
      // Glowing friction sparks and skid dust
      if (Math.random() < 0.65) {
        spawnParticles(p.x + p.width * 0.75, groundY - 4, 3, '#FBBF24', 90, 4, 'spark');
      }
      if (Math.random() < 0.3) {
        spawnParticles(p.x + p.width * 0.6, groundY - 2, 2, '#78350F', 60, 5, 'dust');
      }

      if (p.slideTimer <= 0) {
        p.isSliding = false;
        p.height = p.baseHeight;
        p.y = groundY - p.baseHeight;
        p.leanAngle = 0;
        if (p.isGrounded) {
          p.animState = {
            currentAction: 'RUN',
            currentFrame: 0,
            timer: 0,
          };
        }
      }
    }

    // --- Gravity & Vertical Movement ---
    if (!p.isGrounded) {
      const gravity =
        p.vy < 0
          ? Number(getConfig('gravityRising')) || 2400
          : Number(getConfig('gravityFalling')) || 3200;

      p.vy += gravity * dt;
      p.y += p.vy * dt;

      // In-air lean tilt matching trajectory
      p.leanAngle = clamp(p.vy / 1800, -0.25, 0.25);

      // Trick rotation animation
      if (p.isTrickSpinning) {
        p.trickRotation += Math.PI * 6.5 * dt;
        if (p.trickRotation >= Math.PI * 2) {
          p.trickRotation = 0;
          p.isTrickSpinning = false;
        }
      }

      // Check ground landing
      if (p.y >= groundY - p.height) {
        p.y = groundY - p.height;
        p.vy = 0;
        p.isGrounded = true;
        p.jumpCount = 0;
        p.isTrickSpinning = false;
        p.trickRotation = 0;
        p.leanAngle = 0;
        p.squashScaleX = 1.25; // landing compression squash
        p.squashScaleY = 0.75;

        gameAudio.playJumpLandingThud();
        spawnParticles(p.x + p.width / 2, groundY, 10, '#78350F', 110, 5, 'dust');

        if (!p.isSliding) {
          p.animState = {
            currentAction: 'RUN',
            currentFrame: 0,
            timer: 0,
          };
        }
      }
    }

    // Smooth squash & stretch recovery back to (1,1)
    p.squashScaleX += (1 - p.squashScaleX) * dt * 12;
    p.squashScaleY += (1 - p.squashScaleY) * dt * 12;

    // Rotate wheels
    p.wheelAngle = (p.wheelAngle + world.currentSpeed * dt * 0.08) % (Math.PI * 2);

    // Ghost trail / Motion blur for high speed, combo, or powerup
    if (world.currentSpeed > 560 || p.coconutShieldTimer > 0 || p.rubyMultiplierTimer > 0 || gameStateRef.current.combo > 2) {
      if (Math.random() < 0.4) {
        let ghostColor = '#F59E0B';
        if (p.coconutShieldTimer > 0) ghostColor = '#10B981';
        else if (p.rubyMultiplierTimer > 0) ghostColor = '#EF4444';

        p.ghostTrails.push({
          x: p.x,
          y: p.y,
          width: p.width,
          height: p.height,
          alpha: 0.6,
          color: ghostColor,
          rotation: p.trickRotation || p.leanAngle,
          isSliding: p.isSliding,
        });
      }
    }

    // Update Ghost Trails
    for (let i = p.ghostTrails.length - 1; i >= 0; i--) {
      const gt = p.ghostTrails[i];
      gt.x -= world.currentSpeed * 0.35 * dt;
      gt.alpha -= dt * 2.5;
      if (gt.alpha <= 0) {
        p.ghostTrails.splice(i, 1);
      }
    }

    // Timers & Power-ups
    if (p.invincibleTimer > 0) p.invincibleTimer -= dt;
    if (p.coconutShieldTimer > 0) {
      p.coconutShieldTimer -= dt;
      // Swirling golden coconut leaves aura
      if (Math.random() < 0.4) {
        const leafAngle = Math.random() * Math.PI * 2;
        const leafRadius = 65 + Math.random() * 20;
        world.particles.push({
          x: p.x + p.width / 2 + Math.cos(leafAngle) * leafRadius,
          y: p.y + p.height / 2 + Math.sin(leafAngle) * leafRadius,
          vx: -Math.sin(leafAngle) * 90 - world.currentSpeed * 0.2,
          vy: Math.cos(leafAngle) * 90,
          size: 6,
          color: Math.random() > 0.5 ? '#10B981' : '#FBBF24',
          alpha: 0.9,
          life: 0,
          maxLife: 0.45,
          rotation: Math.random() * Math.PI,
          rotSpeed: 5,
          type: 'petal',
        });
      }
    }

    if (p.rubyMultiplierTimer > 0) {
      p.rubyMultiplierTimer -= dt;
      if (Math.random() < 0.3) {
        spawnParticles(
          p.x + Math.random() * p.width,
          p.y + Math.random() * p.height,
          2,
          '#EF4444',
          80,
          5,
          'spark'
        );
      }
    }

    // Combo timer
    if (world.comboTimer > 0) {
      world.comboTimer -= dt;
      if (world.comboTimer <= 0) {
        setGameState((prev) => ({...prev, combo: 0}));
      }
    }

    // Screen shake decay
    if (world.screenShake > 0) {
      world.screenShake = Math.max(0, world.screenShake - dt * 15);
    }

    // Advance sprite animation
    p.animState = spriteRendererRef.current.getNextState(p.animState, dt);

    // Spawning updates
    spawnObstaclesAndItems(world.distance);

    // --- Update Obstacles ---
    for (let i = world.obstacles.length - 1; i >= 0; i--) {
      const obs = world.obstacles[i];
      obs.x -= world.currentSpeed * obs.speedMultiplier * dt;

      if (!obs.hit) {
        let collides = false;
        const playerBox = {
          x: p.x + 25,
          y: p.y + 15,
          w: p.width - 50,
          h: p.height - 20,
        };

        if (obs.isOverhead) {
          // Overhead banner: lethal only if player is upright
          const bannerLethalY = groundY - 220;
          const bannerLethalH = 150;
          if (
            playerBox.x < obs.x + obs.width - 40 &&
            playerBox.x + playerBox.w > obs.x + 40 &&
            playerBox.y < bannerLethalY + bannerLethalH &&
            playerBox.y + playerBox.h > bannerLethalY
          ) {
            collides = true;
          }
        } else {
          // Ground Obstacle AABB
          const obsBox = {
            x: obs.x + 15,
            y: obs.y + 10,
            w: obs.width - 30,
            h: obs.height - 15,
          };
          if (
            playerBox.x < obsBox.x + obsBox.w &&
            playerBox.x + playerBox.w > obsBox.x &&
            playerBox.y < obsBox.y + obsBox.h &&
            playerBox.y + playerBox.h > obsBox.y
          ) {
            collides = true;
          }
        }

        if (collides) {
          if (p.coconutShieldTimer > 0) {
            obs.hit = true;
            gameAudio.playChiptuneExplosion();
            spawnParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, 22, '#F59E0B', 260, 8, 'spark');
            addFloatingText(obs.x, obs.y - 10, 'SHIELD SMASH! +150', '#10B981', 22);
            setGameState((prev) => ({
              ...prev,
              score: prev.score + 150 * (p.rubyMultiplierTimer > 0 ? 3 : 1),
            }));
            world.screenShake = 6;
          } else if (p.invincibleTimer <= 0) {
            obs.hit = true;
            p.invincibleTimer = Number(getConfig('invincibilityDuration')) || 1.8;
            world.screenShake = 14;
            gameAudio.playGeneralDamage();
            spawnParticles(p.x + p.width / 2, p.y + p.height / 2, 18, '#DC2626', 220, 6, 'spark');
            addFloatingText(p.x + 20, p.y - 30, 'OUCH! -1 HEART', '#DC2626', 24);

            p.animState = {
              currentAction: 'HURT',
              currentFrame: 0,
              timer: 0,
            };

            setGameState((prev) => {
              const remainingLives = Math.max(0, (prev.lives || 1) - 1);
              if (remainingLives <= 0) {
                p.animState = {
                  currentAction: 'DEATH',
                  currentFrame: 0,
                  timer: 0,
                };
                return {
                  ...prev,
                  lives: 0,
                  status: 'GAME_OVER',
                };
              }
              return {
                ...prev,
                lives: remainingLives,
                combo: 0,
              };
            });
          }
        }
      }

      if (obs.x < -obs.width - 120) {
        world.obstacles.splice(i, 1);
      }
    }

    // --- Update Collectibles ---
    const multiplier = p.rubyMultiplierTimer > 0 ? 3 : 1;
    const isMagnetActive = p.coconutShieldTimer > 0;

    for (let i = world.collectibles.length - 1; i >= 0; i--) {
      const item = world.collectibles[i];
      item.x -= world.currentSpeed * dt;
      item.bobTimer += dt * 4;
      item.y = item.baseY + Math.sin(item.bobTimer) * 7;

      // Magnet pull
      if (isMagnetActive && !item.collected) {
        const dx = p.x + p.width / 2 - (item.x + item.width / 2);
        const dy = p.y + p.height / 2 - (item.y + item.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 380) {
          const pullSpeed = 700;
          item.x += (dx / dist) * pullSpeed * dt;
          item.y += (dy / dist) * pullSpeed * dt;
        }
      }

      // Collect check
      if (!item.collected) {
        const playerCenterX = p.x + p.width / 2;
        const playerCenterY = p.y + p.height / 2;
        const itemCenterX = item.x + item.width / 2;
        const itemCenterY = item.y + item.height / 2;

        const dist = Math.hypot(playerCenterX - itemCenterX, playerCenterY - itemCenterY);
        if (dist < 68) {
          item.collected = true;

          if (item.type === 'coin') {
            gameAudio.playCoinPickup();
            spawnParticles(itemCenterX, itemCenterY, 8, '#FBBF24', 160, 5, 'spark');
            world.comboTimer = 2.5;
            const newCombo = gameStateRef.current.combo + 1;
            const coinScore = 50 * multiplier * Math.min(newCombo, 5);

            addFloatingText(
              itemCenterX,
              itemCenterY - 15,
              newCombo > 1 ? `+${coinScore} (${newCombo}x)` : `+${coinScore}`,
              '#FBBF24',
              20
            );

            setGameState((prev) => ({
              ...prev,
              score: prev.score + coinScore,
              coins: (prev.coins || 0) + 1,
              combo: newCombo,
              maxCombo: Math.max(prev.maxCombo || 0, newCombo),
            }));
          } else if (item.type === 'lotus') {
            gameAudio.playPowerupChime();
            spawnParticles(itemCenterX, itemCenterY, 16, '#F472B6', 200, 6, 'petal');
            addFloatingText(itemCenterX, itemCenterY - 20, 'SACRED LOTUS! +150', '#F472B6', 22);
            setGameState((prev) => ({
              ...prev,
              score: prev.score + 150 * multiplier,
            }));
          } else if (item.type === 'tea_leaf') {
            gameAudio.playCoinPickup();
            spawnParticles(itemCenterX, itemCenterY, 14, '#10B981', 180, 5, 'tea_leaf');
            addFloatingText(itemCenterX, itemCenterY - 20, 'CEYLON TEA LEAF! +100', '#10B981', 22);
            setGameState((prev) => ({
              ...prev,
              score: prev.score + 100 * multiplier,
            }));
          } else if (item.type === 'king_coconut') {
            gameAudio.playPowerupChime();
            p.coconutShieldTimer = Number(getConfig('powerupCoconutDuration')) || 8.0;
            spawnParticles(itemCenterX, itemCenterY, 22, '#10B981', 250, 7, 'spark');
            addFloatingText(itemCenterX, itemCenterY - 20, 'KING COCONUT SHIELD & MAGNET!', '#10B981', 24);
            setGameState((prev) => ({
              ...prev,
              score: prev.score + 350 * multiplier,
            }));
          } else if (item.type === 'ruby') {
            gameAudio.playPowerupChime();
            p.rubyMultiplierTimer = Number(getConfig('powerupRubyDuration')) || 10.0;
            spawnParticles(itemCenterX, itemCenterY, 24, '#EF4444', 260, 7, 'spark');
            addFloatingText(itemCenterX, itemCenterY - 20, 'CEYLON RUBY! 3X MULTIPLIER!', '#EF4444', 24);
            setGameState((prev) => ({
              ...prev,
              score: prev.score + 500 * multiplier,
            }));
          }
        }
      }

      if (item.x < -item.width - 50 || item.collected) {
        world.collectibles.splice(i, 1);
      }
    }

    // --- Update Particles ---
    for (let i = world.particles.length - 1; i >= 0; i--) {
      const part = world.particles[i];
      part.life += dt;
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.alpha = Math.max(0, 1 - part.life / part.maxLife);
      if (part.rotSpeed) part.rotation = (part.rotation || 0) + part.rotSpeed * dt;

      if (part.life >= part.maxLife) {
        world.particles.splice(i, 1);
      }
    }

    // --- Update Floating Texts ---
    for (let i = world.floatingTexts.length - 1; i >= 0; i--) {
      const ft = world.floatingTexts[i];
      ft.life += dt;
      ft.y -= 45 * dt;
      ft.alpha = Math.max(0, 1 - ft.life / ft.maxLife);
      if (ft.life >= ft.maxLife) {
        world.floatingTexts.splice(i, 1);
      }
    }

    // Passive distance score
    setGameState((prev) => {
      const updatedDistance = Math.floor(world.distance);
      const updatedScore = prev.score + Math.floor(world.currentSpeed * dt * 0.05 * multiplier);
      if (updatedScore > highScore) setHighScore(updatedScore);
      if (updatedDistance > bestDistance) setBestDistance(updatedDistance);

      return {
        ...prev,
        distance: updatedDistance,
        level: newLevel,
        score: updatedScore,
      };
    });
  };

  // --- 4-Layer Multi-Depth Parallax Background & Foreground Renderers ---

  // Layer 1: Far Sky & Mountains Backdrop (0.10x Parallax)
  const renderLayer1SunsetSky = (ctx: CanvasRenderingContext2D, scrollX: number) => {
    const skyImg = assets['bg_lanka_sunset_sky'];
    const aspect = 1376 / 768; // 1.79167
    const tileH = canvasHeight;
    const tileW = Math.ceil(tileH * aspect);
    const offset = ((scrollX % tileW) + tileW) % tileW;

    if (skyImg && skyImg.complete && skyImg.naturalWidth > 0) {
      for (let x = -offset; x < canvasWidth + tileW; x += tileW - 1) {
        ctx.drawImage(skyImg, x, 0, tileW + 1, tileH);
      }
    } else {
      // Atmospheric Sunset Sky Fallback
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#7C2D12'); // Rich sunset terracotta orange
      skyGrad.addColorStop(0.4, '#EA580C');
      skyGrad.addColorStop(0.8, '#F59E0B');
      skyGrad.addColorStop(1, '#FEF08A');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Distant Sri Lankan Mountain Peaks
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= canvasWidth + 120; x += 40) {
        const my = groundY - 260 + Math.sin((x + scrollX) * 0.004) * 60 + Math.cos((x + scrollX * 0.7) * 0.009) * 25;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(canvasWidth + 120, groundY);
      ctx.closePath();
      ctx.fill();
    }

    // Glowing Golden Sunset Sun Disk
    const sunX = ((canvasWidth * 0.72 - scrollX * 0.25) % canvasWidth + canvasWidth) % canvasWidth;
    const sunY = 145;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 110);
    sunGrad.addColorStop(0, '#FFFBEB');
    sunGrad.addColorStop(0.3, '#FDE047');
    sunGrad.addColorStop(0.65, '#F59E0B');
    sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
    ctx.fill();
  };

  // Layer 2: Ancient Stupa, Sigiriya Rock, Nine Arch Bridge & Lotus Tower Far-Midground (0.28x Parallax)
  // Renders the 4 Sri Lankan landmarks with dynamic alpha crossfading and seamless horizontal scrolling
  const renderSingleLandmarkTile = (
    ctx: CanvasRenderingContext2D,
    landmarkKey: string,
    idx: number,
    scrollX: number,
    alpha: number
  ) => {
    if (alpha <= 0.002) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const img = assets[landmarkKey] || assets['layer_lanka_stupa_hills'];
    const aspect = 1376 / 768; // 1.79167
    const tileH = canvasHeight;
    const tileW = Math.ceil(tileH * aspect);
    const offset = ((scrollX % tileW) + tileW) % tileW;

    if (img && img.complete && img.naturalWidth > 0) {
      for (let x = -offset; x < canvasWidth + tileW; x += tileW - 1) {
        ctx.drawImage(img, x, 0, tileW + 1, tileH);
      }
    } else {
      // Procedural fallback tailored to each iconic landmark
      renderProceduralLandmark(ctx, idx, scrollX);
    }

    // Harmonized Golden Sunset Color Grading & Atmospheric Haze Tint
    const tintGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    tintGrad.addColorStop(0, 'rgba(255, 158, 66, 0.16)');
    tintGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.22)');
    tintGrad.addColorStop(1, 'rgba(217, 119, 6, 0.28)');
    ctx.fillStyle = tintGrad;
    ctx.fillRect(0, 0, canvasWidth, groundY);

    ctx.restore();
  };

  const renderProceduralLandmark = (ctx: CanvasRenderingContext2D, idx: number, scrollX: number) => {
    ctx.save();
    if (idx === 0) {
      // Anuradhapura Stupa & Rolling Heritage Hills
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= canvasWidth + 100; x += 30) {
        const hy = groundY - 170 + Math.sin((x + scrollX) * 0.006) * 35;
        ctx.lineTo(x, hy);
      }
      ctx.lineTo(canvasWidth + 100, groundY);
      ctx.closePath();
      ctx.fill();

      // Golden Stupa Silhouette
      const stupaPeriod = 600;
      const stupaX = ((stupaPeriod - (scrollX % stupaPeriod) + stupaPeriod) % stupaPeriod) - 80;
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(stupaX, groundY - 140, 50, Math.PI, 0, false);
      ctx.fill();
      ctx.fillRect(stupaX - 14, groundY - 190, 28, 16);
      ctx.beginPath();
      ctx.moveTo(stupaX - 10, groundY - 190);
      ctx.lineTo(stupaX + 10, groundY - 190);
      ctx.lineTo(stupaX, groundY - 240);
      ctx.closePath();
      ctx.fill();
    } else if (idx === 1) {
      // Sigiriya Rock Fortress Monumental Monolith
      const sigiriyaPeriod = 750;
      const sigX = ((sigiriyaPeriod - (scrollX % sigiriyaPeriod) + sigiriyaPeriod) % sigiriyaPeriod) - 120;
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.moveTo(sigX - 90, groundY - 40);
      ctx.lineTo(sigX - 65, groundY - 230);
      ctx.lineTo(sigX + 75, groundY - 235);
      ctx.lineTo(sigX + 100, groundY - 40);
      ctx.closePath();
      ctx.fill();
      // Citadel terrace on summit
      ctx.fillStyle = '#D97706';
      ctx.fillRect(sigX - 55, groundY - 245, 120, 12);
    } else if (idx === 2) {
      // Ella Nine Arch Viaduct Bridge
      const bridgePeriod = 680;
      const bX = ((bridgePeriod - (scrollX % bridgePeriod) + bridgePeriod) % bridgePeriod) - 100;
      ctx.fillStyle = '#065F46';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= canvasWidth + 100; x += 40) {
        ctx.lineTo(x, groundY - 160 + Math.cos((x + scrollX) * 0.008) * 45);
      }
      ctx.lineTo(canvasWidth + 100, groundY);
      ctx.closePath();
      ctx.fill();
      // Masonry arches
      ctx.fillStyle = '#78350F';
      ctx.fillRect(bX - 140, groundY - 170, 320, 18);
      for (let arch = 0; arch < 5; arch++) {
        const ax = bX - 110 + arch * 60;
        ctx.fillRect(ax - 10, groundY - 152, 20, 120);
        ctx.beginPath();
        ctx.arc(ax + 20, groundY - 150, 18, Math.PI, 0, false);
        ctx.fill();
      }
    } else {
      // Colombo Lotus Tower
      const towerPeriod = 650;
      const tX = ((towerPeriod - (scrollX % towerPeriod) + towerPeriod) % towerPeriod) - 80;
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(tX - 8, groundY - 330, 16, 300);
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.ellipse(tX, groundY - 260, 32, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.ellipse(tX, groundY - 280, 24, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E0E7FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tX, groundY - 280);
      ctx.lineTo(tX, groundY - 360);
      ctx.stroke();
    }
    ctx.restore();
  };

  const renderLayer2Landmarks = (ctx: CanvasRenderingContext2D, scrollX: number) => {
    const world = worldRef.current;
    const currIdx = world.currentLandmarkIndex || 0;
    const nextIdx = world.nextLandmarkIndex || 0;
    const currAlpha = world.currentLandmarkAlpha ?? 1.0;
    const nextAlpha = world.nextLandmarkAlpha ?? 0.0;

    // Draw primary current landmark
    renderSingleLandmarkTile(ctx, LANDMARKS[currIdx].key, currIdx, scrollX, currAlpha);

    // Draw next landmark crossfade if transitioning
    if (nextAlpha > 0.002) {
      renderSingleLandmarkTile(ctx, LANDMARKS[nextIdx].key, nextIdx, scrollX, nextAlpha);
    }
  };

  // Layer 3: Tropical Palms & Jungle Canopy Midground (0.55x Parallax - in front of landmarks)
  const renderLayer3JunglePalms = (ctx: CanvasRenderingContext2D, scrollX: number) => {
    const junglePalmsImg = assets['layer_lanka_jungle_palms'] || assets['bg_tea_estate_foreground'];
    const aspect = 1376 / 445; // 3.09213
    // Positioned across the midground in front of the landmarks
    const layerH = 290;
    const layerW = Math.ceil(layerH * aspect);
    const layerY = groundY - layerH + 15;
    const offset = ((scrollX % layerW) + layerW) % layerW;

    ctx.save();
    if (junglePalmsImg && junglePalmsImg.complete && junglePalmsImg.naturalWidth > 0) {
      for (let x = -offset; x < canvasWidth + layerW; x += layerW - 1) {
        ctx.drawImage(junglePalmsImg, x, layerY, layerW + 1, layerH);
      }
    } else {
      // Procedural Lush Coconut Palms & Tropical Canopy Fallback
      ctx.fillStyle = '#064E3B';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= canvasWidth + 100; x += 35) {
        const py = groundY - 100 + Math.sin((x + scrollX) * 0.012) * 25;
        ctx.lineTo(x, py);
      }
      ctx.lineTo(canvasWidth + 100, groundY);
      ctx.closePath();
      ctx.fill();

      // Swaying Coconut Palm Trunks
      const palmPeriod = 320;
      const palmOffset = ((scrollX % palmPeriod) + palmPeriod) % palmPeriod;
      for (let px = -palmOffset; px < canvasWidth + palmPeriod; px += palmPeriod) {
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(px, groundY);
        ctx.quadraticCurveTo(px + 15, groundY - 60, px + 8, groundY - 130);
        ctx.stroke();

        // Palm Fronds
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 3.5;
        const frondAngles = [-1.0, -0.5, 0, 0.5, 1.0];
        for (const ang of frondAngles) {
          ctx.beginPath();
          ctx.moveTo(px + 8, groundY - 130);
          ctx.lineTo(px + 8 + Math.cos(ang) * 45, groundY - 130 + Math.sin(ang) * 35);
          ctx.stroke();
        }
      }
    }

    // Atmospheric depth attenuation & golden sunset rim tint on Layer 3
    const jungleHaze = ctx.createLinearGradient(0, layerY, 0, groundY);
    jungleHaze.addColorStop(0, 'rgba(251, 146, 60, 0.12)');
    jungleHaze.addColorStop(0.7, 'rgba(180, 83, 9, 0.15)');
    jungleHaze.addColorStop(1, 'rgba(20, 10, 5, 0.22)');
    ctx.fillStyle = jungleHaze;
    ctx.fillRect(0, layerY, canvasWidth, layerH);
    ctx.restore();
  };

  // Main Canvas Render
  const draw = (ctx: CanvasRenderingContext2D) => {
    prepareCanvas(ctx, canvasWidth, canvasHeight);

    const world = worldRef.current;
    const p = playerRef.current;

    ctx.save();

    // Screen Shake on impact
    if (world.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * world.screenShake;
      const shakeY = (Math.random() - 0.5) * world.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    // 1. LAYER 1: SUNSET SKY & DISTANT MOUNTAINS (0.10x Parallax)
    renderLayer1SunsetSky(ctx, world.bgSkyX);

    // 2. LAYER 2: 4 ICONIC SRI LANKAN LANDMARKS CYCLING WITH DYNAMIC CROSSFADE (0.28x Parallax)
    renderLayer2Landmarks(ctx, world.bgStupaHillsX);

    // 3. LAYER 3: TROPICAL PALMS & JUNGLE CANOPY (0.45x Parallax)
    renderLayer3JunglePalms(ctx, world.bgJunglePalmsX);

    // 4. ROAD BED FOUNDATION WITH ENHANCED CONTRAST & HORIZON SEPARATION
    const roadTopY = groundY;
    const roadHeight = canvasHeight - groundY;

    // Horizon lane separation shadow to distinctly pop from foliage
    ctx.fillStyle = 'rgba(10, 5, 2, 0.85)';
    ctx.fillRect(0, roadTopY - 6, canvasWidth, 6);

    // Deep rich asphalt/cobblestone road gradient with strong contrast
    const roadGrad = ctx.createLinearGradient(0, roadTopY, 0, canvasHeight);
    roadGrad.addColorStop(0, '#C25E00'); // Vibrant warm Ceylon terracotta-amber road top
    roadGrad.addColorStop(0.08, '#853A05');
    roadGrad.addColorStop(0.35, '#451A03'); // Rich dark contrast body
    roadGrad.addColorStop(1, '#1A0B02');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, roadTopY, canvasWidth, roadHeight);

    // Crisp Luminous Golden Edge Curb Stripe & Specular Glow
    ctx.save();
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#FDE68A';
    ctx.fillRect(0, roadTopY - 2, canvasWidth, 3);
    ctx.restore();

    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, roadTopY + 1, canvasWidth, 4);

    // Distinct Asphalt / Cobblestone Highlights & Road Markings
    const dashSpacing = 80;
    const dashOffset = (world.roadX % dashSpacing + dashSpacing) % dashSpacing;
    for (let x = -dashOffset; x < canvasWidth + dashSpacing; x += dashSpacing) {
      // Crisp road lane marker with subtle drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(x + 1, roadTopY + 29, 46, 7);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(x, roadTopY + 27, 45, 6);

      // Cobblestone micro-highlights
      ctx.fillStyle = 'rgba(255, 237, 213, 0.18)';
      ctx.fillRect(x + 15, roadTopY + 54, 22, 3);
      ctx.fillRect(x + 50, roadTopY + 70, 18, 3);
    }

    // 5. GAMEPLAY LAYER: COLLECTIBLES
    for (const item of world.collectibles) {
      if (item.collected) continue;

      if (item.type === 'coin') {
        drawAsset(
          ctx,
          assets['item_ancient_coin'],
          item.x,
          item.y,
          item.width,
          item.height,
          (c) => {
            c.fillStyle = '#FBBF24';
            c.beginPath();
            c.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = '#D97706';
            c.lineWidth = 2;
            c.stroke();
          }
        );
      } else if (item.type === 'lotus') {
        // Glowing Sacred Lotus Flower
        ctx.save();
        ctx.shadowColor = '#F472B6';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#EC4899';
        const cx = item.x + item.width / 2;
        const cy = item.y + item.height / 2;
        for (let pIdx = 0; pIdx < 6; pIdx++) {
          const ang = (pIdx * Math.PI) / 3;
          ctx.beginPath();
          ctx.ellipse(cx + Math.cos(ang) * 10, cy + Math.sin(ang) * 10, 10, 5, ang, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (item.type === 'tea_leaf') {
        // Emerald Ceylon Tea Leaf
        ctx.save();
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#10B981';
        const cx = item.x + item.width / 2;
        const cy = item.y + item.height / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 18, 8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#065F46';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      } else if (item.type === 'king_coconut') {
        ctx.save();
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 18;
        drawAsset(
          ctx,
          assets['item_king_coconut_powerup'],
          item.x,
          item.y,
          item.width,
          item.height,
          (c) => {
            c.fillStyle = '#F59E0B';
            c.beginPath();
            c.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
            c.fill();
          }
        );
        ctx.restore();
      } else if (item.type === 'ruby') {
        ctx.save();
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 20;
        drawAsset(
          ctx,
          assets['item_ceylon_ruby'],
          item.x,
          item.y,
          item.width,
          item.height,
          (c) => {
            c.fillStyle = '#EF4444';
            c.fillRect(item.x, item.y, item.width, item.height);
          }
        );
        ctx.restore();
      }
    }

    // 6. GAMEPLAY LAYER: OBSTACLES WITH CRISP CONTRAST & SHADOWS
    for (const obs of world.obstacles) {
      let assetKey = 'obstacle_wooden_roadblock';
      if (obs.type === 'tuk_tuk') assetKey = 'obstacle_tuk_tuk';
      else if (obs.type === 'coconut_cart') assetKey = 'obstacle_coconut_cart';
      else if (obs.type === 'clay_pot') assetKey = 'obstacle_clay_pot';
      else if (obs.type === 'hanging_banner') assetKey = 'obstacle_hanging_banner';

      // Drop shadow on road for grounded obstacles
      if (!obs.isOverhead) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.beginPath();
        ctx.ellipse(obs.x + obs.width / 2, groundY + 3, obs.width * 0.48, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      if (obs.hit) {
        ctx.globalAlpha = 0.5;
      }

      // Crisp contrast rim highlight
      ctx.shadowColor = obs.isOverhead ? 'rgba(244, 114, 182, 0.4)' : 'rgba(251, 191, 36, 0.35)';
      ctx.shadowBlur = 8;

      drawAsset(
        ctx,
        assets[assetKey],
        obs.x,
        obs.y,
        obs.width,
        obs.height,
        (c) => {
          c.fillStyle = obs.isOverhead ? '#9333EA' : '#DC2626';
          c.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
      );
      ctx.restore();

      // Warning indicator for fast oncoming obstacles
      if (obs.x > canvasWidth - 140 && obs.x < canvasWidth + 40 && (obs.type === 'tuk_tuk' || obs.type === 'coconut_cart')) {
        ctx.save();
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('⚠ DANGER', canvasWidth - 110, obs.y - 12);
        ctx.restore();
      }
    }

    // 7. GHOST TRAILS (Motion blur speed lines)
    for (const gt of p.ghostTrails) {
      ctx.save();
      ctx.globalAlpha = gt.alpha;
      ctx.fillStyle = gt.color;
      ctx.translate(gt.x + gt.width / 2, gt.y + gt.height / 2);
      ctx.rotate(gt.rotation);
      ctx.fillRect(-gt.width / 2 + 10, -gt.height / 2 + 10, gt.width - 20, gt.height - 20);
      ctx.restore();
    }

    // 8. GAMEPLAY LAYER: LANKA SKATER (Player)
    ctx.save();

    // Invincible Blink
    if (p.invincibleTimer > 0 && Math.floor(p.invincibleTimer * 10) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Ground Contact Drop Shadow with Depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.ellipse(
      p.x + p.width / 2,
      groundY + 2,
      p.isSliding ? 52 : 42,
      9,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Player Soft Ambient Rim-Light / Backlight Glow for Visual Pop
    ctx.save();
    const glowGrad = ctx.createRadialGradient(
      p.x + p.width / 2,
      p.y + p.height / 2,
      p.width * 0.2,
      p.x + p.width / 2,
      p.y + p.height / 2,
      p.width * 0.75
    );
    glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)'); // Warm golden backlight halo
    glowGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.18)');
    glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // King Coconut Shield Aura
    if (p.coconutShieldTimer > 0) {
      ctx.save();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#34D399';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(
        p.x + p.width / 2,
        p.y + p.height / 2,
        p.width / 2 + 12,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }

    // Ceylon Ruby 3x Multiplier Aura
    if (p.rubyMultiplierTimer > 0) {
      ctx.save();
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x, p.y, p.width, p.height);
      ctx.restore();
    }

    // Skater Body & Board Rendering with Lean, Squash & Stretch, and Trick Spins
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
    ctx.rotate(p.isTrickSpinning ? p.trickRotation : p.leanAngle);
    ctx.scale(p.squashScaleX, p.squashScaleY);

    // Subtle crisp ambient contrast glow
    ctx.shadowColor = 'rgba(254, 215, 170, 0.6)';
    ctx.shadowBlur = 10;

    spriteRendererRef.current.draw(
      ctx,
      p.animState,
      -p.width / 2,
      -p.height / 2,
      p.width,
      p.height,
      assets
    );

    // Skateboard Deck Accent Stripe
    let deckAccentColor = '#F59E0B';
    if (selectedDeck === 'batik') deckAccentColor = '#DC2626';
    else if (selectedDeck === 'emerald') deckAccentColor = '#10B981';

    if (p.isGrounded && !p.isSliding) {
      ctx.fillStyle = deckAccentColor;
      ctx.fillRect(-p.width / 2 + 30, p.height / 2 - 14, 60, 4);
    }

    ctx.restore();

    // 9. PARTICLE EFFECTS
    for (const part of world.particles) {
      ctx.save();
      ctx.globalAlpha = part.alpha;
      ctx.fillStyle = part.color;
      ctx.translate(part.x, part.y);
      if (part.rotation) ctx.rotate(part.rotation);

      if (part.type === 'petal') {
        ctx.beginPath();
        ctx.ellipse(0, 0, part.size, part.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (part.type === 'tea_leaf') {
        ctx.beginPath();
        ctx.ellipse(0, 0, part.size, part.size * 0.4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (part.type === 'spark') {
        ctx.fillRect(-part.size / 2, -part.size / 2, part.size, part.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0.1, part.size), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 11. FLOATING TEXT POPUPS
    for (const ft of world.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.font = `bold ${ft.size}px sans-serif`;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // 12. ACTIVE POWERUP BADGES
    if (p.coconutShieldTimer > 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.fillRect(p.x - 10, p.y - 30, 110, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`SHIELD: ${p.coconutShieldTimer.toFixed(1)}s`, p.x - 4, p.y - 16);
      ctx.restore();
    }
    if (p.rubyMultiplierTimer > 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.fillRect(p.x - 10, p.y - 54, 110, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`3X MULTI: ${p.rubyMultiplierTimer.toFixed(1)}s`, p.x - 4, p.y - 40);
      ctx.restore();
    }

    ctx.restore();
  };

  // Game Loop Refs
  const updateRef = useRef(update);
  const drawRef = useRef(draw);
  updateRef.current = update;
  drawRef.current = draw;

  useEffect(() => {
    let raf = 0;
    const loop = (time: number) => {
      // Global Pause & Back
      if (inputRef.current) {
        const cancelPressed = inputRef.current.actions.cancel;
        if (cancelPressed && !lastCancelRef.current) {
          const currentStatus = gameStateRef.current.status;
          if (currentStatus === 'PLAYING') {
            setIsGameMenuOpen((prev) => !prev);
          } else if (currentStatus === 'START') {
            void exitChat({});
          } else if (['GAME_OVER', 'VICTORY'].includes(currentStatus)) {
            setGameState((prev) => ({...prev, status: 'START'}));
          }
        }
        lastCancelRef.current = cancelPressed;
      }

      stepperRef.current?.(time, (dt) => updateRef.current(dt));

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) drawRef.current(ctx);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [exitChat]);

  const isMusicPlaying = gameState.status === 'PLAYING' && !isGameMenuOpen && !isHowToPlayOpen;
  const startButtonRef = useAutoFocus<HTMLButtonElement>(gameState.status === 'START');

  return (
    <div className="fixed inset-0 overflow-hidden touch-none flex flex-col items-center justify-between bg-slate-950 text-white select-none">
      {/* Loading Overlay */}
      {!assetsReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
          <div className="text-2xl font-bold text-yellow-400 animate-pulse mb-3">
            🛹 Loading Lanka Dash...
          </div>
          <div className="text-sm text-slate-400">Loading Multi-Depth Sri Lankan Parallax Layers & Landmarks...</div>
        </div>
      )}

      {/* Background Music */}
      <BackgroundMusic
        url={BACKGROUND_MUSIC_URL}
        isPlaying={isMusicPlaying}
        isMuted={isMusicMuted}
      />

      {/* Top HUD Bar */}
      <header className="w-full bg-slate-900/90 border-b border-amber-900/40 px-4 py-2 z-20 shrink-0 flex items-center justify-between">
        {/* Left Side: Score & Distance */}
        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm">
          <div className="flex items-center gap-1 font-black text-yellow-400">
            <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>{gameState.score.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-emerald-400">
            <Activity className="w-4 h-4 shrink-0" />
            <span>{gameState.distance || 0}m</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-amber-300">
            <span className="text-base">🪙</span>
            <span>{gameState.coins || 0}</span>
          </div>

          {Number(gameState.combo) > 1 && (
            <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black text-[10px] sm:text-xs animate-bounce">
              {gameState.combo}x COMBO
            </div>
          )}
        </div>

        {/* Center: Current Sri Lankan Landmark Zone Indicator */}
        <div className="hidden md:flex items-center gap-1.5 bg-amber-950/85 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-semibold text-amber-200 shadow-md">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{LANDMARKS[worldRef.current.currentLandmarkIndex || 0]?.icon}</span>
          <span className="text-amber-300 font-bold">{LANDMARKS[worldRef.current.currentLandmarkIndex || 0]?.name}</span>
        </div>

        {/* Right Side: Hearts Counter & Top-Right Menu Button */}
        <div className="flex items-center gap-3">
          {/* Hearts Display */}
          <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded-lg border border-red-900/50">
            {Array.from({length: Number(getConfig('maxLives')) || 3}).map((_, i) => (
              <span
                key={i}
                className={`text-sm transition-transform ${
                  i < (gameState.lives || 0)
                    ? 'text-red-500 scale-100'
                    : 'text-slate-600 scale-75 opacity-40'
                }`}>
                ❤️
              </span>
            ))}
          </div>

          {/* Reserved Persistent Top-Right Menu Button */}
          <button
            onClick={() => {
              gameAudio.playCrispClick();
              setIsGameMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle Game Menu"
            className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center bg-amber-500 hover:bg-yellow-400 text-slate-950 rounded-lg font-bold shadow-md transition-all active:scale-95">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Canvas Playfield Container */}
      <main className="flex-1 w-full min-h-0 relative flex items-center justify-center bg-slate-950">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            aspectRatio: `${canvasWidth} / ${canvasHeight}`,
            width: `min(100%, calc(100vh * ${canvasWidth} / ${canvasHeight}))`,
          }}
          className="h-auto max-w-full max-h-full drop-shadow-2xl shadow-2xl"
        />

        {/* On-Screen Mobile Controls */}
        {isMobile && gameState.status === 'PLAYING' && !isGameMenuOpen && !isHowToPlayOpen && (
          <div className="absolute inset-x-0 bottom-4 px-6 flex justify-between pointer-events-none z-30">
            {/* Left Button: Slide / Crouch */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                touchSlideRef.current = true;
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                touchSlideRef.current = false;
              }}
              onPointerCancel={(e) => {
                e.preventDefault();
                touchSlideRef.current = false;
              }}
              className="pointer-events-auto min-w-[58px] min-h-[58px] w-16 h-16 bg-amber-600/90 hover:bg-amber-500 active:scale-90 text-white rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-lg border-2 border-amber-300 touch-none select-none">
              <span>⬇</span>
              <span>SLIDE</span>
            </button>

            {/* Right Button: Jump / Aerial Trick */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                touchJumpRef.current = true;
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                touchJumpRef.current = false;
              }}
              onPointerCancel={(e) => {
                e.preventDefault();
                touchJumpRef.current = false;
              }}
              className="pointer-events-auto min-w-[58px] min-h-[58px] w-16 h-16 bg-emerald-600/90 hover:bg-emerald-500 active:scale-90 text-white rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-lg border-2 border-emerald-300 touch-none select-none">
              <span>⬆</span>
              <span>JUMP</span>
            </button>
          </div>
        )}
      </main>

      {/* START SCREEN MENU */}
      {gameState.status === 'START' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-amber-950 border-2 border-amber-500/70 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-2 border border-amber-400">
              <span className="text-3xl">🛹</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-yellow-400 tracking-wider mb-1">
              LANKA DASH
            </h1>
            <p className="text-amber-200 text-xs sm:text-sm mb-4">
              Ride through Sacred Stupas, Sigiriya Rock, Ella Nine Arch & Colombo Lotus Tower!
            </p>

            {/* Highscore Card */}
            <div className="w-full bg-slate-950/60 border border-amber-500/30 rounded-xl p-3 mb-4 flex justify-around text-xs">
              <div>
                <div className="text-slate-400">Best Score</div>
                <div className="font-bold text-yellow-400 text-base">{highScore}</div>
              </div>
              <div className="w-px bg-amber-500/20" />
              <div>
                <div className="text-slate-400">Best Distance</div>
                <div className="font-bold text-emerald-400 text-base">{bestDistance}m</div>
              </div>
            </div>

            {/* Deck Customization */}
            <div className="w-full mb-5">
              <div className="text-xs font-bold text-amber-300 mb-2">CHOOSE YOUR SKATEBOARD DECK</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setSelectedDeck('lotus');
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                    selectedDeck === 'lotus'
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                  🪷 Lotus Gold
                </button>
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setSelectedDeck('batik');
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                    selectedDeck === 'batik'
                      ? 'bg-red-600 text-white border-red-400 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                  🔥 Batik Sun
                </button>
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setSelectedDeck('emerald');
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                    selectedDeck === 'emerald'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                  🍃 Tea Emerald
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              ref={startButtonRef}
              onClick={() => {
                gameAudio.playCrispClick();
                initGame();
              }}
              autoFocus
              className="w-full min-h-[48px] py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mb-3">
              <Play className="w-6 h-6 fill-current" />
              START SKATING
            </button>

            {/* How to Play Secondary Button */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsHowToPlayOpen(true);
              }}
              className="text-xs text-amber-300 hover:text-amber-100 underline underline-offset-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> How to Play & Controls
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* GAME OVER SCREEN */}
      {gameState.status === 'GAME_OVER' && (
        <MenuOverlay tone="danger" zIndex={40}>
          <div className="w-full max-w-md bg-gradient-to-b from-red-950 to-slate-900 border-2 border-red-500/70 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-red-400 mb-2">
              RUN COMPLETED
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mb-4">
              You had an awesome run across Ceylon!
            </p>

            <div className="w-full bg-slate-950/70 border border-red-900/50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-3 text-left">
              <div>
                <div className="text-[11px] text-slate-400">Total Distance</div>
                <div className="text-xl font-bold text-emerald-400">{gameState.distance || 0}m</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Final Score</div>
                <div className="text-xl font-bold text-yellow-400">{gameState.score.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Coins Collected</div>
                <div className="text-lg font-bold text-amber-300">🪙 {gameState.coins || 0}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Max Combo Streak</div>
                <div className="text-lg font-bold text-purple-300">{gameState.maxCombo || 0}x</div>
              </div>
            </div>

            <button
              onClick={() => {
                gameAudio.playCrispClick();
                initGame();
              }}
              autoFocus
              className="w-full min-h-[48px] py-3 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mb-2">
              <RotateCw className="w-5 h-5" />
              TRY AGAIN
            </button>

            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setGameState((prev) => ({...prev, status: 'START'}));
              }}
              className="text-xs text-slate-400 hover:text-white py-2 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Return to Title
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* GAME MENU OVERLAY */}
      {isGameMenuOpen && (
        <MenuOverlay tone="neutral" zIndex={50}>
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/70 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 mb-4">
              GAME MENU
            </h2>

            {/* Audio Toggles */}
            <div className="w-full bg-slate-950/80 rounded-xl p-4 mb-4 flex flex-col gap-3 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
                  {isMusicMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  Background Music
                </span>
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setIsMusicMuted(!isMusicMuted);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    isMusicMuted ? 'bg-red-800 text-red-200' : 'bg-emerald-700 text-emerald-100'
                  }`}>
                  {isMusicMuted ? 'Muted' : 'Playing'}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
                  {isSfxMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  Sound Effects (SFX)
                </span>
                <button
                  onClick={() => {
                    const newMuted = gameAudio.toggleMute();
                    setIsSfxMuted(newMuted);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    isSfxMuted ? 'bg-red-800 text-red-200' : 'bg-emerald-700 text-emerald-100'
                  }`}>
                  {isSfxMuted ? 'Muted' : 'Active'}
                </button>
              </div>
            </div>

            {/* Resume Button */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsGameMenuOpen(false);
              }}
              autoFocus
              className="w-full min-h-[44px] py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm rounded-lg mb-2 flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              RESUME RUN
            </button>

            {/* Try Level Again */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                initGame();
              }}
              className="w-full min-h-[44px] py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-lg mb-2 flex items-center justify-center gap-2 border border-slate-700">
              <RotateCw className="w-4 h-4" />
              RESTART RUN
            </button>

            {/* How to Play Button */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsHowToPlayOpen(true);
              }}
              className="w-full min-h-[44px] py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-lg mb-2 flex items-center justify-center gap-2 border border-slate-700">
              <HelpCircle className="w-4 h-4" />
              HOW TO PLAY
            </button>

            {/* Quit to Main Menu */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsGameMenuOpen(false);
                setIsHowToPlayOpen(false);
                setGameState((prev) => ({...prev, status: 'START'}));
              }}
              className="w-full min-h-[44px] py-2 text-xs text-red-400 hover:text-red-300 font-semibold flex items-center justify-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Quit to Title
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* HOW TO PLAY OVERLAY */}
      {isHowToPlayOpen && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl flex flex-col text-left">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h2 className="text-xl sm:text-2xl font-black text-yellow-400 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                HOW TO PLAY
              </h2>
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsHowToPlayOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-lg">⬆</span>
                <div>
                  <strong className="text-amber-300">Jump / Double Jump:</strong> Press{' '}
                  <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[11px]">Space</kbd>,{' '}
                  <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[11px]">Up Arrow</kbd>, or tap screen top.
                  Tap in air to perform an <em>Aerial Trick</em> (+300 pts)!
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">⬇</span>
                <div>
                  <strong className="text-amber-300">Crouch Slide:</strong> Press{' '}
                  <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[11px]">Down Arrow</kbd>,{' '}
                  <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[11px]">S</kbd>, or tap screen bottom to slide under hanging temple cloth banners!
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">🥥</span>
                <div>
                  <strong className="text-emerald-400">King Coconut (Thambili):</strong> Grants temporary Invulnerability Shield and pulls all nearby gold coins via Magnet!
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">💎</span>
                <div>
                  <strong className="text-red-400">Ceylon Ruby:</strong> Multiplies all scored points and coin bonuses by 3x for 10 seconds!
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">🪷</span>
                <div>
                  <strong className="text-pink-400">Lotus & Tea Leaves:</strong> Collect sacred lotuses and fresh tea leaves for large bonus points!
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <strong className="text-yellow-300">Hazards:</strong> Dodge retro Tuk-Tuks, rolling coconut carts, roadblocks, and clay pots. You have 3 Hearts!
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsHowToPlayOpen(false);
              }}
              className="w-full min-h-[44px] py-2.5 bg-amber-500 hover:bg-yellow-400 text-slate-950 font-bold text-sm rounded-lg flex items-center justify-center gap-2">
              GOT IT, LET'S RIDE!
            </button>
          </div>
        </MenuOverlay>
      )}
    </div>
  );
}
