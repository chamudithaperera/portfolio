// tslint:disable
/* eslint-disable */
import {GameState, MusicTrack} from './utils/helper';

export type {GameState, MusicTrack};

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type Position3D = [number, number, number];

export interface Particle {
  id: string | number;
  position: Position3D;
  velocity: Position3D;
  life: number;
  maxLife: number;
  color?: string;
  size?: number;
}

export interface GoldenEgg {
  id: number;
  position: Position3D;
  collected: boolean;
  score: number;
}

export interface GoldenKey {
  id: number;
  position: Position3D;
  collected: boolean;
}

export interface CheckpointData {
  id: number;
  position: Position3D;
  activated: boolean;
}

export interface BombHazard {
  id: number;
  position: Position3D;
  exploded?: boolean;
}

export interface SpikeHazard {
  id: number;
  position: Position3D;
  size: [number, number, number];
}

export interface LadderItem {
  id: number;
  position: Position3D;
  height: number;
}

export type SpringType = 'leaf' | 'super' | 'mushroom';

export interface SpringItem {
  id: number;
  type: SpringType;
  position: Position3D;
  powerMultiplier: number;
}

export interface RopeBridge {
  id: number;
  position: Position3D;
  length: number;
}

export interface LiftElevator {
  id: number;
  startPosition: Position3D;
  travelDistance: number;
  axis: 'y' | 'x';
  speed: number;
  platformWidth?: number;
}

export interface GrassPlatform {
  id: number;
  position: Position3D;
  size: [number, number, number];
  isStepped?: boolean;
  hasSproutFern?: boolean;
  fernPosition?: [number, number, number];
  moving?: boolean;
  moveAxis?: 'x' | 'y';
  moveRange?: number;
  moveSpeed?: number;
}

export interface SeasonTheme {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  skyColor: string;
  platformColor: string;
  platformGrassColor: string;
  patternColor: string;
  cloudColor: string;
}

export interface LevelData {
  id: number; // 1 to 30
  seasonId: number; // 1, 2, 3
  levelInSeason: number; // 1 to 10
  name: string;
  difficulty: string;
  description: string;
  spawnPoint: Position3D;
  exitDoorPosition: Position3D;
  platforms: GrassPlatform[];
  bridges: RopeBridge[];
  lifts: LiftElevator[];
  eggs: GoldenEgg[]; // Golden eggs to collect
  keys: GoldenKey[]; // Golden keys to unlock the door
  checkpoints: CheckpointData[];
  bombs: BombHazard[];
  spikes: SpikeHazard[];
  ladders: LadderItem[];
  springs: SpringItem[];
}

export interface PlayerProgress {
  unlockedLevel: number; // Highest level unlocked (1-30)
  completedLevels: number[]; // IDs of completed levels
  levelEggs: Record<number, number>; // levelId -> eggs collected
}
