/**
 * History Panel Component
 * Shows training history and statistics
 */

import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useI18n } from '../hooks/useI18n';
import type { GameMode, TrainingHistory } from '../types';
import { formatDuration } from '../utils/statistics';
import { exportData, clearHistory as clearHistoryStorage } from '../utils/storage';

const modeIcons: Record<GameMode, string> = {
  reaction: '⚡',
  flick: '🎯',
  tracking: '🔄',
  gridshot: '⊞',
  headshot: '💀',
};

// Calculate average
function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

// Get history summary
function getHistorySummary(history: TrainingHistory) {
  const { sessions } = history;

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalTime: '0s',
      bestAccuracy: 0,
      bestReactionTime: 0,
    };
  }

  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const accuracies = sessions.map((s) => s.stats.accuracy);
  const reactionTimes = sessions
    .map((s) => s.stats.averageReactionTime)
    .filter((t) => t > 0);

  return {
    totalSessions: sessions.length,
    totalTime: formatDuration(totalTime),
    bestAccuracy: Math.max(...accuracies),
    bestReactionTime: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0,
  };
}

// Get trend
function getTrend(
  history: TrainingHistory,
  metric: 'accuracy' | 'reactionTime',
  recentCount: number = 5
): 'improving' | 'stable' | 'declining' | 'insufficient' {
  const { sessions } = history;

  if (sessions.length < recentCount * 2) {
    return 'insufficient';
  }

  const recentSessions = sessions.slice(-recentCount);
  const olderSessions = sessions.slice(-recentCount * 2, -recentCount);

  const getMetric = (s: typeof sessions[0]) =>
    metric === 'accuracy' ? s.stats.accuracy : s.stats.averageReactionTime;

  const recentAvg = calculateAverage(recentSessions.map(getMetric));
  const olderAvg = calculateAverage(olderSessions.map(getMetric));

  const threshold = metric === 'accuracy' ? 2 : 20;
  const diff = metric === 'accuracy' ? recentAvg - olderAvg : olderAvg - recentAvg;

  if (diff > threshold) return 'improving';
  if (diff < -threshold) return 'declining';
  return 'stable';
}

export function HistoryPanel() {
  const showHistory = useGameStore((s) => s.showHistory);
  const toggleHistory = useGameStore((s) => s.toggleHistory);
  const history = useGameStore((s) => s.history);
  const loadHistory = useGameStore((s) => s.loadHistory);
  const { t } = useI18n();

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (!showHistory) return null;

  const summary = getHistorySummary(history);
  const accuracyTrend = getTrend(history, 'accuracy');
  const reactionTrend = getTrend(history, 'reactionTime');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '↑';
      case 'declining':
        return '↓';
      case 'stable':
        return '→';
      default:
        return '?';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-game-success';
      case 'declining':
        return 'text-game-error';
      default:
        return 'text-game-text-dim';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return t.history.improving;
      case 'declining':
        return t.history.declining;
      case 'stable':
        return t.history.stable;
      default:
        return t.history.insufficient;
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(t.history.clearConfirm)) {
      clearHistoryStorage();
      loadHistory();
    }
  };

  const recentSessions = history.sessions.slice(-10).reverse();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-game-surface border border-game-border rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-game-text">{t.history.title}</h2>
          <button
            onClick={toggleHistory}
            className="text-game-text-dim hover:text-game-text transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-game-bg rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-game-accent">{summary.totalSessions}</div>
            <div className="text-xs text-game-text-dim">{t.history.sessions}</div>
          </div>
          <div className="bg-game-bg rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-game-text">{summary.totalTime}</div>
            <div className="text-xs text-game-text-dim">{t.history.totalTime}</div>
          </div>
          <div className="bg-game-bg rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-game-success">
              {summary.bestAccuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-game-text-dim">{t.history.bestAccuracy}</div>
          </div>
          <div className="bg-game-bg rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-game-warning">
              {summary.bestReactionTime > 0 ? `${summary.bestReactionTime}ms` : '-'}
            </div>
            <div className="text-xs text-game-text-dim">{t.history.bestReaction}</div>
          </div>
        </div>

        {/* Trends */}
        {summary.totalSessions >= 10 && (
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-game-bg rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-game-text-dim">{t.history.accuracyTrend}</span>
                <span className={`text-lg font-bold ${getTrendColor(accuracyTrend)}`}>
                  {getTrendIcon(accuracyTrend)}
                </span>
              </div>
              <div className="text-xs text-game-text-dim mt-1">{getTrendText(accuracyTrend)}</div>
            </div>
            <div className="flex-1 bg-game-bg rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-game-text-dim">{t.history.reactionTrend}</span>
                <span className={`text-lg font-bold ${getTrendColor(reactionTrend)}`}>
                  {getTrendIcon(reactionTrend)}
                </span>
              </div>
              <div className="text-xs text-game-text-dim mt-1">{getTrendText(reactionTrend)}</div>
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        <div className="flex-1 overflow-auto">
          <h3 className="text-sm font-semibold text-game-accent uppercase tracking-wider mb-3">
            {t.history.recentSessions}
          </h3>

          {recentSessions.length === 0 ? (
            <div className="text-center text-game-text-dim py-8">
              {t.history.noSessions}
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((session) => {
                const modeT = t.modes[session.mode];
                const date = new Date(session.startTime);

                return (
                  <div
                    key={session.id}
                    className="bg-game-bg rounded-lg p-3 flex items-center gap-4"
                  >
                    <div className="text-2xl">{modeIcons[session.mode]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-game-text">
                          {modeT.name}
                        </span>
                        <span className="text-xs text-game-text-dim">
                          {formatDuration(session.duration)}
                        </span>
                      </div>
                      <div className="text-xs text-game-text-dim">
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-game-accent">
                        {session.stats.score}
                      </div>
                      <div className="text-xs text-game-text-dim">
                        {session.stats.accuracy}% • {session.stats.averageReactionTime || '-'}ms
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-game-border">
          <button
            onClick={exportData}
            className="flex-1 bg-game-bg hover:bg-game-border text-game-text py-2 rounded-lg transition-colors text-sm"
          >
            {t.history.exportData}
          </button>
          <button
            onClick={handleClearHistory}
            className="flex-1 bg-game-error/20 hover:bg-game-error/30 text-game-error py-2 rounded-lg transition-colors text-sm"
          >
            {t.history.clearHistory}
          </button>
        </div>
      </div>
    </div>
  );
}
