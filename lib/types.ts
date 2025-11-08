// Core data types
export interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
  metadata?: Record<string, any>;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'heatmap';
  dataKey: string;
  color: string;
  visible: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  dataProcessingTime: number;
  lastUpdate: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface FilterConfig {
  categories: string[];
  valueRange: [number, number];
  timeRange: TimeRange;
}

export interface AggregationConfig {
  period: '1min' | '5min' | '1hour';
  method: 'avg' | 'sum' | 'min' | 'max';
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface CanvasRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  devicePixelRatio: number;
}

export interface VirtualizedItem {
  index: number;
  offset: number;
  size: number;
}

export type DataStreamCallback = (data: DataPoint[]) => void;
