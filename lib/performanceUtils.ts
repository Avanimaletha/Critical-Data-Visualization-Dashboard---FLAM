import { PerformanceMetrics } from './types';

/**
 * FPS Monitor using requestAnimationFrame
 */
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private rafId: number | null = null;

  start(callback: (fps: number) => void): void {
    const measure = (currentTime: number) => {
      const delta = currentTime - this.lastTime;
      this.lastTime = currentTime;

      if (delta > 0) {
        const fps = 1000 / delta;
        this.frames.push(fps);
        
        // Keep last 60 frames for average
        if (this.frames.length > 60) {
          this.frames.shift();
        }

        const avgFps = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
        callback(Math.round(avgFps));
      }

      this.rafId = requestAnimationFrame(measure);
    };

    this.rafId = requestAnimationFrame(measure);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
  }
}

/**
 * Memory usage monitor
 */
export function getMemoryUsage(): number {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
  }
  return 0;
}

/**
 * Performance marker for timing operations
 */
export class PerformanceMarker {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    if (!start) return 0;

    const end = endMark ? this.marks.get(endMark) : performance.now();
    if (!end) return 0;

    return end - start;
  }

  clear(): void {
    this.marks.clear();
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request Animation Frame with fallback
 */
export const requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * Cancel Animation Frame with fallback
 */
export const cancelAnimFrame = (() => {
  return (
    window.cancelAnimationFrame ||
    function (id: number) {
      clearTimeout(id);
    }
  );
})();

/**
 * Create a performance observer for long tasks
 */
export function observeLongTasks(callback: (duration: number) => void): PerformanceObserver | null {
  if (typeof PerformanceObserver === 'undefined') return null;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          callback(entry.duration);
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'longtask'] });
    return observer;
  } catch (e) {
    console.warn('PerformanceObserver not supported');
    return null;
  }
}

/**
 * Batch updates to avoid layout thrashing
 */
export function batchUpdates(updates: (() => void)[]): void {
  requestAnimFrame(() => {
    updates.forEach((update) => update());
  });
}
