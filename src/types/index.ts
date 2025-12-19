// Game mode types
export type GameMode = 'reaction' | 'flick' | 'tracking' | 'gridshot' | 'headshot';

// Game state
export type GameState = 'idle' | 'playing' | 'paused' | 'finished';

// Target interface
export interface Target {
  id: string;
  x: number;
  y: number;
  radius: number;
  createdAt: number;
  type: 'static' | 'moving';
  velocity?: { vx: number; vy: number };
  isHit?: boolean;
  hitTime?: number;
}

// Game settings
export interface GameSettings {
  dpi: number;
  valorantSens: number;
  soundEnabled: boolean;
  targetSize: 'small' | 'medium' | 'large';
  difficulty: 'easy' | 'medium' | 'hard';
  showStats: boolean;
  crosshairColor: string;
  crosshairSize: number;
}

// Game statistics
export interface GameStats {
  hits: number;
  misses: number;
  totalShots: number;
  accuracy: number;
  averageReactionTime: number;
  reactionTimes: number[];
  score: number;
}

// Training session
export interface TrainingSession {
  id: string;
  mode: GameMode;
  startTime: number;
  endTime: number;
  duration: number;
  stats: GameStats;
  settings: GameSettings;
}

// Training history
export interface TrainingHistory {
  sessions: TrainingSession[];
  totalTime: number;
  totalSessions: number;
}

// Mode configuration
export interface ModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  targetCount: number;
  targetLifetime: number; // ms
  spawnInterval: number; // ms
  movingTargets: boolean;
}

// Position helper
export interface Position {
  x: number;
  y: number;
}

// Crosshair settings
export interface CrosshairSettings {
  color: string;
  size: number;
  thickness: number;
  gap: number;
  dot: boolean;
  outline: boolean;
}

// Default settings
export const DEFAULT_SETTINGS: GameSettings = {
  dpi: 800,
  valorantSens: 0.35,
  soundEnabled: false,
  targetSize: 'medium',
  difficulty: 'medium',
  showStats: true,
  crosshairColor: '#ffffff',
  crosshairSize: 4,
};

export const DEFAULT_CROSSHAIR: CrosshairSettings = {
  color: '#ffffff',
  size: 4,
  thickness: 2,
  gap: 3,
  dot: true,
  outline: true,
};

// Mode configurations
export const MODE_CONFIGS: Record<GameMode, ModeConfig> = {
  reaction: {
    id: 'reaction',
    name: 'Reaction',
    description: 'Test your reaction speed',
    icon: '⚡',
    targetCount: 1,
    targetLifetime: 3000,
    spawnInterval: 1500,
    movingTargets: false,
  },
  flick: {
    id: 'flick',
    name: 'Flick Shot',
    description: 'Quick target acquisition',
    icon: '🎯',
    targetCount: 1,
    targetLifetime: 2000,
    spawnInterval: 0,
    movingTargets: false,
  },
  tracking: {
    id: 'tracking',
    name: 'Tracking',
    description: 'Follow moving targets',
    icon: '🔄',
    targetCount: 1,
    targetLifetime: 5000,
    spawnInterval: 100,
    movingTargets: true,
  },
  gridshot: {
    id: 'gridshot',
    name: 'Grid Shot',
    description: 'Multiple target switching',
    icon: '⊞',
    targetCount: 3,
    targetLifetime: 5000,
    spawnInterval: 300,
    movingTargets: false,
  },
  headshot: {
    id: 'headshot',
    name: 'Headshot Line',
    description: 'Practice crosshair placement',
    icon: '💀',
    targetCount: 1,
    targetLifetime: 2500,
    spawnInterval: 0,
    movingTargets: false,
  },
};

// Target size presets (radius in pixels)
export const TARGET_SIZES = {
  small: 15,
  medium: 25,
  large: 40,
};

// Difficulty multipliers
export const DIFFICULTY_MULTIPLIERS = {
  easy: { lifetime: 1.5, speed: 0.7, size: 1.3 },
  medium: { lifetime: 1.0, speed: 1.0, size: 1.0 },
  hard: { lifetime: 0.7, speed: 1.4, size: 0.8 },
};
