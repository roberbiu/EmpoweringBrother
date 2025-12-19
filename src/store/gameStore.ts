/**
 * Game State Management with Zustand
 */

import { create } from 'zustand';
import type {
  GameMode,
  GameState,
  GameSettings,
  GameStats,
  Target,
  TrainingSession,
  TrainingHistory,
} from '../types';
import {
  MODE_CONFIGS,
  TARGET_SIZES,
  DIFFICULTY_MULTIPLIERS,
} from '../types';
import { createInitialStats, recordHit, recordMiss, recordTimeout } from '../utils/statistics';
import { loadSettings, saveSettings, loadHistory as loadHistoryFromStorage, addSession, saveLastMode, clearHistory as clearHistoryFromStorage } from '../utils/storage';
import { calculateWebSensitivity } from '../utils/sensitivity';
import { audioManager } from '../utils/audio';

interface GameStore {
  // Game state
  gameState: GameState;
  currentMode: GameMode;
  targets: Target[];
  score: number;
  stats: GameStats;

  // Timing
  startTime: number | null;
  elapsedTime: number;
  countdown: number | null;

  // Crosshair position (relative to center)
  crosshairX: number;
  crosshairY: number;

  // Settings
  settings: GameSettings;
  sensitivityFactor: number;

  // History
  history: TrainingHistory;

  // UI state
  showSettings: boolean;
  showHistory: boolean;
  showResults: boolean;

  // Actions
  setMode: (mode: GameMode) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  // Target management
  addTarget: () => void;
  removeTarget: (id: string) => void;
  hitTarget: (id: string) => void;
  missShot: () => void;
  timeoutTarget: (id: string) => void;
  updateTargets: (deltaTime: number) => void;

  // Crosshair
  moveCrosshair: (deltaX: number, deltaY: number) => void;
  resetCrosshair: () => void;

  // Settings
  updateSettings: (settings: Partial<GameSettings>) => void;
  updateSensitivity: (screenWidth: number) => void;
  toggleSettings: () => void;
  toggleHistory: () => void;
  closeResults: () => void;

  // Timer
  updateTimer: () => void;
  setCountdown: (value: number | null) => void;

  // History
  loadHistory: () => void;
  clearHistory: () => void;
}

// Generate unique ID
const generateId = (): string => Math.random().toString(36).substring(2, 9);

// Get target radius based on settings
const getTargetRadius = (settings: GameSettings): number => {
  const baseSize = TARGET_SIZES[settings.targetSize];
  const multiplier = DIFFICULTY_MULTIPLIERS[settings.difficulty].size;
  return Math.round(baseSize * multiplier);
};

// Get target lifetime based on settings and mode
const getTargetLifetime = (mode: GameMode, settings: GameSettings): number => {
  const baseLifetime = MODE_CONFIGS[mode].targetLifetime;
  const multiplier = DIFFICULTY_MULTIPLIERS[settings.difficulty].lifetime;
  return Math.round(baseLifetime * multiplier);
};

// Generate random position for target
const generateTargetPosition = (
  radius: number,
  canvasWidth: number,
  canvasHeight: number,
  mode: GameMode
): { x: number; y: number } => {
  const padding = radius + 50;

  if (mode === 'headshot') {
    // Headshot mode: targets appear at a fixed vertical line (headshot height)
    // Assuming headshot line is at 30% from top
    const headHeight = canvasHeight * 0.3;
    return {
      x: padding + Math.random() * (canvasWidth - padding * 2),
      y: headHeight + (Math.random() - 0.5) * 40, // Small vertical variance
    };
  }

  return {
    x: padding + Math.random() * (canvasWidth - padding * 2),
    y: padding + Math.random() * (canvasHeight - padding * 2),
  };
};

