'use client';

import React from 'react';
import { PerformanceMetrics } from '@/lib/types';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
}

export const PerformanceMonitor = React.memo(function PerformanceMonitor({
  metrics,
}: PerformanceMonitorProps) {
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#4CAF50';
    if (fps >= 30) return '#FF9800';
    return '#F44336';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 100) return '#4CAF50';
    if (memory < 200) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="performance-monitor" style={styles.container}>
      <h3 style={styles.title}>Performance Metrics</h3>

      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>FPS</div>
          <div
            style={{
              ...styles.metricValue,
              color: getFPSColor(metrics.fps),
            }}
          >
            {metrics.fps}
          </div>
          <div style={styles.metricSubtext}>Target: 60</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Memory</div>
          <div
            style={{
              ...styles.metricValue,
              color: getMemoryColor(metrics.memoryUsage),
            }}
          >
            {metrics.memoryUsage}
          </div>
          <div style={styles.metricSubtext}>MB</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Render Time</div>
          <div style={styles.metricValue}>
            {metrics.renderTime.toFixed(2)}
          </div>
          <div style={styles.metricSubtext}>ms</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Data Processing</div>
          <div style={styles.metricValue}>
            {metrics.dataProcessingTime.toFixed(2)}
          </div>
          <div style={styles.metricSubtext}>ms</div>
        </div>
      </div>

      <div style={styles.statusBar}>
        <div
          style={{
            ...styles.statusIndicator,
            backgroundColor: metrics.fps >= 55 ? '#4CAF50' : '#F44336',
          }}
        />
        <span style={styles.statusText}>
          {metrics.fps >= 55 ? 'Optimal Performance' : 'Performance Degraded'}
        </span>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '15px',
  },
  metricCard: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  metricSubtext: {
    fontSize: '11px',
    color: '#888',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '8px',
  },
  statusText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
  },
};
