/**
 * Internationalization (i18n) Module
 * Supports Chinese (zh) and English (en), default: Chinese
 */

export type Language = 'zh' | 'en';

export interface Translations {
  // App
  appTitle: string;
  appSubtitle: string;

  // Modes
  modes: {
    reaction: { name: string; description: string };
    flick: { name: string; description: string };
    tracking: { name: string; description: string };
    gridshot: { name: string; description: string };
    headshot: { name: string; description: string };
  };

  // Game UI
  game: {
    clickToStart: string;
    pressEscToExit: string;
    time: string;
    hits: string;
    accuracy: string;
    score: string;
    endGame: string;
  };

  // Settings
  settings: {
    title: string;
    sensitivity: string;
    mouseDpi: string;
    mouseDpiHint: string;
    valorantSens: string;
    valorantSensHint: string;
    edpiLabel: string;
    cm360Label: string;
    classification: string;
    game: string;
    targetSize: string;
    small: string;
    medium: string;
    large: string;
    difficulty: string;
    easy: string;
    hard: string;
    crosshairSize: string;
    crosshairColor: string;
    options: string;
    showStats: string;
    soundEffects: string;
    language: string;
  };

  // Results
  results: {
    sessionComplete: string;
    score: string;
    accuracy: string;
    duration: string;
    hitsTotal: string;
    avgReaction: string;
    medianReaction: string;
    bestReaction: string;
    percentile90: string;
    reactionDistribution: string;
    close: string;
    playAgain: string;
    outstanding: string;
    excellent: string;
    good: string;
    average: string;
    belowAverage: string;
    needsPractice: string;
  };

  // History
  history: {
    title: string;
    sessions: string;
    totalTime: string;
    bestAccuracy: string;
    bestReaction: string;
    accuracyTrend: string;
    reactionTrend: string;
    improving: string;
    stable: string;
    declining: string;
    insufficient: string;
    recentSessions: string;
    noSessions: string;
    exportData: string;
    clearHistory: string;
    clearConfirm: string;
  };

  // Footer
  footer: {
    switchMode: string;
    startShoot: string;
    endGame: string;
  };

  // Sensitivity classifications
  sensClass: {
    veryLow: string;
    low: string;
    mediumLow: string;
    medium: string;
    mediumHigh: string;
    high: string;
  };
}

const zh: Translations = {
  appTitle: '瞄准训练器',
  appSubtitle: '数据分析工具',

  modes: {
    reaction: { name: '反应速度', description: '测试你的反应速度' },
    flick: { name: '甩枪', description: '快速目标捕获' },
    tracking: { name: '追踪', description: '跟随移动目标' },
    gridshot: { name: '多目标', description: '多目标快速切换' },
    headshot: { name: '爆头线', description: '练习准星位置' },
  },

  game: {
    clickToStart: '点击开始',
    pressEscToExit: '按 ESC 退出',
    time: '时间',
    hits: '命中',
    accuracy: '准确率',
    score: '分数',
    endGame: '结束 (ESC)',
  },

  settings: {
    title: '设置',
    sensitivity: '灵敏度',
    mouseDpi: '鼠标 DPI',
    mouseDpiHint: '常用值: 400, 800, 1600',
    valorantSens: 'Valorant 灵敏度',
    valorantSensHint: '推荐范围',
    edpiLabel: 'eDPI',
    cm360Label: 'cm/360°',
    classification: '等级',
    game: '游戏',
    targetSize: '目标大小',
    small: '小',
    medium: '中',
    large: '大',
    difficulty: '难度',
    easy: '简单',
    hard: '困难',
    crosshairSize: '准星大小',
    crosshairColor: '准星颜色',
    options: '选项',
    showStats: '游戏中显示统计',
    soundEffects: '音效',
    language: '语言',
  },

  results: {
    sessionComplete: '训练完成',
    score: '分数',
    accuracy: '准确率',
    duration: '时长',
    hitsTotal: '命中 / 总数',
    avgReaction: '平均反应',
    medianReaction: '中位反应',
    bestReaction: '最快反应',
    percentile90: '90分位',
    reactionDistribution: '反应时间分布',
    close: '关闭',
    playAgain: '再来一局',
    outstanding: '卓越',
    excellent: '优秀',
    good: '良好',
    average: '中等',
    belowAverage: '待提高',
    needsPractice: '需要练习',
  },

  history: {
    title: '训练历史',
    sessions: '训练次数',
    totalTime: '总时长',
    bestAccuracy: '最高准确率',
    bestReaction: '最快反应',
    accuracyTrend: '准确率趋势',
    reactionTrend: '反应趋势',
    improving: '进步中',
    stable: '稳定',
    declining: '下降中',
    insufficient: '数据不足',
    recentSessions: '最近训练',
    noSessions: '暂无训练记录，开始练习吧！',
    exportData: '导出数据',
    clearHistory: '清除历史',
    clearConfirm: '确定要清除所有训练历史吗？',
  },

  footer: {
    switchMode: '切换模式',
    startShoot: '开始/射击',
    endGame: '结束游戏',
  },

  sensClass: {
    veryLow: '极低',
    low: '低 (职业级)',
    mediumLow: '中低',
    medium: '中等',
    mediumHigh: '中高',
    high: '高',
  },
};

