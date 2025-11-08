'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { DataGenerator } from '@/lib/dataGenerator';

interface UseDataStreamOptions {
  initialCount?: number;
  updateInterval?: number;
  maxDataPoints?: number;
  autoStart?: boolean;
}

export function useDataStream(options: UseDataStreamOptions = {}) {
  const {
    initialCount = 10000,
    updateInterval = 100,
    maxDataPoints = 50000,
    autoStart = true,
  } = options;

  const [data, setData] = useState<DataPoint[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const generatorRef = useRef<DataGenerator>(new DataGenerator());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize data
  useEffect(() => {
    const initialData = generatorRef.current.generateInitialDataset(initialCount);
    setData(initialData);
  }, [initialCount]);

  // Start streaming
  const startStreaming = useCallback(() => {
    if (intervalRef.current) return;

    setIsStreaming(true);
    intervalRef.current = setInterval(() => {
      setData((prevData) => {
        const lastValue = prevData[prevData.length - 1]?.value;
        const newPoint = generatorRef.current.generateDataPoint(lastValue);
        
        // Maintain sliding window
        const newData = [...prevData, newPoint];
        if (newData.length > maxDataPoints) {
          return newData.slice(newData.length - maxDataPoints);
        }
        return newData;
      });
    }, updateInterval);
  }, [updateInterval, maxDataPoints]);

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Toggle streaming
  const toggleStreaming = useCallback(() => {
    if (isStreaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
  }, [isStreaming, startStreaming, stopStreaming]);

  // Reset data
  const resetData = useCallback((count?: number) => {
    stopStreaming();
    const newData = generatorRef.current.generateInitialDataset(count || initialCount);
    setData(newData);
  }, [initialCount, stopStreaming]);

  // Add bulk data for stress testing
  const addBulkData = useCallback((count: number) => {
    setData((prevData) => {
      const lastValue = prevData[prevData.length - 1]?.value;
      const newBatch = generatorRef.current.generateBatch(count, lastValue);
      const combined = [...prevData, ...newBatch];
      
      if (combined.length > maxDataPoints) {
        return combined.slice(combined.length - maxDataPoints);
      }
      return combined;
    });
  }, [maxDataPoints]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && data.length > 0) {
      startStreaming();
    }

    return () => {
      stopStreaming();
    };
  }, [autoStart, data.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    isStreaming,
    startStreaming,
    stopStreaming,
    toggleStreaming,
    resetData,
    addBulkData,
    dataCount: data.length,
  };
}
