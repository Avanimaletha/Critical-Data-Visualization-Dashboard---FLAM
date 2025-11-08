'use client';

import { useEffect, useRef, useCallback } from 'react';
import { initCanvas, clearCanvas } from '@/lib/canvasUtils';
import { requestAnimFrame, cancelAnimFrame } from '@/lib/performanceUtils';

interface UseChartRendererOptions {
  width: number;
  height: number;
  autoResize?: boolean;
}

export function useChartRenderer<T>(
  renderFn: (ctx: CanvasRenderingContext2D, width: number, height: number, data: T) => void,
  data: T,
  options: UseChartRendererOptions
) {
  const { width, height, autoResize = true } = options;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const renderContextRef = useRef<{
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
  } | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderContext = initCanvas(canvasRef.current, width, height);
    renderContextRef.current = {
      ctx: renderContext.ctx,
      width: renderContext.width,
      height: renderContext.height,
    };
  }, [width, height]);

  // Render function
  const render = useCallback(() => {
    if (!renderContextRef.current) return;

    const { ctx, width: canvasWidth, height: canvasHeight } = renderContextRef.current;
    
    clearCanvas(ctx, width, height);
    renderFn(ctx, width, height, data);
  }, [renderFn, data, width, height]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      render();
      rafIdRef.current = requestAnimFrame(animate);
    };

    rafIdRef.current = requestAnimFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [render]);

  // Handle resize
  useEffect(() => {
    if (!autoResize || !canvasRef.current) return;

    const handleResize = () => {
      if (canvasRef.current && renderContextRef.current) {
        const renderContext = initCanvas(canvasRef.current, width, height);
        renderContextRef.current = {
          ctx: renderContext.ctx,
          width: renderContext.width,
          height: renderContext.height,
        };
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height, autoResize]);

  return canvasRef;
}
