/**
 * Results Modal Component
 * Shows game statistics after completing a session
 */

import { useGameStore } from '../store/gameStore';
import { useI18n } from '../hooks/useI18n';
import type { GameMode } from '../types';
import {
  formatTime,
  calculateMedian,
  calculatePercentile,
} from '../utils/statistics';

const modeIcons: Record<GameMode, string> = {
  reaction: '⚡',
  flick: '🎯',
  tracking: '🔄',
  gridshot: '⊞',
  headshot: '💀',
};

export function ResultsModal() {
  const showResults = useGameStore((s) => s.showResults);
  const closeResults = useGameStore((s) => s.closeResults);
  const stats = useGameStore((s) => s.stats);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const currentMode = useGameStore((s) => s.currentMode);
  const { t } = useI18n();

  if (!showResults) return null;

  const modeT = t.modes[currentMode];

  // Performance rating
  const getPerformanceRating = () => {
    const { accuracy, averageReactionTime } = stats;
    const accuracyScore = accuracy;
    const reactionScore = Math.max(0, Math.min(100, 100 - (averageReactionTime - 200) / 3));
    const combinedScore = accuracyScore * 0.6 + reactionScore * 0.4;

    if (combinedScore >= 90) {
      return { rating: 'S', color: '#ffd700', description: t.results.outstanding };
    }
    if (combinedScore >= 80) {
      return { rating: 'A', color: '#48bb78', description: t.results.excellent };
    }
    if (combinedScore >= 70) {
      return { rating: 'B', color: '#667eea', description: t.results.good };
    }
    if (combinedScore >= 60) {
      return { rating: 'C', color: '#ed8936', description: t.results.average };
    }
    if (combinedScore >= 50) {
      return { rating: 'D', color: '#f56565', description: t.results.belowAverage };
    }
    return { rating: 'F', color: '#9b2c2c', description: t.results.needsPractice };
  };

  const rating = getPerformanceRating();

  // Calculate additional stats
  const medianReaction = calculateMedian(stats.reactionTimes);
  const bestReaction = stats.reactionTimes.length > 0 ? Math.min(...stats.reactionTimes) : 0;
  const p90Reaction = calculatePercentile(stats.reactionTimes, 90);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-game-surface border border-game-border rounded-xl p-8 max-w-lg w-full mx-4 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">{modeIcons[currentMode]}</div>
          <h2 className="text-2xl font-bold text-game-text mb-1">{modeT.name}</h2>
          <p className="text-game-text-dim">{t.results.sessionComplete}</p>
        </div>

        {/* Rating */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold border-4"
            style={{ borderColor: rating.color, color: rating.color }}
          >
            {rating.rating}
          </div>
        </div>
        <p className="text-center text-game-text-dim mb-6">{rating.description}</p>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-game-bg rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-game-accent">{stats.score}</div>
            <div className="text-sm text-game-text-dim">{t.results.score}</div>
          </div>
          <div className="bg-game-bg rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-game-success">{stats.accuracy}%</div>
            <div className="text-sm text-game-text-dim">{t.results.accuracy}</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-game-bg rounded-lg p-4 space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-game-text-dim">{t.results.duration}</span>
            <span className="text-game-text font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-game-text-dim">{t.results.hitsTotal}</span>
            <span className="text-game-text font-mono">
              {stats.hits} / {stats.totalShots}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-game-text-dim">{t.results.avgReaction}</span>
            <span className="text-game-text font-mono">
              {stats.averageReactionTime > 0 ? `${stats.averageReactionTime}ms` : '-'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-game-text-dim">{t.results.medianReaction}</span>
            <span className="text-game-text font-mono">
              {medianReaction > 0 ? `${medianReaction}ms` : '-'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-game-text-dim">{t.results.bestReaction}</span>
            <span className="text-game-success font-mono">
              {bestReaction > 0 ? `${bestReaction}ms` : '-'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-game-text-dim">{t.results.percentile90}</span>
            <span className="text-game-text font-mono">
              {p90Reaction > 0 ? `${Math.round(p90Reaction)}ms` : '-'}
            </span>
          </div>
        </div>

        {/* Reaction Time Distribution */}
        {stats.reactionTimes.length > 5 && (
          <div className="bg-game-bg rounded-lg p-4 mb-6">
            <div className="text-sm text-game-text-dim mb-3">{t.results.reactionDistribution}</div>
            <div className="h-16 flex items-end gap-1">
              {(() => {
                const bucketSize = 50;
                const maxBucket = 800;
                const buckets: number[] = new Array(Math.ceil(maxBucket / bucketSize)).fill(0);

                stats.reactionTimes.forEach((time) => {
                  const bucketIndex = Math.min(
                    Math.floor(time / bucketSize),
                    buckets.length - 1
                  );
                  buckets[bucketIndex]++;
                });

                const maxCount = Math.max(...buckets);

                return buckets.map((count, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-game-accent rounded-t transition-all"
                    style={{ height: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%' }}
                    title={`${i * bucketSize}-${(i + 1) * bucketSize}ms: ${count}`}
                  />
                ));
              })()}
            </div>
            <div className="flex justify-between text-xs text-game-text-dim mt-1">
              <span>0ms</span>
              <span>400ms</span>
              <span>800ms+</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={closeResults}
            className="flex-1 bg-game-bg hover:bg-game-border text-game-text py-3 rounded-lg transition-colors font-semibold"
          >
            {t.results.close}
          </button>
          <button
            onClick={() => {
              closeResults();
              setTimeout(() => useGameStore.getState().startGame(), 100);
            }}
            className="flex-1 bg-game-accent hover:bg-game-accent-hover text-white py-3 rounded-lg transition-colors font-semibold"
          >
            {t.results.playAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
