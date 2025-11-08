'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PerformanceMetrics } from '@/lib/types';
import { FPSMonitor, getMemoryUsage } from '@/lib/performanceUtils';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0,
    lastUpdate: Date.now(),
  });

  const fpsMonitorRef = useRef<FPSMonitor | null>(null);
  const renderStartRef = useRef<number>(0);

  // Initialize FPS monitor
  useEffect(() => {
    const fpsMonitor = new FPSMonitor();
    fpsMonitorRef.current = fpsMonitor;

    fpsMonitor.start((fps) => {
      setMetrics((prev) => ({
        ...prev,
        fps,
        lastUpdate: Date.now(),
      }));
    });

    return () => {
      fpsMonitor.stop();
    };
  }, []);

  // Update memory usage periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const memoryUsage = getMemoryUsage();
      setMetrics((prev) => ({
        ...prev,
        memoryUsage,
        lastUpdate: Date.now(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Mark render start
  const markRenderStart = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // Mark render end
  const markRenderEnd = useCallback(() => {
    if (renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics((prev) => ({
        ...prev,
        renderTime,
        lastUpdate: Date.now(),
      }));
      renderStartRef.current = 0;
    }
  }, []);

  // Mark data processing time
  const markDataProcessing = useCallback((time: number) => {
    setMetrics((prev) => ({
      ...prev,
      dataProcessingTime: time,
      lastUpdate: Date.now(),
    }));
  }, []);

  return {
    metrics,
    markRenderStart,
    markRenderEnd,
    markDataProcessing,
  };
}
