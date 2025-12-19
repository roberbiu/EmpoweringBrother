/**
 * Game Mode Selector Component
 */

import { useGameStore } from '../store/gameStore';
import { useI18n } from '../hooks/useI18n';
import type { GameMode } from '../types';

const modes: GameMode[] = ['reaction', 'flick', 'tracking', 'gridshot', 'headshot'];

const modeIcons: Record<GameMode, string> = {
  reaction: '⚡',
  flick: '🎯',
  tracking: '🔄',
  gridshot: '⊞',
  headshot: '💀',
};

export function ModeSelector() {
  const currentMode = useGameStore((s) => s.currentMode);
  const setMode = useGameStore((s) => s.setMode);
  const gameState = useGameStore((s) => s.gameState);
  const { t } = useI18n();

  const disabled = gameState === 'playing';

  return (
    <div className="flex gap-2 flex-wrap">
      {modes.map((mode) => {
        const modeT = t.modes[mode];
        const isActive = currentMode === mode;

        return (
          <button
            key={mode}
            onClick={() => !disabled && setMode(mode)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg font-mono text-sm transition-all
              ${
                isActive
                  ? 'bg-game-accent text-white shadow-lg shadow-game-accent/20'
                  : 'bg-game-surface text-game-text-dim hover:bg-game-border hover:text-game-text'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={modeT.description}
          >
            <span className="mr-2">{modeIcons[mode]}</span>
            <span>{modeT.name}</span>
          </button>
        );
      })}
    </div>
  );
}
