'use client';

import React, { useMemo } from 'react';
import { ChartDimensions } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawHeatmap, createColorScale, drawText } from '@/lib/canvasUtils';
import { DataGenerator } from '@/lib/dataGenerator';

interface HeatmapProps {
  width?: number;
  height?: number;
  rows?: number;
  cols?: number;
}

const DEFAULT_DIMENSIONS: ChartDimensions = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 80, bottom: 20, left: 50 },
};

export const Heatmap = React.memo(function Heatmap({
  width = 800,
  height = 400,
  rows = 20,
  cols = 50,
}: HeatmapProps) {
  const dimensions: ChartDimensions = useMemo(
    () => ({
      ...DEFAULT_DIMENSIONS,
      width,
      height,
    }),
    [width, height]
  );

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const generator = new DataGenerator();
    return generator.generateHeatmapData(rows, cols);
  }, [rows, cols]);

  // Get min/max for color scale
  const { min, max } = useMemo(() => {
    let minVal = Infinity;
    let maxVal = -Infinity;

    heatmapData.forEach((row) => {
      row.forEach((val) => {
        minVal = Math.min(minVal, val);
        maxVal = Math.max(maxVal, val);
      });
    });

    return { min: minVal, max: maxVal };
  }, [heatmapData]);

  const colorScale = useMemo(() => createColorScale(min, max), [min, max]);

  // Render function
  const renderChart = useMemo(
    () => (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      // Draw background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw heatmap
      drawHeatmap(ctx, heatmapData, dimensions, colorScale);

      // Draw color scale legend
      const { margin } = dimensions;
      const legendX = canvasWidth - margin.right + 10;
      const legendY = margin.top;
      const legendWidth = 20;
      const legendHeight = canvasHeight - margin.top - margin.bottom;

      // Draw gradient legend
      for (let i = 0; i < legendHeight; i++) {
        const value = max - (i / legendHeight) * (max - min);
        ctx.fillStyle = colorScale(value);
        ctx.fillRect(legendX, legendY + i, legendWidth, 1);
      }

      // Draw legend labels
      drawText(ctx, max.toFixed(1), legendX + legendWidth + 5, legendY + 5, {
        font: '10px Arial',
        color: '#333',
      });
      drawText(ctx, min.toFixed(1), legendX + legendWidth + 5, legendY + legendHeight, {
        font: '10px Arial',
        color: '#333',
      });

      // Draw title
      drawText(ctx, `${rows}x${cols} Heatmap`, margin.left, 15, {
        font: '14px Arial',
        color: '#333',
      });
    },
    [heatmapData, dimensions, colorScale, min, max, rows, cols]
  );

  const canvasRef = useChartRenderer(renderChart, null, { width, height });

  return (
    <div className="heatmap-container" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </div>
  );
});
