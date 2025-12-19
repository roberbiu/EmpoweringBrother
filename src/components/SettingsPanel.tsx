/**
 * Settings Panel Component
 */

import { useGameStore } from '../store/gameStore';
import { useI18n } from '../hooks/useI18n';
import {
  calculateEDPI,
  calculateCm360,
  getRecommendedSensRange,
} from '../utils/sensitivity';

export function SettingsPanel() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const showSettings = useGameStore((s) => s.showSettings);
  const toggleSettings = useGameStore((s) => s.toggleSettings);
  const { t, language, toggleLanguage } = useI18n();

  if (!showSettings) return null;

  const eDPI = calculateEDPI(settings.dpi, settings.valorantSens);
  const cm360 = calculateCm360(settings.dpi, settings.valorantSens);
  const recommended = getRecommendedSensRange(settings.dpi);

  // Sensitivity classification
  const getSensClass = (edpi: number): string => {
    if (edpi < 200) return t.sensClass.veryLow;
    if (edpi < 300) return t.sensClass.low;
    if (edpi < 400) return t.sensClass.mediumLow;
    if (edpi < 600) return t.sensClass.medium;
    if (edpi < 800) return t.sensClass.mediumHigh;
    return t.sensClass.high;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-game-surface border border-game-border rounded-xl p-6 max-w-md w-full mx-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-game-text">{t.settings.title}</h2>
          <button
            onClick={toggleSettings}
            className="text-game-text-dim hover:text-game-text transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Language Toggle */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-game-accent uppercase tracking-wider">
              {t.settings.language}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => language !== 'zh' && toggleLanguage()}
                className={`flex-1 py-2 rounded-lg font-mono text-sm transition-all ${
                  language === 'zh'
                    ? 'bg-game-accent text-white'
                    : 'bg-game-bg text-game-text-dim hover:text-game-text'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => language !== 'en' && toggleLanguage()}
                className={`flex-1 py-2 rounded-lg font-mono text-sm transition-all ${
                  language === 'en'
                    ? 'bg-game-accent text-white'
                    : 'bg-game-bg text-game-text-dim hover:text-game-text'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Sensitivity Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-game-accent uppercase tracking-wider">
              {t.settings.sensitivity}
            </h3>

            {/* DPI */}
            <div>
              <label className="block text-sm text-game-text-dim mb-2">
                {t.settings.mouseDpi}
              </label>
              <input
                type="number"
                value={settings.dpi}
                onChange={(e) =>
                  updateSettings({ dpi: Math.max(100, parseInt(e.target.value) || 800) })
                }
                className="w-full bg-game-bg border border-game-border rounded-lg px-4 py-2 text-game-text font-mono focus:border-game-accent outline-none"
                min="100"
                max="16000"
                step="100"
              />
              <div className="text-xs text-game-text-dim mt-1">
                {t.settings.mouseDpiHint}
              </div>
            </div>

            {/* Valorant Sensitivity */}
            <div>
              <label className="block text-sm text-game-text-dim mb-2">
                {t.settings.valorantSens}
              </label>
              <input
                type="number"
                value={settings.valorantSens}
                onChange={(e) =>
                  updateSettings({
                    valorantSens: Math.max(0.01, parseFloat(e.target.value) || 0.35),
                  })
                }
                className="w-full bg-game-bg border border-game-border rounded-lg px-4 py-2 text-game-text font-mono focus:border-game-accent outline-none"
                min="0.01"
                max="10"
                step="0.01"
              />
              <div className="text-xs text-game-text-dim mt-1">
                {t.settings.valorantSensHint}: {recommended.min.toFixed(3)} - {recommended.max.toFixed(3)}
              </div>
            </div>

            {/* Sensitivity Stats */}
            <div className="bg-game-bg rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-game-text-dim">{t.settings.edpiLabel}</span>
                <span className="text-game-text font-mono">{eDPI.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-game-text-dim">{t.settings.cm360Label}</span>
                <span className="text-game-text font-mono">{cm360.toFixed(2)} cm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-game-text-dim">{t.settings.classification}</span>
                <span className="text-game-accent">{getSensClass(eDPI)}</span>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-game-accent uppercase tracking-wider">
              {t.settings.game}
            </h3>

            {/* Target Size */}
            <div>
              <label className="block text-sm text-game-text-dim mb-2">
                {t.settings.targetSize}
              </label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ targetSize: size })}
                    className={`flex-1 py-2 rounded-lg font-mono text-sm transition-all ${
                      settings.targetSize === size
                        ? 'bg-game-accent text-white'
                        : 'bg-game-bg text-game-text-dim hover:text-game-text'
                    }`}
                  >
                    {size === 'small' ? t.settings.small : size === 'medium' ? t.settings.medium : t.settings.large}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-game-text-dim mb-2">
                {t.settings.difficulty}
              </label>
              <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => updateSettings({ difficulty: diff })}
                    className={`flex-1 py-2 rounded-lg font-mono text-sm transition-all ${
                      settings.difficulty === diff
                        ? 'bg-game-accent text-white'
                        : 'bg-game-bg text-game-text-dim hover:text-game-text'
                    }`}
                  >
                    {diff === 'easy' ? t.settings.easy : diff === 'medium' ? t.settings.medium : t.settings.hard}
                  </button>
                ))}
              </div>
            </div>

            {/* Crosshair Size */}
            <div>
              <label className="block text-sm text-game-text-dim mb-2">
                {t.settings.crosshairSize}: {settings.crosshairSize}
              </label>
              <input
                type="range"
                value={settings.crosshairSize}
                onChange={(e) => updateSettings({ crosshairSize: parseInt(e.target.value) })}
                className="w-full accent-game-accent"
                min="2"
                max="10"
                step="1"
              />
            </div>

            {/* Crosshair Color */}
            <div>
              <label className="block text-sm text-game-text-dim mb-2">
                {t.settings.crosshairColor}
              </label>
              <div className="flex gap-2">
                {['#ffffff', '#00ff00', '#ff0000', '#00ffff', '#ffff00'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSettings({ crosshairColor: color })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      settings.crosshairColor === color
                        ? 'border-game-accent scale-110'
                        : 'border-game-border hover:border-game-text-dim'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-game-accent uppercase tracking-wider">
              {t.settings.options}
            </h3>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-game-text-dim">{t.settings.showStats}</span>
              <input
                type="checkbox"
                checked={settings.showStats}
                onChange={(e) => updateSettings({ showStats: e.target.checked })}
                className="w-5 h-5 rounded accent-game-accent cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-game-text-dim">{t.settings.soundEffects}</span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 rounded accent-game-accent cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
