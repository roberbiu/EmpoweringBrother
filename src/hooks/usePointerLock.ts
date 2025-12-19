/**
 * Pointer Lock API Hook
 * Handles mouse capture for FPS-style controls
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePointerLockReturn {
  isLocked: boolean;
  requestLock: () => void;
  exitLock: () => void;
  error: string | null;
}

export function usePointerLock(
  elementRef: React.RefObject<HTMLElement>,
  onMouseMove?: (deltaX: number, deltaY: number) => void
): UsePointerLockReturn {
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mouseMoveRef = useRef(onMouseMove);

  // Keep callback ref updated
  useEffect(() => {
    mouseMoveRef.current = onMouseMove;
  }, [onMouseMove]);

  // Request pointer lock
  const requestLock = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    setError(null);

    try {
      // Request pointer lock with raw mouse movement (bypasses OS acceleration)
      const promise = element.requestPointerLock({
        unadjustedMovement: true,
      } as PointerLockOptions);

      // Handle promise-based API (newer browsers)
      if (promise instanceof Promise) {
        promise.catch(() => {
          // Fallback to standard pointer lock if unadjustedMovement fails
          console.warn('Raw mouse input not available, using standard pointer lock');
          element.requestPointerLock();
        });
      }
    } catch {
      // Fallback for older browsers
      element.requestPointerLock();
    }
  }, [elementRef]);

  // Exit pointer lock
  const exitLock = useCallback(() => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, []);

  // Handle pointer lock change events
  useEffect(() => {
    const handleLockChange = () => {
      const locked = document.pointerLockElement === elementRef.current;
      setIsLocked(locked);
      if (!locked) {
        setError(null);
      }
    };

    const handleLockError = () => {
      setIsLocked(false);
      setError('Pointer lock failed. Please click to try again.');
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('pointerlockerror', handleLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
      document.removeEventListener('pointerlockerror', handleLockError);
    };
  }, [elementRef]);

  // Handle mouse movement while locked
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === elementRef.current && mouseMoveRef.current) {
        mouseMoveRef.current(event.movementX, event.movementY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [elementRef]);

  return {
    isLocked,
    requestLock,
    exitLock,
    error,
  };
}

// Extended type for pointer lock options
interface PointerLockOptions {
  unadjustedMovement?: boolean;
}

declare global {
  interface Element {
    requestPointerLock(options?: PointerLockOptions): Promise<void>;
  }
}
