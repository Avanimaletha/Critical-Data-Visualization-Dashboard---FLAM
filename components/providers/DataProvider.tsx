'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { DataPoint, TimeRange, FilterConfig } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface DataContextValue {
  data: DataPoint[];
  filteredData: DataPoint[];
  isStreaming: boolean;
  startStreaming: () => void;
  stopStreaming: () => void;
  toggleStreaming: () => void;
  resetData: (count?: number) => void;
  addBulkData: (count: number) => void;
  dataCount: number;
  performanceMetrics: ReturnType<typeof usePerformanceMonitor>['metrics'];
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
  initialData?: DataPoint[];
}

export function DataProvider({ children, initialData }: DataProviderProps) {
  const dataStream = useDataStream({
    initialCount: initialData?.length || 10000,
    updateInterval: 100,
    maxDataPoints: 50000,
    autoStart: false,
  });

  const { metrics } = usePerformanceMonitor();

  const value: DataContextValue = {
    data: dataStream.data,
    filteredData: dataStream.data,
    isStreaming: dataStream.isStreaming,
    startStreaming: dataStream.startStreaming,
    stopStreaming: dataStream.stopStreaming,
    toggleStreaming: dataStream.toggleStreaming,
    resetData: dataStream.resetData,
    addBulkData: dataStream.addBulkData,
    dataCount: dataStream.dataCount,
    performanceMetrics: metrics,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
