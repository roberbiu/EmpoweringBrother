/**
 * Statistics Calculation Utilities
 */

import type { GameStats, TrainingSession, TrainingHistory } from '../types';

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(hits: number, totalShots: number): number {
  if (totalShots === 0) return 0;
  return Math.round((hits / totalShots) * 1000) / 10; // One decimal place
}

/**
 * Calculate average from array
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

/**
 * Calculate median from array
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/**
 * Calculate standard deviation
 */
export function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = calculateAverage(values);
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.round(Math.sqrt(avgSquareDiff));
}

/**
 * Calculate percentile
 */
export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

/**
 * Create initial game stats
 */
export function createInitialStats(): GameStats {
  return {
    hits: 0,
    misses: 0,
    totalShots: 0,
    accuracy: 0,
    averageReactionTime: 0,
    reactionTimes: [],
    score: 0,
  };
}

/**
 * Update stats with a hit
 */
export function recordHit(stats: GameStats, reactionTime: number): GameStats {
  const newReactionTimes = [...stats.reactionTimes, reactionTime];
  const hits = stats.hits + 1;
  const totalShots = stats.totalShots + 1;

  // Score calculation: faster reactions = more points
  // Base score: 100 points, minus 0.5 points per ms over 200ms
  const baseScore = Math.max(0, 100 - Math.max(0, reactionTime - 200) * 0.5);
  const newScore = stats.score + Math.round(baseScore);

  return {
    hits,
    misses: stats.misses,
    totalShots,
    accuracy: calculateAccuracy(hits, totalShots),
    averageReactionTime: calculateAverage(newReactionTimes),
    reactionTimes: newReactionTimes,
    score: newScore,
  };
}

/**
 * Update stats with a miss
 */
export function recordMiss(stats: GameStats): GameStats {
  const totalShots = stats.totalShots + 1;
  const score = Math.max(0, stats.score - 25); // Penalty for miss

  return {
    ...stats,
    misses: stats.misses + 1,
    totalShots,
    accuracy: calculateAccuracy(stats.hits, totalShots),
    score,
  };
}

/**
 * Update stats with target timeout (miss without click)
 */
export function recordTimeout(stats: GameStats): GameStats {
  const score = Math.max(0, stats.score - 10); // Smaller penalty for timeout

  return {
    ...stats,
    misses: stats.misses + 1,
    score,
  };
}

/**
 * Format time for display (ms to readable string)
 */
export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  if (seconds < 60) return `${seconds}.${String(milliseconds).padStart(3, '0').slice(0, 1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * Format duration for display
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

/**
 * Get performance rating based on stats
 */
export function getPerformanceRating(stats: GameStats): {
  rating: string;
  color: string;
  description: string;
} {
  const { accuracy, averageReactionTime } = stats;

  // Combined score: accuracy weight (60%) + reaction time weight (40%)
  // Reaction time scoring: 200ms = 100 points, 500ms = 0 points
  const accuracyScore = accuracy;
  const reactionScore = Math.max(0, Math.min(100, 100 - (averageReactionTime - 200) / 3));
  const combinedScore = accuracyScore * 0.6 + reactionScore * 0.4;

  if (combinedScore >= 90) {
    return { rating: 'S', color: '#ffd700', description: 'Outstanding' };
  }
  if (combinedScore >= 80) {
    return { rating: 'A', color: '#48bb78', description: 'Excellent' };
  }
  if (combinedScore >= 70) {
    return { rating: 'B', color: '#667eea', description: 'Good' };
  }
  if (combinedScore >= 60) {
    return { rating: 'C', color: '#ed8936', description: 'Average' };
  }
  if (combinedScore >= 50) {
    return { rating: 'D', color: '#f56565', description: 'Below Average' };
  }
  return { rating: 'F', color: '#9b2c2c', description: 'Needs Practice' };
}

/**
 * Calculate streak (consecutive hits)
 */
export function getMaxStreak(shotHistory: boolean[]): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const hit of shotHistory) {
    if (hit) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

/**
 * Get statistics summary for history
 */
export function getHistorySummary(history: TrainingHistory): {
  totalSessions: number;
  totalTime: string;
  bestAccuracy: number;
  bestReactionTime: number;
  averageAccuracy: number;
  averageReactionTime: number;
} {
  const { sessions } = history;

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalTime: '0s',
      bestAccuracy: 0,
      bestReactionTime: 0,
      averageAccuracy: 0,
      averageReactionTime: 0,
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
    averageAccuracy: calculateAverage(accuracies),
    averageReactionTime: calculateAverage(reactionTimes),
  };
}

/**
 * Get trend analysis (comparing recent sessions to older ones)
 */
export function getTrend(
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

  const getMetric = (s: TrainingSession) =>
    metric === 'accuracy' ? s.stats.accuracy : s.stats.averageReactionTime;

  const recentAvg = calculateAverage(recentSessions.map(getMetric));
  const olderAvg = calculateAverage(olderSessions.map(getMetric));

  const threshold = metric === 'accuracy' ? 2 : 20; // 2% for accuracy, 20ms for reaction
  const diff = metric === 'accuracy' ? recentAvg - olderAvg : olderAvg - recentAvg;

  if (diff > threshold) return 'improving';
  if (diff < -threshold) return 'declining';
  return 'stable';
}
