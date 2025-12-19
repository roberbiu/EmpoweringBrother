/**
 * LocalStorage Utilities
 * Handles persistent storage of settings and training history
 */

import type { GameSettings, TrainingSession, TrainingHistory } from '../types';
import { DEFAULT_SETTINGS } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'aim-trainer-settings',
  HISTORY: 'aim-trainer-history',
  LAST_MODE: 'aim-trainer-last-mode',
};

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe JSON parse with fallback
 */
function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Load settings from localStorage
 */
export function loadSettings(): GameSettings {
  if (!isStorageAvailable()) return DEFAULT_SETTINGS;

  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const settings = safeParse<Partial<GameSettings>>(stored, {});

  // Merge with defaults to ensure all fields exist
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
  };
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: GameSettings): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}

/**
 * Load training history from localStorage
 */
export function loadHistory(): TrainingHistory {
  if (!isStorageAvailable()) {
    return { sessions: [], totalTime: 0, totalSessions: 0 };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return safeParse<TrainingHistory>(stored, {
    sessions: [],
    totalTime: 0,
    totalSessions: 0,
  });
}

/**
 * Save training history to localStorage
 */
export function saveHistory(history: TrainingHistory): void {
  if (!isStorageAvailable()) return;

  try {
    // Keep only last 100 sessions to prevent storage overflow
    const trimmedHistory: TrainingHistory = {
      ...history,
      sessions: history.sessions.slice(-100),
    };
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.warn('Failed to save history:', error);
    // If storage is full, try to clear old sessions
    try {
      const minimalHistory: TrainingHistory = {
        ...history,
        sessions: history.sessions.slice(-20),
      };
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(minimalHistory));
    } catch {
      console.error('Storage is full, unable to save history');
    }
  }
}

/**
 * Add a new session to history
 */
export function addSession(session: TrainingSession): void {
  const history = loadHistory();
  history.sessions.push(session);
  history.totalSessions = history.sessions.length;
  history.totalTime = history.sessions.reduce((sum, s) => sum + s.duration, 0);
  saveHistory(history);
}

/**
 * Clear all training history
 */
export function clearHistory(): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.setItem(
      STORAGE_KEYS.HISTORY,
      JSON.stringify({ sessions: [], totalTime: 0, totalSessions: 0 })
    );
  } catch (error) {
    console.warn('Failed to clear history:', error);
  }
}

/**
 * Load last used game mode
 */
export function loadLastMode(): string | null {
  if (!isStorageAvailable()) return null;
  return localStorage.getItem(STORAGE_KEYS.LAST_MODE);
}

/**
 * Save last used game mode
 */
export function saveLastMode(mode: string): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.LAST_MODE, mode);
  } catch (error) {
    console.warn('Failed to save last mode:', error);
  }
}

/**
 * Export data as JSON file
 */
export function exportData(): void {
  const settings = loadSettings();
  const history = loadHistory();

  const data = {
    exportDate: new Date().toISOString(),
    settings,
    history,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `aim-trainer-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export function importData(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (data.settings) {
          saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        }

        if (data.history) {
          saveHistory(data.history);
        }

        resolve({ success: true, message: 'Data imported successfully' });
      } catch {
        resolve({ success: false, message: 'Invalid file format' });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, message: 'Failed to read file' });
    };

    reader.readAsText(file);
  });
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  used: number;
  available: boolean;
  sessionsCount: number;
} {
  if (!isStorageAvailable()) {
    return { used: 0, available: false, sessionsCount: 0 };
  }

  let used = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
      }
    }
  } catch {
    // Ignore errors
  }

  const history = loadHistory();

  return {
    used,
    available: true,
    sessionsCount: history.sessions.length,
  };
}
