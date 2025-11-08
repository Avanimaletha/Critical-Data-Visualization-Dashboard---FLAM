'use client';

import React, { useState } from 'react';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Heatmap } from '@/components/charts/Heatmap';
import { FilterPanel } from '@/components/controls/FilterPanel';
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector';
import { DataTable } from '@/components/ui/DataTable';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';
import { useData } from '@/components/providers/DataProvider';
import { TimeRange } from '@/lib/types';

export default function DashboardPage() {
  const {
    data,
    filteredData,
    isStreaming,
    toggleStreaming,
    resetData,
    addBulkData,
    dataCount,
    performanceMetrics,
  } = useData();

  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'scatter' | 'heatmap'>('line');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['A', 'B', 'C', 'D', 'E']);
  const [timeRange, setTimeRange] = useState<TimeRange>({ start: 0, end: Date.now() });
  const [valueRange, setValueRange] = useState<[number, number]>([0, 1000]);

  const categories = ['A', 'B', 'C', 'D', 'E'];

  const handleStressTest = () => {
    addBulkData(5000);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Performance Dashboard</h1>
        <div style={styles.headerActions}>
          <button
            onClick={toggleStreaming}
            style={{
              ...styles.button,
              backgroundColor: isStreaming ? '#F44336' : '#4CAF50',
            }}
          >
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </button>
          <button onClick={() => resetData(10000)} style={styles.button}>
            Reset Data
          </button>
          <button onClick={handleStressTest} style={styles.button}>
            Stress Test (+5k)
          </button>
          <span style={styles.dataCount}>
            {dataCount.toLocaleString()} points
          </span>
        </div>
      </header>

      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <PerformanceMonitor metrics={performanceMetrics} />

          <div style={styles.chartSelector}>
            <h4 style={styles.sectionTitle}>Chart Type</h4>
            <div style={styles.chartButtons}>
              {(['line', 'bar', 'scatter', 'heatmap'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedChart(type)}
                  style={{
                    ...styles.chartButton,
                    ...(selectedChart === type ? styles.chartButtonActive : {}),
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <TimeRangeSelector
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          <FilterPanel
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            valueRange={valueRange}
            onValueRangeChange={setValueRange}
          />
        </aside>

        <main style={styles.content}>
          <div style={styles.chartContainer}>
            {selectedChart === 'line' && (
              <LineChart data={filteredData} width={1000} height={500} />
            )}
            {selectedChart === 'bar' && (
              <BarChart data={filteredData} width={1000} height={500} />
            )}
            {selectedChart === 'scatter' && (
              <ScatterPlot data={filteredData} width={1000} height={500} />
            )}
            {selectedChart === 'heatmap' && (
              <Heatmap width={1000} height={500} rows={20} cols={50} />
            )}
          </div>

          <div style={styles.tableContainer}>
            <h3 style={styles.tableTitle}>Data Table (Virtualized)</h3>
            <DataTable data={filteredData} height={400} />
          </div>
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
  },
  header: {
    padding: '20px 30px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  dataCount: {
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  mainContent: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    flexWrap: 'wrap',
  },
  sidebar: {
    flex: '0 0 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  content: {
    flex: 1,
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  chartSelector: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  chartButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  chartButton: {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  chartButtonActive: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#2196F3',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
};
