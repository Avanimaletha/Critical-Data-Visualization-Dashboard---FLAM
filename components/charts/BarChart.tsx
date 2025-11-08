'use client';

import React, { useMemo } from 'react';
import { DataPoint, ChartDimensions } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawGrid, drawAxes, drawBars, scaleValue, drawText } from '@/lib/canvasUtils';
import { aggregateData } from '@/lib/dataGenerator';

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  aggregationPeriod?: '1min' | '5min' | '1hour';
}

const DEFAULT_DIMENSIONS: ChartDimensions = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 20, bottom: 40, left: 50 },
};

export const BarChart = React.memo(function BarChart({
  data,
  width = 800,
  height = 400,
  color = '#4CAF50',
  showGrid = true,
  aggregationPeriod = '1min',
}: BarChartProps) {
  const dimensions: ChartDimensions = useMemo(
    () => ({
      ...DEFAULT_DIMENSIONS,
      width,
      height,
    }),
    [width, height]
  );

  // Aggregate data for bar chart
  const aggregatedData = useMemo(() => {
    if (data.length === 0) return [];
    return aggregateData(data, aggregationPeriod, 'avg');
  }, [data, aggregationPeriod]);

  // Transform data to bars
  const bars = useMemo(() => {
    if (aggregatedData.length === 0) return [];

    const { width: chartWidth, height: chartHeight, margin } = dimensions;
    const dataWidth = chartWidth - margin.left - margin.right;
    const dataHeight = chartHeight - margin.top - margin.bottom;

    const values = aggregatedData.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const barWidth = dataWidth / aggregatedData.length;
    const barSpacing = barWidth * 0.2;
    const actualBarWidth = barWidth - barSpacing;

    return aggregatedData.map((point, index) => {
      const x = margin.left + index * barWidth + barSpacing / 2;
      const barHeight = scaleValue(
        point.value,
        minValue,
        maxValue,
        0,
        dataHeight
      );
      const y = margin.top + dataHeight - barHeight;

      return {
        x,
        y,
        width: actualBarWidth,
        height: barHeight,
      };
    });
  }, [aggregatedData, dimensions]);

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

      if (bars.length > 0) {
        drawBars(ctx, bars, color);
      }

      // Draw labels
      const { margin } = dimensions;
      drawText(
        ctx,
        `${aggregatedData.length} bars (${aggregationPeriod} aggregation)`,
        margin.left,
        canvasHeight - 10,
        {
          font: '12px Arial',
          color: '#666',
        }
      );
    },
    [bars, dimensions, color, aggregatedData, aggregationPeriod, showGrid]
  );

  const canvasRef = useChartRenderer(renderChart, null, { width, height });

  return (
    <div className="bar-chart-container" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </div>
  );
});
