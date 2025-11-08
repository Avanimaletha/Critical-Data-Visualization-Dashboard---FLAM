import { DataPoint } from './types';

/**
 * Generate realistic time-series data for performance testing
 */
export class DataGenerator {
  private baseValue: number = 100;
  private volatility: number = 0.02;
  private trend: number = 0.001;
  private categories: string[] = ['A', 'B', 'C', 'D', 'E'];

  constructor(
    baseValue: number = 100,
    volatility: number = 0.02,
    trend: number = 0.001
  ) {
    this.baseValue = baseValue;
    this.volatility = volatility;
    this.trend = trend;
  }

  /**
   * Generate initial dataset
   */
  generateInitialDataset(count: number, startTime?: number): DataPoint[] {
    const now = startTime || Date.now();
    const data: DataPoint[] = [];
    let currentValue = this.baseValue;

    for (let i = 0; i < count; i++) {
      const timestamp = now - (count - i) * 100;
      const category = this.categories[Math.floor(Math.random() * this.categories.length)];
      
      // Random walk with trend
      const change = (Math.random() - 0.5) * 2 * this.volatility * currentValue;
      currentValue += change + this.trend * currentValue;
      
      data.push({
        timestamp,
        value: currentValue,
        category,
        metadata: {
          volume: Math.floor(Math.random() * 1000),
          signal: Math.random() > 0.5 ? 'buy' : 'sell',
        },
      });
    }

    return data;
  }

  /**
   * Generate single data point (for real-time updates)
   */
  generateDataPoint(previousValue?: number, timestamp?: number): DataPoint {
    const now = timestamp || Date.now();
    const category = this.categories[Math.floor(Math.random() * this.categories.length)];
    const baseValue = previousValue || this.baseValue;
    
    const change = (Math.random() - 0.5) * 2 * this.volatility * baseValue;
    const value = baseValue + change + this.trend * baseValue;

    return {
      timestamp: now,
      value,
      category,
      metadata: {
        volume: Math.floor(Math.random() * 1000),
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
      },
    };
  }

  /**
   * Generate batch of data points
   */
  generateBatch(count: number, lastValue?: number): DataPoint[] {
    const data: DataPoint[] = [];
    let currentValue = lastValue || this.baseValue;
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const point = this.generateDataPoint(currentValue, now + i * 100);
      data.push(point);
      currentValue = point.value;
    }

    return data;
  }

  /**
   * Generate heatmap data
   */
  generateHeatmapData(rows: number, cols: number): number[][] {
    const data: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.random() * 100);
      }
      data.push(row);
    }
    return data;
  }
}

/**
 * Aggregate data by time period
 */
export function aggregateData(
  data: DataPoint[],
  period: '1min' | '5min' | '1hour',
  method: 'avg' | 'sum' | 'min' | 'max' = 'avg'
): DataPoint[] {
  const periodMs = {
    '1min': 60 * 1000,
    '5min': 5 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
  }[period];

  const buckets = new Map<number, DataPoint[]>();

  // Group data into time buckets
  data.forEach((point) => {
    const bucketKey = Math.floor(point.timestamp / periodMs) * periodMs;
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, []);
    }
    buckets.get(bucketKey)!.push(point);
  });

  // Aggregate each bucket
  const aggregated: DataPoint[] = [];
  buckets.forEach((points, timestamp) => {
    const values = points.map((p) => p.value);
    let aggregatedValue: number;

    switch (method) {
      case 'sum':
        aggregatedValue = values.reduce((a, b) => a + b, 0);
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'avg':
      default:
        aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
    }

    aggregated.push({
      timestamp,
      value: aggregatedValue,
      category: points[0].category,
      metadata: { count: points.length },
    });
  });

  return aggregated.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Downsample data for efficient rendering
 */
export function downsampleData(
  data: DataPoint[],
  maxPoints: number
): DataPoint[] {
  if (data.length <= maxPoints) return data;

  const factor = Math.ceil(data.length / maxPoints);
  const downsampled: DataPoint[] = [];

  for (let i = 0; i < data.length; i += factor) {
    const chunk = data.slice(i, i + factor);
    const avgValue = chunk.reduce((sum, p) => sum + p.value, 0) / chunk.length;
    
    downsampled.push({
      timestamp: chunk[0].timestamp,
      value: avgValue,
      category: chunk[0].category,
      metadata: { original: chunk.length },
    });
  }

  return downsampled;
}
