import {MusicTrack} from './utils/helper';

/** Game configuration schema. */
export const CONFIG = {
  // --- Game ---
  title: {
    value: '3D Tic Tac Toe',
    type: 'string',
    label: 'Game Title',
    group: 'Game',
  },

  // --- Camera ---
  fov: {
    value: 50,
    type: 'number',
    label: 'Field of View',
    group: 'Camera',
    min: 30,
    max: 90,
    step: 5,
  },
  cameraX: {
    value: 0,
    type: 'number',
    label: 'Camera X',
    group: 'Camera',
  },
  cameraY: {
    value: 7.5,
    type: 'number',
    label: 'Camera Y',
    group: 'Camera',
  },
  cameraZ: {
    value: 6.5,
    type: 'number',
    label: 'Camera Z',
    group: 'Camera',
  },

  // --- Visuals & Theme ---
  backgroundColor: {
    value: '#090a12',
    type: 'color',
    label: 'Background Color',
    group: 'Visuals',
  },
  ambientColor: {
    value: '#3a4b6e',
    type: 'color',
    label: 'Ambient Light Color',
    group: 'Visuals',
  },
  ambientIntensity: {
    value: 1.8,
    type: 'number',
    label: 'Ambient Intensity',
    group: 'Visuals',
    min: 0,
    max: 5,
    step: 0.1,
  },
  sunColor: {
    value: '#e0f2fe',
    type: 'color',
    label: 'Sun Color',
    group: 'Visuals',
  },
  sunIntensity: {
    value: 3.5,
    type: 'number',
    label: 'Sun Intensity',
    group: 'Visuals',
    min: 0,
    max: 10,
    step: 0.1,
  },
  hemiSkyColor: {
    value: '#38bdf8',
    type: 'color',
    label: 'Hemisphere Sky Color',
    group: 'Visuals',
  },
  hemiGroundColor: {
    value: '#1e1b4b',
    type: 'color',
    label: 'Hemisphere Ground Color',
    group: 'Visuals',
  },
  hemiIntensity: {
    value: 0.8,
    type: 'number',
    label: 'Hemisphere Intensity',
    group: 'Visuals',
    min: 0,
    max: 2,
    step: 0.1,
  },

  // --- Board & Gameplay Rules ---
  gridSpacing: {
    value: 1.9,
    type: 'number',
    label: 'Tile Spacing',
    group: 'Grid',
    min: 1.4,
    max: 2.5,
    step: 0.1,
  },
  aiDifficulty: {
    value: 1, // 0: Easy, 1: Medium (Smart Heuristic), 2: Master (Minimax)
    type: 'number',
    label: 'AI Difficulty (0=Easy, 1=Med, 2=Hard)',
    group: 'Rules',
    min: 0,
    max: 2,
    step: 1,
  },
  aiDelayMs: {
    value: 120,
    type: 'number',
    label: 'AI Think Delay (ms)',
    group: 'Rules',
    min: 50,
    max: 800,
    step: 25,
  },
  pointsPerWin: {
    value: 100,
    type: 'number',
    label: 'Points Per Win',
    group: 'Rules',
    min: 25,
    max: 500,
    step: 25,
  },

  // --- Physics ---
  gravity: {
    value: -9.81,
    type: 'number',
    label: 'Gravity',
    group: 'Physics',
    min: -30,
    max: 0,
    step: 0.5,
  },

  // --- System ---
  targetFPS: {
    value: 60,
    type: 'number',
    label: 'Target FPS',
    group: 'System',
  },
  stepMs: {
    value: 1000 / 60,
    type: 'number',
    label: 'Step MS',
    group: 'System',
  },
  maxSubSteps: {
    value: 5,
    type: 'number',
    label: 'Max Sub Steps',
    group: 'System',
  },

  // --- Audio ---
  backgroundMusicUrl: {
    value:
      'https://storage.googleapis.com/assets-gen-playground/musiclibrary/stellar_drift.mp3',
    type: 'string',
    label: 'Background Music URL',
    group: 'Audio',
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

/** Type helper for reading values in game code. */
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

export const PRESETS = {};

/** Background music tracks available for the game to use. */
export const AVAILABLE_MUSIC_TRACKS: readonly MusicTrack[] = [
  {
    name: 'stellar_drift',
    url: 'https://storage.googleapis.com/assets-gen-playground/musiclibrary/stellar_drift.mp3',
    description: 'Spacious ambient synths and slow arpeggios. Perfect for sci-fi puzzle board game.',
  },
  {
    name: 'automated_dream',
    url: 'https://storage.googleapis.com/assets-gen-playground/musiclibrary/automated_dream.mp3',
    description: 'An intellectually stimulating track with a concrete feel, peaceful for puzzles.',
  },
  {
    name: 'grid_runner',
    url: 'https://storage.googleapis.com/assets-gen-playground/musiclibrary/grid_runner.mp3',
    description: 'A cyberpunk-style track with high-energy beat.',
  },
];
