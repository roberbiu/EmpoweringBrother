/**
 * Audio Utilities
 * Generates simple audio feedback using Web Audio API
 */

let audioContext: AudioContext | null = null;

/**
 * Initialize audio context (must be called after user interaction)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a simple beep sound
 */
export function playBeep(
  frequency: number = 440,
  duration: number = 0.1,
  volume: number = 0.2
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio is not available
  }
}

/**
 * Play hit sound (success)
 */
export function playHitSound(): void {
  playBeep(880, 0.08, 0.15); // Higher pitch, short
}

/**
 * Play miss sound (failure)
 */
export function playMissSound(): void {
  playBeep(220, 0.15, 0.1); // Lower pitch, slightly longer
}

/**
 * Play start sound
 */
export function playStartSound(): void {
  playBeep(523, 0.1, 0.2); // C5
  setTimeout(() => playBeep(659, 0.1, 0.2), 100); // E5
  setTimeout(() => playBeep(784, 0.15, 0.2), 200); // G5
}

/**
 * Play end sound
 */
export function playEndSound(): void {
  playBeep(784, 0.1, 0.2); // G5
  setTimeout(() => playBeep(659, 0.1, 0.2), 100); // E5
  setTimeout(() => playBeep(523, 0.2, 0.2), 200); // C5
}

/**
 * Play countdown tick
 */
export function playTickSound(): void {
  playBeep(600, 0.05, 0.1);
}

/**
 * Play target spawn sound (subtle)
 */
export function playSpawnSound(): void {
  playBeep(1200, 0.03, 0.05);
}

/**
 * Audio manager singleton for global control
 */
class AudioManager {
  private enabled: boolean = false;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  playHit(): void {
    if (this.enabled) playHitSound();
  }

  playMiss(): void {
    if (this.enabled) playMissSound();
  }

  playStart(): void {
    if (this.enabled) playStartSound();
  }

  playEnd(): void {
    if (this.enabled) playEndSound();
  }

  playTick(): void {
    if (this.enabled) playTickSound();
  }

  playSpawn(): void {
    if (this.enabled) playSpawnSound();
  }
}

export const audioManager = new AudioManager();
