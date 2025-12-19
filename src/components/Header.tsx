/**
 * Header Component
 * Minimal header bar with mode selection and controls
 */

import { useGameStore } from '../store/gameStore';
import { useI18n } from '../hooks/useI18n';
import { ModeSelector } from './ModeSelector';
import { calculateEDPI, formatCm360 } from '../utils/sensitivity';

export function Header() {
  const settings = useGameStore((s) => s.settings);
  const toggleSettings = useGameStore((s) => s.toggleSettings);
  const toggleHistory = useGameStore((s) => s.toggleHistory);
  const gameState = useGameStore((s) => s.gameState);
  const endGame = useGameStore((s) => s.endGame);
  const { t } = useI18n();

  const eDPI = calculateEDPI(settings.dpi, settings.valorantSens);
  const cm360 = formatCm360(settings.dpi, settings.valorantSens);

  return (
    <header className="bg-game-surface/80 backdrop-blur border-b border-game-border px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h1 className="text-lg font-bold text-game-text leading-tight">
              {t.appTitle}
            </h1>
            <div className="text-xs text-game-text-dim">
              eDPI: {eDPI.toFixed(0)} • {cm360}
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="hidden md:block">
          <ModeSelector />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {gameState === 'playing' && (
            <button
              onClick={endGame}
              className="px-4 py-2 bg-game-error/20 hover:bg-game-error/30 text-game-error rounded-lg transition-colors text-sm font-semibold"
            >
              {t.game.endGame}
            </button>
          )}

          <button
            onClick={toggleHistory}
            className="p-2 bg-game-bg hover:bg-game-border text-game-text-dim hover:text-game-text rounded-lg transition-colors"
            title={t.history.title}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>

          <button
            onClick={toggleSettings}
            className="p-2 bg-game-bg hover:bg-game-border text-game-text-dim hover:text-game-text rounded-lg transition-colors"
            title={t.settings.title}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Mode Selector */}
      <div className="md:hidden mt-3">
        <ModeSelector />
      </div>
    </header>
  );
}
