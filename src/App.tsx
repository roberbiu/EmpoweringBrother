/**
 * Main App Component
 * Valorant Aim Trainer - Web-based aim training tool
 */

import { useEffect } from 'react';
import { Header } from './components/Header';
import { GameCanvas } from './components/GameCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { ResultsModal } from './components/ResultsModal';
import { HistoryPanel } from './components/HistoryPanel';
import { useGameStore } from './store/gameStore';
import { useI18n } from './hooks/useI18n';
import { loadLastMode } from './utils/storage';
import type { GameMode } from './types';

export default function App() {
  const setMode = useGameStore((s) => s.setMode);
  const loadHistory = useGameStore((s) => s.loadHistory);
  const { t } = useI18n();

  // Load saved mode and history on mount
  useEffect(() => {
    const savedMode = loadLastMode();
    if (savedMode && ['reaction', 'flick', 'tracking', 'gridshot', 'headshot'].includes(savedMode)) {
      setMode(savedMode as GameMode);
    }
    loadHistory();
  }, [setMode, loadHistory]);

  // Prevent context menu on right-click (for gaming experience)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't process shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Number keys for mode selection (when not playing)
      const gameState = useGameStore.getState().gameState;
      if (gameState !== 'playing') {
        const modes: GameMode[] = ['reaction', 'flick', 'tracking', 'gridshot', 'headshot'];
        const num = parseInt(e.key);
        if (num >= 1 && num <= 5) {
          setMode(modes[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode]);

  return (
    <div className="h-screen w-screen flex flex-col bg-game-bg overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Game Area */}
      <main className="flex-1 relative overflow-hidden">
        <GameCanvas />
      </main>

      {/* Keyboard Hints */}
      <footer className="bg-game-surface/50 border-t border-game-border px-4 py-2">
        <div className="flex items-center justify-center gap-6 text-xs text-game-text-dim">
          <span>
            <kbd className="px-1.5 py-0.5 bg-game-bg rounded mr-1">1-5</kbd>
            {t.footer.switchMode}
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-game-bg rounded mr-1">Click</kbd>
            {t.footer.startShoot}
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-game-bg rounded mr-1">ESC</kbd>
            {t.footer.endGame}
          </span>
        </div>
      </footer>

      {/* Modals */}
      <SettingsPanel />
      <ResultsModal />
      <HistoryPanel />
    </div>
  );
}