// Create the store
export const useGameStore = create<GameStore>()((set, get) => ({
    // Initial state
    gameState: 'idle',
    currentMode: 'flick',
    targets: [],
    score: 0,
    stats: createInitialStats(),

    startTime: null,
    elapsedTime: 0,
    countdown: null,

    crosshairX: 0,
    crosshairY: 0,

    settings: loadSettings(),
    sensitivityFactor: 1,

    history: { sessions: [], totalTime: 0, totalSessions: 0 },

    showSettings: false,
    showHistory: false,
    showResults: false,

    // Mode selection
    setMode: (mode) => {
      set({ currentMode: mode });
      saveLastMode(mode);
    },

    // Game control
    startGame: () => {
      const { settings } = get();
      audioManager.setEnabled(settings.soundEnabled);
      audioManager.playStart();

      set({
        gameState: 'playing',
        targets: [],
        stats: createInitialStats(),
        startTime: Date.now(),
        elapsedTime: 0,
        crosshairX: 0,
        crosshairY: 0,
        showResults: false,
        countdown: null,
      });

      // Add initial target(s)
      const { currentMode } = get();
      const config = MODE_CONFIGS[currentMode];
      for (let i = 0; i < config.targetCount; i++) {
        setTimeout(() => get().addTarget(), i * 100);
      }
    },

    pauseGame: () => {
      set({ gameState: 'paused' });
    },

    resumeGame: () => {
      set({ gameState: 'playing' });
    },

    endGame: () => {
      const { startTime, stats, currentMode, settings } = get();

      audioManager.playEnd();

      const endTime = Date.now();
      const duration = startTime ? endTime - startTime : 0;

      // Create session record
      const session: TrainingSession = {
        id: generateId(),
        mode: currentMode,
        startTime: startTime || endTime,
        endTime,
        duration,
        stats,
        settings,
      };

      // Save to history
      addSession(session);

      set({
        gameState: 'finished',
        targets: [],
        showResults: true,
      });
    },

    resetGame: () => {
      set({
        gameState: 'idle',
        targets: [],
        stats: createInitialStats(),
        startTime: null,
        elapsedTime: 0,
        crosshairX: 0,
        crosshairY: 0,
        showResults: false,
      });
    },

    // Target management
    addTarget: () => {
      const { settings, currentMode } = get();
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const radius = getTargetRadius(settings);
      const { x, y } = generateTargetPosition(
        radius,
        canvas.width,
        canvas.height,
        currentMode
      );

      const config = MODE_CONFIGS[currentMode];
      const isMoving = config.movingTargets;

      let velocity = undefined;
      if (isMoving) {
        const speed = 100 * DIFFICULTY_MULTIPLIERS[settings.difficulty].speed;
        const angle = Math.random() * Math.PI * 2;
        velocity = {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        };
      }

      const target: Target = {
        id: generateId(),
        x,
        y,
        radius,
        createdAt: Date.now(),
        type: isMoving ? 'moving' : 'static',
        velocity,
      };

      set((state) => ({ targets: [...state.targets, target] }));
      audioManager.playSpawn();
    },

    removeTarget: (id) => {
      set((state) => ({
        targets: state.targets.filter((t) => t.id !== id),
      }));
    },

    hitTarget: (id) => {
      const { targets, stats, currentMode } = get();
      const target = targets.find((t) => t.id === id);
      if (!target) return;

      const reactionTime = Date.now() - target.createdAt;
      const newStats = recordHit(stats, reactionTime);

      audioManager.playHit();

      // Mark target as hit for animation
      set((state) => ({
        targets: state.targets.map((t) =>
          t.id === id ? { ...t, isHit: true, hitTime: Date.now() } : t
        ),
        stats: newStats,
        score: newStats.score,
      }));

      // Remove target after animation and spawn new one
      setTimeout(() => {
        const { gameState } = get();
        if (gameState !== 'playing') return;

        get().removeTarget(id);

        // Spawn new target(s) based on mode
        const config = MODE_CONFIGS[currentMode];
        const { targets: currentTargets } = get();
        const targetsNeeded = config.targetCount - currentTargets.length;

        for (let i = 0; i < targetsNeeded; i++) {
          setTimeout(() => {
            if (get().gameState === 'playing') {
              get().addTarget();
            }
          }, i * config.spawnInterval);
        }
      }, 150);
    },

    missShot: () => {
      const { stats } = get();
      const newStats = recordMiss(stats);

      audioManager.playMiss();

      set({
        stats: newStats,
        score: newStats.score,
      });
    },

    timeoutTarget: (id) => {
      const { stats, currentMode } = get();
      const newStats = recordTimeout(stats);

      set({ stats: newStats, score: newStats.score });

      get().removeTarget(id);

      // Spawn new target if game is still playing
      const { gameState } = get();
      if (gameState === 'playing') {
        const config = MODE_CONFIGS[currentMode];
        const { targets } = get();
        if (targets.length < config.targetCount) {
          get().addTarget();
        }
      }
    },

    updateTargets: (deltaTime) => {
      const { targets, settings, currentMode } = get();
      const lifetime = getTargetLifetime(currentMode, settings);
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

      const now = Date.now();
      const updatedTargets: Target[] = [];
      const expiredIds: string[] = [];

      for (const target of targets) {
        // Skip targets being animated
        if (target.isHit) {
          updatedTargets.push(target);
          continue;
        }

        // Check timeout
        if (now - target.createdAt > lifetime) {
          expiredIds.push(target.id);
          continue;
        }

        // Update position for moving targets
        if (target.type === 'moving' && target.velocity && canvas) {
          let { x, y } = target;
          let { vx, vy } = target.velocity;

          x += vx * deltaTime;
          y += vy * deltaTime;

          // Bounce off walls
          const padding = target.radius;
          if (x < padding || x > canvas.width - padding) {
            vx = -vx;
            x = Math.max(padding, Math.min(canvas.width - padding, x));
          }
          if (y < padding || y > canvas.height - padding) {
            vy = -vy;
            y = Math.max(padding, Math.min(canvas.height - padding, y));
          }

          updatedTargets.push({
            ...target,
            x,
            y,
            velocity: { vx, vy },
          });
        } else {
          updatedTargets.push(target);
        }
      }

      set({ targets: updatedTargets });

      // Handle expired targets
      for (const id of expiredIds) {
        get().timeoutTarget(id);
      }
    },

    // Crosshair control
    moveCrosshair: (deltaX, deltaY) => {
      const { sensitivityFactor, gameState } = get();
      if (gameState !== 'playing') return;

      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      set((state) => {
        const newX = state.crosshairX + deltaX * sensitivityFactor;
        const newY = state.crosshairY + deltaY * sensitivityFactor;

        // Clamp to canvas bounds
        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;

        return {
          crosshairX: Math.max(-halfWidth, Math.min(halfWidth, newX)),
          crosshairY: Math.max(-halfHeight, Math.min(halfHeight, newY)),
        };
      });
    },

    resetCrosshair: () => {
      set({ crosshairX: 0, crosshairY: 0 });
    },

    // Settings
    updateSettings: (newSettings) => {
      set((state) => {
        const settings = { ...state.settings, ...newSettings };
        saveSettings(settings);
        audioManager.setEnabled(settings.soundEnabled);
        return { settings };
      });
    },

    updateSensitivity: (screenWidth) => {
      const { settings } = get();
      const factor = calculateWebSensitivity(
        settings.dpi,
        settings.valorantSens,
        screenWidth
      );
      set({ sensitivityFactor: factor });
    },

    toggleSettings: () => {
      set((state) => ({
        showSettings: !state.showSettings,
        showHistory: false,
      }));
    },

    toggleHistory: () => {
      set((state) => ({
        showHistory: !state.showHistory,
        showSettings: false,
      }));
    },

    closeResults: () => {
      set({ showResults: false });
      get().resetGame();
    },

    // Timer
    updateTimer: () => {
      const { startTime, gameState } = get();
      if (gameState !== 'playing' || !startTime) return;

      set({ elapsedTime: Date.now() - startTime });
    },

    setCountdown: (value) => {
      set({ countdown: value });
    },

    // History
    loadHistory: () => {
      const history = loadHistoryFromStorage();
      set({ history });
    },

    clearHistory: () => {
      clearHistoryFromStorage();
      set({ history: { sessions: [], totalTime: 0, totalSessions: 0 } });
    },
}));
