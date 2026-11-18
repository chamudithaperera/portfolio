// tslint:disable
/* eslint-disable */
/** 3D Vector. */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** 3D Position as a tuple. */
export type Position3D = [number, number, number];

/** Represents an object in the 3D scene. */
export interface Entity3D {
  id: string | number;
  type?: string;
  position: Vec3 | Position3D;
  rotation?: Vec3 | Position3D;
  scale?: Vec3 | Position3D;
  velocity?: Vec3;
  active?: boolean;
  [key: string]: any;
}

/** Represents a particle in a particle system. */
export interface Particle {
  id: string | number;
  position: Vec3 | Position3D;
  velocity?: Vec3 | Position3D;
  life: number;
  maxLife: number;
  color?: string;
  size?: number;
  [key: string]: any;
}

/** Board cell value. null = empty, 'X' = player, 'O' = AI opponent. */
export type CellPlayer = 'X' | 'O' | null;

/** 3x3 board representation. */
export type BoardState = CellPlayer[];

/** AI difficulty presets. */
export type AIDifficulty = 'easy' | 'medium' | 'master';

/** Match stats. */
export interface MatchStats {
  playerWins: number;
  aiWins: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
}

/** 3D Token definition for rendering drops & animations. */
export interface TokenPiece {
  id: string;
  index: number;
  player: 'X' | 'O';
  position: [number, number, number];
  rotation: [number, number, number];
  animProgress: number; // 0 to 1
  isWinningToken?: boolean;
}
