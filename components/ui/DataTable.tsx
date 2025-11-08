'use client';

import React, { useMemo } from 'react';
import { DataPoint } from '@/lib/types';
import { useVirtualization } from '@/hooks/useVirtualization';

interface DataTableProps {
  data: DataPoint[];
  height?: number;
}

const ROW_HEIGHT = 40;

export const DataTable = React.memo(function DataTable({
  data,
  height = 400,
}: DataTableProps) {
  const { virtualItems, totalHeight, handleScroll } = useVirtualization({
    itemCount: data.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: height,
    overscan: 5,
  });

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="data-table" style={styles.container}>
      <div style={styles.header}>
        <div style={{ ...styles.cell, flex: 1 }}>Timestamp</div>
        <div style={{ ...styles.cell, flex: 1 }}>Value</div>
        <div style={{ ...styles.cell, flex: 1 }}>Category</div>
        <div style={{ ...styles.cell, flex: 1 }}>Volume</div>
      </div>

      <div
        style={{ ...styles.body, height }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {virtualItems.map((virtualItem) => {
            const item = data[virtualItem.index];
            if (!item) return null;

            return (
              <div
                key={virtualItem.index}
                style={{
                  ...styles.row,
                  position: 'absolute',
                  top: virtualItem.offset,
                  height: ROW_HEIGHT,
                  width: '100%',
                }}
              >
                <div style={{ ...styles.cell, flex: 1 }}>
                  {formatTimestamp(item.timestamp)}
                </div>
                <div style={{ ...styles.cell, flex: 1, fontWeight: 'bold' }}>
                  {formatValue(item.value)}
                </div>
                <div style={{ ...styles.cell, flex: 1 }}>
                  {item.category}
                </div>
                <div style={{ ...styles.cell, flex: 1 }}>
                  {item.metadata?.volume || 'N/A'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.footer}>
        Total rows: {data.length.toLocaleString()}
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  body: {
    overflow: 'auto',
    position: 'relative',
  },
  row: {
    display: 'flex',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff',
  },
  cell: {
    padding: '12px',
    fontSize: '13px',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  footer: {
    padding: '10px 12px',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
    fontSize: '13px',
    color: '#666',
    fontWeight: '600',
  },
};
