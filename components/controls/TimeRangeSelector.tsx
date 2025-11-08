'use client';

import React, { useState } from 'react';
import { TimeRange } from '@/lib/types';

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector = React.memo(function TimeRangeSelector({
  timeRange,
  onTimeRangeChange,
}: TimeRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('all');

  const presets = [
    { label: 'Last 1 min', value: '1min', duration: 60 * 1000 },
    { label: 'Last 5 min', value: '5min', duration: 5 * 60 * 1000 },
    { label: 'Last 15 min', value: '15min', duration: 15 * 60 * 1000 },
    { label: 'Last 1 hour', value: '1hour', duration: 60 * 60 * 1000 },
    { label: 'All', value: 'all', duration: 0 },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.value);

    if (preset.value === 'all') {
      onTimeRangeChange({ start: 0, end: Date.now() });
    } else {
      const now = Date.now();
      onTimeRangeChange({
        start: now - preset.duration,
        end: now,
      });
    }
  };

  return (
    <div className="time-range-selector" style={styles.container}>
      <h4 style={styles.title}>Time Range</h4>
      <div style={styles.buttonGroup}>
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset)}
            style={{
              ...styles.button,
              ...(selectedPreset === preset.value ? styles.buttonActive : {}),
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonActive: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#2196F3',
  },
};
