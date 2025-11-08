'use client';

import React, { useMemo } from 'react';
import { DataPoint, ChartDimensions } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawGrid, drawAxes, drawScatterPoints, scaleValue, drawText } from '@/lib/canvasUtils';

interface ScatterPlotProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  pointRadius?: number;
}

const DEFAULT_DIMENSIONS: ChartDimensions = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 20, bottom: 40, left: 50 },
};

export const ScatterPlot = React.memo(function ScatterPlot({
  data,
  width = 800,
  height = 400,
  color = '#FF5722',
  showGrid = true,
  pointRadius = 3,
}: ScatterPlotProps) {
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

    // Downsample for performance if needed
    const sampleRate = Math.ceil(data.length / 5000);
    const sampledData = data.filter((_, index) => index % sampleRate === 0);

    return sampledData.map((point) => ({
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
        drawScatterPoints(ctx, points, color, pointRadius);
      }

      // Draw labels
      const { margin } = dimensions;
      drawText(ctx, `${points.length} points displayed`, margin.left, canvasHeight - 10, {
        font: '12px Arial',
        color: '#666',
      });
    },
    [points, dimensions, color, pointRadius, showGrid]
  );

  const canvasRef = useChartRenderer(renderChart, null, { width, height });

  return (
    <div className="scatter-plot-container" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </div>
  );
});
