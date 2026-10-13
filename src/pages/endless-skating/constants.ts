import {SpriteConfig} from './utils/helper';

/**
 * THEME definitions for distinct Ceylon cultural arcade styling
 */
export const THEME = {
  palette: {
    primary: '#F59E0B', // Saffron Gold
    secondary: '#DC2626', // Ceylon Crimson
    accent: '#10B981', // Emerald Tea Leaf
    royalSapphire: '#2563EB',
    amberWarm: '#D97706',
    darkWood: '#451A03',
    cardBackdrop: 'rgba(15, 23, 42, 0.85)',
    goldBorder: '#FBBF24',
    textLight: '#FFFBEB',
  },
  fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
};

/**
 * Configuration for Lanka Dash.
 */
export const CONFIG = {
  // Game & System info
  title: {
    value: 'Lanka Dash',
    type: 'string',
    label: 'Game Title',
    group: 'GAME',
  },
  baseCanvasWidth: {
    value: 1280,
    type: 'number',
    label: 'Base Canvas Width',
    group: 'GAME',
  },
  baseCanvasHeight: {
    value: 720,
    type: 'number',
    label: 'Base Canvas Height',
    group: 'GAME',
  },
  targetFPS: {
    value: 60,
    type: 'number',
    label: 'Target FPS',
    group: 'SYSTEM',
  },
  stepMs: {
    value: 1000 / 60,
    type: 'number',
    label: 'Step MS',
    group: 'SYSTEM',
  },
  maxSubSteps: {
    value: 5,
    type: 'number',
    label: 'Max Sub Steps',
    group: 'SYSTEM',
  },

  // Theme & Audio
  backgroundColor: {
    value: '#0F172A',
    type: 'color',
    label: 'Background Color',
    group: 'THEME',
  },
  primaryColor: {
    value: '#F59E0B',
    type: 'color',
    label: 'Primary Color',
    group: 'THEME',
  },
  fontFamily: {
    value: THEME.fontFamily,
    type: 'string',
    label: 'Font Family',
    group: 'THEME',
  },
  defaultMusicVolume: {
    value: 0.5,
    type: 'number',
    label: 'Default Music Volume',
    group: 'AUDIO',
  },
  defaultSfxVolume: {
    value: 0.7,
    type: 'number',
    label: 'Default SFX Volume',
    group: 'AUDIO',
  },

  // Gameplay Rules & Difficulty
  startingLives: {
    value: 3,
    type: 'number',
    label: 'Starting Lives',
    group: 'Rules',
  },
  maxLives: {
    value: 3,
    type: 'number',
    label: 'Max Lives',
    group: 'Rules',
  },
  baseSpeed: {
    value: 480, // pixels per second
    type: 'number',
    label: 'Base Track Speed',
    group: 'Rules',
  },
  speedScalingRate: {
    value: 8, // speed increase per 100m
    type: 'number',
    label: 'Speed Scaling Rate',
    group: 'Rules',
  },
  invincibilityDuration: {
    value: 1.8, // seconds after taking damage
    type: 'number',
    label: 'Hit Invincibility Duration (s)',
    group: 'Rules',
  },
  powerupCoconutDuration: {
    value: 8.0, // seconds for King Coconut shield + magnet
    type: 'number',
    label: 'Coconut Shield Duration (s)',
    group: 'Rules',
  },
  powerupRubyDuration: {
    value: 10.0, // seconds for 3x score multiplier
    type: 'number',
    label: 'Ruby Multiplier Duration (s)',
    group: 'Rules',
  },

  // Physics & Mechanics
  gravityRising: {
    value: 2400, // px / s^2
    type: 'number',
    label: 'Rising Gravity',
    group: 'Physics',
  },
  gravityFalling: {
    value: 3200, // px / s^2
    type: 'number',
    label: 'Falling Gravity',
    group: 'Physics',
  },
  jumpVelocity: {
    value: -880, // initial jump impulse
    type: 'number',
    label: 'Jump Force',
    group: 'Physics',
  },
  doubleJumpVelocity: {
    value: -780, // double tap aerial trick impulse
    type: 'number',
    label: 'Double Jump Trick Force',
    group: 'Physics',
  },
  slideDuration: {
    value: 0.65, // seconds
    type: 'number',
    label: 'Slide Duration (s)',
    group: 'Physics',
  },
  groundY: {
    value: 620, // baseline Y ground plane
    type: 'number',
    label: 'Ground Y',
    group: 'Physics',
  },
  playerWidth: {
    value: 130,
    type: 'number',
    label: 'Player Width',
    group: 'Physics',
  },
  playerHeight: {
    value: 130,
    type: 'number',
    label: 'Player Height',
    group: 'Physics',
  },
  playerSlideHeight: {
    value: 65,
    type: 'number',
    label: 'Player Slide Height',
    group: 'Physics',
  },

  // World Spawning Parameters
  minObstacleSpacing: {
    value: 380, // px between obstacles
    type: 'number',
    label: 'Min Obstacle Spacing',
    group: 'World',
  },
  coinPatternInterval: {
    value: 220,
    type: 'number',
    label: 'Coin Pattern Interval',
    group: 'World',
  },
  biomeDistanceInterval: {
    value: 350, // meters per biome cycle
    type: 'number',
    label: 'Biome Cycle Distance (m)',
    group: 'World',
  },

  // ASSETS Dimensions & Aspect Ratios (from read_assets_metadata)
  assetTukTukAspectRatio: {
    value: 686 / 526, // 1.30418
    type: 'number',
    label: 'Tuk Tuk Aspect Ratio',
    group: 'ASSETS',
  },
  assetTukTukHeight: {
    value: 155,
    type: 'number',
    label: 'Tuk Tuk Height',
    group: 'ASSETS',
  },
  assetCoconutCartAspectRatio: {
    value: 848 / 529, // 1.60302
    type: 'number',
    label: 'Coconut Cart Aspect Ratio',
    group: 'ASSETS',
  },
  assetCoconutCartHeight: {
    value: 120,
    type: 'number',
    label: 'Coconut Cart Height',
    group: 'ASSETS',
  },
  assetRoadblockAspectRatio: {
    value: 722 / 394, // 1.83248
    type: 'number',
    label: 'Roadblock Aspect Ratio',
    group: 'ASSETS',
  },
  assetRoadblockHeight: {
    value: 95,
    type: 'number',
    label: 'Roadblock Height',
    group: 'ASSETS',
  },
  assetClayPotAspectRatio: {
    value: 604 / 620, // 0.97419
    type: 'number',
    label: 'Clay Pot Aspect Ratio',
    group: 'ASSETS',
  },
  assetClayPotHeight: {
    value: 75,
    type: 'number',
    label: 'Clay Pot Height',
    group: 'ASSETS',
  },
  assetHangingBannerAspectRatio: {
    value: 788 / 635, // 1.24094
    type: 'number',
    label: 'Hanging Banner Aspect Ratio',
    group: 'ASSETS',
  },
  assetHangingBannerHeight: {
    value: 230,
    type: 'number',
    label: 'Hanging Banner Height',
    group: 'ASSETS',
  },
  assetCoinAspectRatio: {
    value: 622 / 730, // 0.85205
    type: 'number',
    label: 'Coin Aspect Ratio',
    group: 'ASSETS',
  },
  assetCoinHeight: {
    value: 48,
    type: 'number',
    label: 'Coin Height',
    group: 'ASSETS',
  },
  assetKingCoconutAspectRatio: {
    value: 579 / 683, // 0.84773
    type: 'number',
    label: 'King Coconut Aspect Ratio',
    group: 'ASSETS',
  },
  assetKingCoconutHeight: {
    value: 60,
    type: 'number',
    label: 'King Coconut Height',
    group: 'ASSETS',
  },
  assetRubyAspectRatio: {
    value: 421 / 558, // 0.75448
    type: 'number',
    label: 'Ceylon Ruby Aspect Ratio',
    group: 'ASSETS',
  },
  assetRubyHeight: {
    value: 54,
    type: 'number',
    label: 'Ceylon Ruby Height',
    group: 'ASSETS',
  },
  assetHeartAspectRatio: {
    value: 493 / 598, // 0.82441
    type: 'number',
    label: 'Heart Icon Aspect Ratio',
    group: 'ASSETS',
  },
  assetHeartHeight: {
    value: 36,
    type: 'number',
    label: 'Heart Icon Height',
    group: 'ASSETS',
  },
  assetBackgroundAspectRatio: {
    value: 1376 / 768, // 1.79166
    type: 'number',
    label: 'Background Aspect Ratio',
    group: 'ASSETS',
  },
  assetBgSunsetSkyAspectRatio: {
    value: 1376 / 768, // 1.79167
    type: 'number',
    label: 'Sunset Sky Layer Aspect Ratio',
    group: 'ASSETS',
  },
  assetLayerStupaHillsAspectRatio: {
    value: 1376 / 408, // 3.37255
    type: 'number',
    label: 'Stupa Hills Landmark Layer Aspect Ratio',
    group: 'ASSETS',
  },
  assetLandmarkAspectRatio: {
    value: 1376 / 768, // 1.79167
    type: 'number',
    label: 'Landmark Layer Aspect Ratio',
    group: 'ASSETS',
  },
  landmarkZoneDistance: {
    value: 550, // meters per landmark zone (extended duration for ambient transitions)
    type: 'number',
    label: 'Landmark Zone Distance (m)',
    group: 'World',
  },
  landmarkTransitionWindow: {
    value: 160, // meters for smooth crossfade blend
    type: 'number',
    label: 'Landmark Transition Distance (m)',
    group: 'World',
  },
  assetLayerJunglePalmsAspectRatio: {
    value: 1376 / 445, // 3.09213
    type: 'number',
    label: 'Jungle Palms Layer Aspect Ratio',
    group: 'ASSETS',
  },
  playerSprite: {
    value: undefined as SpriteConfig | undefined,
    type: 'sprite',
    label: 'Player Sprite',
    group: 'Visuals',
  },
};

// Merge customized config values if present (injected by Playground)
const {playgroundConfig} = globalThis as {
  playgroundConfig?: Record<string, unknown>;
};
if (playgroundConfig) {
  for (const [key, value] of Object.entries(playgroundConfig)) {
    if (key in CONFIG) {
      Object.assign(CONFIG[key as keyof typeof CONFIG], {value});
    }
  }
}

/**
 * Type helper for reading values in game code
 */
export type ConfigKey = keyof typeof CONFIG;

/**
 * Gets a configuration value by key.
 * @param key The configuration key.
 * @return The configuration value.
 */
export function getConfig<K extends ConfigKey>(
  key: K,
): (typeof CONFIG)[K]['value'] {
  return CONFIG[key].value;
}
