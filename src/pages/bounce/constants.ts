import {MusicTrack} from './utils/helper';

/** Game configuration schema matching the vibrant cartoon platformer aesthetic. */
export const CONFIG = {
  // --- Game ---
  title: {
    value: 'Red Orb Odyssey',
    type: 'string',
    label: 'Game Title',
    group: 'Game',
  },

  // --- Rules ---
  startingLives: {
    value: 5,
    type: 'number',
    label: 'Starting Lives',
    group: 'Rules',
    min: 1,
    max: 9,
    step: 1,
  },
  playerSpeed: {
    value: 11.5,
    type: 'number',
    label: 'Orb Rolling Speed',
    group: 'Rules',
    min: 6,
    max: 20,
    step: 0.5,
  },
  jumpVelocity: {
    value: 10.8,
    type: 'number',
    label: 'Jump Force',
    group: 'Rules',
    min: 6,
    max: 16,
    step: 0.5,
  },
  eggScore: {
    value: 100,
    type: 'number',
    label: 'Egg Collect Score',
    group: 'Rules',
    min: 50,
    max: 500,
    step: 50,
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
    label: 'Camera X Offset',
    group: 'Camera',
  },
  cameraY: {
    value: 2.2,
    type: 'number',
    label: 'Camera Height Offset',
    group: 'Camera',
  },
  cameraZ: {
    value: 17.0,
    type: 'number',
    label: 'Camera Distance',
    group: 'Camera',
  },

  // --- Visuals & Theme (Reference Exact Vivid Cyan Sky & Lime Grass) ---
  backgroundColor: {
    value: '#00d2ff',
    type: 'color',
    label: 'Sky Cyan Blue',
    group: 'Visuals',
  },
  ambientColor: {
    value: '#ffffff',
    type: 'color',
    label: 'Ambient Light Color',
    group: 'Visuals',
  },
  ambientIntensity: {
    value: 1.8,
    type: 'number',
    label: 'Ambient Intensity',
    group: 'Visuals',
    min: 0.5,
    max: 4,
    step: 0.1,
  },
  sunColor: {
    value: '#ffffff',
    type: 'color',
    label: 'Sun Key Color',
    group: 'Visuals',
  },
  sunIntensity: {
    value: 3.5,
    type: 'number',
    label: 'Sun Intensity',
    group: 'Visuals',
    min: 1,
    max: 8,
    step: 0.5,
  },
  hemiSkyColor: {
    value: '#00d2ff',
    type: 'color',
    label: 'Hemisphere Sky Color',
    group: 'Visuals',
  },
  hemiGroundColor: {
    value: '#113e22',
    type: 'color',
    label: 'Hemisphere Ground Color',
    group: 'Visuals',
  },
  hemiIntensity: {
    value: 1.2,
    type: 'number',
    label: 'Hemisphere Intensity',
    group: 'Visuals',
  },

  // --- Physics ---
  gravity: {
    value: -27.0,
    type: 'number',
    label: 'Gravity',
    group: 'Physics',
    min: -40,
    max: -10,
    step: 1,
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
  defaultMusicVolume: {
    value: 0.5,
    type: 'number',
    label: 'Default Music Volume',
    group: 'Audio',
    min: 0,
    max: 1,
    step: 0.1,
  },
  defaultSfxVolume: {
    value: 0.7,
    type: 'number',
    label: 'Default SFX Volume',
    group: 'Audio',
    min: 0,
    max: 1,
    step: 0.1,
  },
  backgroundMusicUrl: {
    value: 'https://storage.googleapis.com/assets-gen-playground/musiclibrary/pixel_quest.mp3',
    type: 'string',
    label: 'Background Music URL',
    group: 'Audio',
  },
};

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

export type ConfigKey = keyof typeof CONFIG;

export function getConfig<K extends ConfigKey>(
  key: K,
): (typeof CONFIG)[K]['value'] {
  return CONFIG[key].value;
}

export const PRESETS = {};

export const AVAILABLE_MUSIC_TRACKS: readonly MusicTrack[] = [
  {
    name: 'pixel_quest',
    url: 'https://storage.googleapis.com/assets-gen-playground/musiclibrary/pixel_quest.mp3',
    description: 'Vibrant bouncy retro adventure track.',
  },
  {
    name: 'candy_pop',
    url: 'https://storage.googleapis.com/assets-gen-playground/musiclibrary/candy_pop.mp3',
    description: 'Bubbly joyful pop track.',
  },
];
