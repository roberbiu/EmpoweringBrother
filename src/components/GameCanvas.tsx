/**
 * Main Game Canvas Component
 * Handles rendering and game interactions
 */

import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePointerLock } from '../hooks/usePointerLock';
import { useGameLoop, useTimer } from '../hooks/useGameLoop';
import { useI18n } from '../hooks/useI18n';
import type { GameMode } from '../types';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state
  const gameState = useGameStore((s) => s.gameState);
  const targets = useGameStore((s) => s.targets);
  const crosshairX = useGameStore((s) => s.crosshairX);
  const crosshairY = useGameStore((s) => s.crosshairY);
  const settings = useGameStore((s) => s.settings);
  const currentMode = useGameStore((s) => s.currentMode);
  const stats = useGameStore((s) => s.stats);
  const elapsedTime = useGameStore((s) => s.elapsedTime);

  // Actions
  const moveCrosshair = useGameStore((s) => s.moveCrosshair);
  const updateTargets = useGameStore((s) => s.updateTargets);
  const updateTimer = useGameStore((s) => s.updateTimer);
  const hitTarget = useGameStore((s) => s.hitTarget);
  const missShot = useGameStore((s) => s.missShot);
  const startGame = useGameStore((s) => s.startGame);
  const endGame = useGameStore((s) => s.endGame);
  const updateSensitivity = useGameStore((s) => s.updateSensitivity);

  // Pointer lock
  const { isLocked, requestLock, exitLock } = usePointerLock(containerRef, (dx, dy) => {
    if (gameState === 'playing') {
      moveCrosshair(dx, dy);
    }
  });

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      updateSensitivity(canvas.width);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateSensitivity]);

  // Update sensitivity when settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      updateSensitivity(canvas.width);
    }
  }, [settings.dpi, settings.valorantSens, updateSensitivity]);

  // Game loop for target updates
  useGameLoop({
    onUpdate: (deltaTime) => {
      if (gameState === 'playing') {
        updateTargets(deltaTime);
      }
    },
    enabled: gameState === 'playing',
  });

  // Timer update
  useTimer({
    onTick: updateTimer,
    interval: 100,
    enabled: gameState === 'playing',
  });

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0f0f1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid (subtle)
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw headshot line if in headshot mode
      if (currentMode === 'headshot' && gameState === 'playing') {
        const headHeight = canvas.height * 0.3;
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(0, headHeight);
        ctx.lineTo(canvas.width, headHeight);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw targets
      for (const target of targets) {
        const opacity = target.isHit ? 0.5 : 1;
        const scale = target.isHit ? 1.2 : 1;

        ctx.save();
        ctx.translate(target.x, target.y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        // Outer ring
        ctx.strokeStyle = '#48bb78';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner fill
        ctx.fillStyle = 'rgba(72, 187, 120, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.fillStyle = '#48bb78';
        ctx.beginPath();
        ctx.arc(0, 0, target.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Draw crosshair
      if (gameState === 'playing' || gameState === 'idle') {
        const cx = canvas.width / 2 + crosshairX;
        const cy = canvas.height / 2 + crosshairY;
        const size = settings.crosshairSize;
        const gap = 3;
        const thickness = 2;

        ctx.strokeStyle = settings.crosshairColor;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';

        // Top
        ctx.beginPath();
        ctx.moveTo(cx, cy - gap);
        ctx.lineTo(cx, cy - gap - size);
        ctx.stroke();

        // Bottom
        ctx.beginPath();
        ctx.moveTo(cx, cy + gap);
        ctx.lineTo(cx, cy + gap + size);
        ctx.stroke();

        // Left
        ctx.beginPath();
        ctx.moveTo(cx - gap, cy);
        ctx.lineTo(cx - gap - size, cy);
        ctx.stroke();

        // Right
        ctx.beginPath();
        ctx.moveTo(cx + gap, cy);
        ctx.lineTo(cx + gap + size, cy);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = settings.crosshairColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [targets, crosshairX, crosshairY, settings, gameState, currentMode]);

  // Click handler
  const handleClick = useCallback(
    (_e: React.MouseEvent) => {
      if (gameState === 'idle') {
        requestLock();
        setTimeout(startGame, 100);
        return;
      }

      if (gameState !== 'playing') return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const clickX = canvas.width / 2 + crosshairX;
      const clickY = canvas.height / 2 + crosshairY;

      // Check if any target was hit
      let hit = false;
      for (const target of targets) {
        if (target.isHit) continue;

        const dx = clickX - target.x;
        const dy = clickY - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= target.radius) {
          hitTarget(target.id);
          hit = true;
          break;
        }
      }

      if (!hit) {
        missShot();
      }
    },
    [gameState, crosshairX, crosshairY, targets, hitTarget, missShot, requestLock, startGame]
  );

  // Key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLocked) {
          exitLock();
          if (gameState === 'playing') {
            endGame();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, gameState, exitLock, endGame]);

  const { t } = useI18n();

  // Format time
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const modeIcons: Record<GameMode, string> = {
    reaction: '⚡',
    flick: '🎯',
    tracking: '🔄',
    gridshot: '⊞',
    headshot: '💀',
  };

  const modeT = t.modes[currentMode];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-none"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        id="game-canvas"
        className="w-full h-full"
      />

      {/* HUD Overlay */}
      {gameState === 'playing' && settings.showStats && (
        <div className="absolute top-4 left-4 text-game-text-dim font-mono text-sm space-y-1 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-game-accent">{modeIcons[currentMode]}</span>
            <span>{modeT.name}</span>
          </div>
          <div>{t.game.time}: {formatTime(elapsedTime)}</div>
          <div>{t.game.hits}: {stats.hits}</div>
          <div>{t.game.accuracy}: {stats.accuracy}%</div>
          <div>{t.game.score}: {stats.score}</div>
        </div>
      )}

      {/* Start prompt */}
      {gameState === 'idle' && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-4xl mb-4">{modeIcons[currentMode]}</div>
            <div className="text-xl text-game-text mb-2">{modeT.name}</div>
            <div className="text-game-text-dim text-sm mb-6">{modeT.description}</div>
            <div className="text-game-accent text-lg">{t.game.clickToStart}</div>
            <div className="text-game-text-dim text-xs mt-2">{t.game.pressEscToExit}</div>
          </div>
        </div>
      )}
    </div>
  );
}
