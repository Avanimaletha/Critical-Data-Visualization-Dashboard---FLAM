import { CanvasRenderContext, ChartDimensions } from './types';

/**
 * Initialize canvas with proper DPI scaling
 */
export function initCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderContext {
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d', { alpha: false })!;
  ctx.scale(dpr, dpr);

  return {
    ctx,
    width,
    height,
    devicePixelRatio: dpr,
  };
}

/**
 * Clear canvas efficiently
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Draw grid on canvas
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  dimensions: ChartDimensions,
  gridColor: string = '#e0e0e0'
): void {
  const { width, height, margin } = dimensions;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);

  // Vertical grid lines
  for (let i = 0; i <= 10; i++) {
    const x = margin.left + (chartWidth / 10) * i;
    ctx.beginPath();
    ctx.moveTo(x, margin.top);
    ctx.lineTo(x, height - margin.bottom);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(margin.left, y);
    ctx.lineTo(width - margin.right, y);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

/**
 * Draw axes on canvas
 */
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  dimensions: ChartDimensions,
  axisColor: string = '#333'
): void {
  const { width, height, margin } = dimensions;

  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 2;

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, height - margin.bottom);
  ctx.stroke();

  // X-axis
  ctx.beginPath();
  ctx.moveTo(margin.left, height - margin.bottom);
  ctx.lineTo(width - margin.right, height - margin.bottom);
  ctx.stroke();
}

/**
 * Draw line path efficiently
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  color: string = '#2196F3',
  lineWidth: number = 2
): void {
  if (points.length < 2) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();
}

/**
 * Draw optimized scatter points
 */
export function drawScatterPoints(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  color: string = '#FF5722',
  radius: number = 3
): void {
  ctx.fillStyle = color;

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Draw bar chart bars
 */
export function drawBars(
  ctx: CanvasRenderingContext2D,
  bars: { x: number; y: number; width: number; height: number }[],
  color: string = '#4CAF50'
): void {
  ctx.fillStyle = color;

  bars.forEach((bar) => {
    ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
  });
}

/**
 * Draw heatmap cells
 */
export function drawHeatmap(
  ctx: CanvasRenderingContext2D,
  data: number[][],
  dimensions: ChartDimensions,
  colorScale: (value: number) => string
): void {
  const { width, height, margin } = dimensions;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const cellWidth = chartWidth / data[0].length;
  const cellHeight = chartHeight / data.length;

  data.forEach((row, i) => {
    row.forEach((value, j) => {
      ctx.fillStyle = colorScale(value);
      ctx.fillRect(
        margin.left + j * cellWidth,
        margin.top + i * cellHeight,
        cellWidth,
        cellHeight
      );
    });
  });
}

/**
 * Create color scale for heatmap
 */
export function createColorScale(
  min: number,
  max: number
): (value: number) => string {
  return (value: number) => {
    const normalized = (value - min) / (max - min);
    const hue = (1 - normalized) * 240; // Blue to red
    return `hsl(${hue}, 70%, 50%)`;
  };
}

/**
 * Draw text efficiently
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    font?: string;
    color?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
  } = {}
): void {
  ctx.font = options.font || '12px Arial';
  ctx.fillStyle = options.color || '#333';
  ctx.textAlign = options.align || 'left';
  ctx.textBaseline = options.baseline || 'alphabetic';
  ctx.fillText(text, x, y);
}

/**
 * Convert data values to canvas coordinates
 */
export function scaleValue(
  value: number,
  dataMin: number,
  dataMax: number,
  pixelMin: number,
  pixelMax: number
): number {
  return (
    pixelMin +
    ((value - dataMin) / (dataMax - dataMin)) * (pixelMax - pixelMin)
  );
}

/**
 * Optimize rendering by skipping invisible points
 */
export function cullPoints<T extends { x: number; y: number }>(
  points: T[],
  viewportX: number,
  viewportWidth: number
): T[] {
  return points.filter(
    (p) => p.x >= viewportX && p.x <= viewportX + viewportWidth
  );
}
