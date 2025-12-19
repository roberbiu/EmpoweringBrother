/**
 * Game Loop Hook
 * Provides smooth animation frame updates
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopOptions {
  onUpdate: (deltaTime: number) => void;
  enabled?: boolean;
}

export function useGameLoop({
  onUpdate,
  enabled = true,
}: UseGameLoopOptions): void {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const updateRef = useRef(onUpdate);

  // Keep callback ref updated
  useEffect(() => {
    updateRef.current = onUpdate;
  }, [onUpdate]);

  const loop = useCallback(
    (currentTime: number) => {
      if (!enabled) return;

      // Calculate delta time in seconds
      const deltaTime = lastTimeRef.current
        ? (currentTime - lastTimeRef.current) / 1000
        : 0;

      lastTimeRef.current = currentTime;

      // Cap delta time to prevent large jumps
      const cappedDelta = Math.min(deltaTime, 1 / 30);

      // Call update function
      updateRef.current(cappedDelta);

      // Schedule next frame
      frameRef.current = requestAnimationFrame(loop);
    },
    [enabled]
  );

  useEffect(() => {
    if (enabled) {
      lastTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, loop]);
}

/**
 * Timer Hook
 * Provides a simple interval-based timer
 */
interface UseTimerOptions {
  onTick: () => void;
  interval?: number;
  enabled?: boolean;
}

export function useTimer({
  onTick,
  interval = 100,
  enabled = true,
}: UseTimerOptions): void {
  const tickRef = useRef(onTick);

  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      tickRef.current();
    }, interval);

    return () => clearInterval(id);
  }, [interval, enabled]);
}

/**
 * Countdown Hook
 * Provides countdown functionality
 */
interface UseCountdownOptions {
  from: number;
  onComplete: () => void;
  onTick?: (remaining: number) => void;
}

export function useCountdown({
  from,
  onComplete,
  onTick,
}: UseCountdownOptions): { remaining: number; start: () => void; reset: () => void } {
  const remainingRef = useRef(from);
  const intervalRef = useRef<number>();
  const completeRef = useRef(onComplete);
  const tickRef = useRef(onTick);

  useEffect(() => {
    completeRef.current = onComplete;
    tickRef.current = onTick;
  }, [onComplete, onTick]);

  const start = useCallback(() => {
    remainingRef.current = from;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      remainingRef.current -= 1;
      tickRef.current?.(remainingRef.current);

      if (remainingRef.current <= 0) {
        clearInterval(intervalRef.current);
        completeRef.current();
      }
    }, 1000);
  }, [from]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    remainingRef.current = from;
  }, [from]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { remaining: remainingRef.current, start, reset };
}