const en: Translations = {
  appTitle: 'Aim Trainer',
  appSubtitle: 'Data Analysis Tool',

  modes: {
    reaction: { name: 'Reaction', description: 'Test your reaction speed' },
    flick: { name: 'Flick Shot', description: 'Quick target acquisition' },
    tracking: { name: 'Tracking', description: 'Follow moving targets' },
    gridshot: { name: 'Grid Shot', description: 'Multiple target switching' },
    headshot: { name: 'Headshot Line', description: 'Practice crosshair placement' },
  },

  game: {
    clickToStart: 'Click to Start',
    pressEscToExit: 'Press ESC to exit',
    time: 'Time',
    hits: 'Hits',
    accuracy: 'Accuracy',
    score: 'Score',
    endGame: 'End (ESC)',
  },

  settings: {
    title: 'Settings',
    sensitivity: 'Sensitivity',
    mouseDpi: 'Mouse DPI',
    mouseDpiHint: 'Common values: 400, 800, 1600',
    valorantSens: 'Valorant Sensitivity',
    valorantSensHint: 'Recommended',
    edpiLabel: 'eDPI',
    cm360Label: 'cm/360°',
    classification: 'Classification',
    game: 'Game',
    targetSize: 'Target Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    difficulty: 'Difficulty',
    easy: 'Easy',
    hard: 'Hard',
    crosshairSize: 'Crosshair Size',
    crosshairColor: 'Crosshair Color',
    options: 'Options',
    showStats: 'Show Stats During Game',
    soundEffects: 'Sound Effects',
    language: 'Language',
  },

  results: {
    sessionComplete: 'Session Complete',
    score: 'Score',
    accuracy: 'Accuracy',
    duration: 'Duration',
    hitsTotal: 'Hits / Total',
    avgReaction: 'Avg Reaction',
    medianReaction: 'Median Reaction',
    bestReaction: 'Best Reaction',
    percentile90: '90th Percentile',
    reactionDistribution: 'Reaction Distribution',
    close: 'Close',
    playAgain: 'Play Again',
    outstanding: 'Outstanding',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    belowAverage: 'Below Average',
    needsPractice: 'Needs Practice',
  },

  history: {
    title: 'Training History',
    sessions: 'Sessions',
    totalTime: 'Total Time',
    bestAccuracy: 'Best Accuracy',
    bestReaction: 'Best Reaction',
    accuracyTrend: 'Accuracy Trend',
    reactionTrend: 'Reaction Trend',
    improving: 'Improving',
    stable: 'Stable',
    declining: 'Declining',
    insufficient: 'Insufficient Data',
    recentSessions: 'Recent Sessions',
    noSessions: 'No training sessions yet. Start practicing!',
    exportData: 'Export Data',
    clearHistory: 'Clear History',
    clearConfirm: 'Are you sure you want to clear all training history?',
  },

  footer: {
    switchMode: 'Switch Mode',
    startShoot: 'Start/Shoot',
    endGame: 'End Game',
  },

  sensClass: {
    veryLow: 'Very Low',
    low: 'Low (Pro Level)',
    mediumLow: 'Medium-Low',
    medium: 'Medium',
    mediumHigh: 'Medium-High',
    high: 'High',
  },
};

const translations: Record<Language, Translations> = { zh, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function getDefaultLanguage(): Language {
  return 'zh'; // Default to Chinese
}

// Storage key for language preference
const LANG_STORAGE_KEY = 'aim-trainer-language';

export function loadLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') {
      return stored;
    }
  } catch {
    // Ignore storage errors
  }
  return getDefaultLanguage();
}

export function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
}
