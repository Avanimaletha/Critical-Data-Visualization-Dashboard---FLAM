'use client';

import React, { useMemo } from 'react';
import { DataPoint, ChartDimensions } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawGrid, drawAxes, drawLine, scaleValue, drawText } from '@/lib/canvasUtils';

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
}

const DEFAULT_DIMENSIONS: ChartDimensions = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 20, bottom: 40, left: 50 },
};

export const LineChart = React.memo(function LineChart({
  data,
  width = 800,
  height = 400,
  color = '#2196F3',
  showGrid = true,
}: LineChartProps) {
  const dimensions: ChartDimensions = useMemo(
    () => ({
      ...DEFAULT_DIMENSIONS,
      width,
      height,
    }),
    [width, height]
  );

  // Transform data to points
  const points = useMemo(() => {
    if (data.length === 0) return [];

    const { width: chartWidth, height: chartHeight, margin } = dimensions;
    const dataWidth = chartWidth - margin.left - margin.right;
    const dataHeight = chartHeight - margin.top - margin.bottom;

    const timestamps = data.map((d) => d.timestamp);
    const values = data.map((d) => d.value);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    return data.map((point) => ({
      x: scaleValue(point.timestamp, minTime, maxTime, margin.left, margin.left + dataWidth),
      y: scaleValue(point.value, minValue, maxValue, margin.top + dataHeight, margin.top),
    }));
  }, [data, dimensions]);

  // Render function
  const renderChart = useMemo(
    () => (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      // Draw background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (showGrid) {
        drawGrid(ctx, dimensions);
      }

      drawAxes(ctx, dimensions);

      if (points.length > 0) {
        drawLine(ctx, points, color, 2);
      }

      // Draw labels
      const { margin } = dimensions;
      drawText(ctx, `${data.length} data points`, margin.left, canvasHeight - 10, {
        font: '12px Arial',
        color: '#666',
      });

      if (data.length > 0) {
        const lastValue = data[data.length - 1].value.toFixed(2);
        drawText(ctx, `Latest: ${lastValue}`, canvasWidth - margin.right - 100, margin.top + 15, {
          font: '14px Arial',
          color: '#333',
        });
      }
    },
    [points, dimensions, color, data, showGrid]
  );

  const canvasRef = useChartRenderer(renderChart, null, { width, height });

  return (
    <div className="line-chart-container" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </div>
  );
});
