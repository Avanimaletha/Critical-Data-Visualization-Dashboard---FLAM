'use client';

import React, { useState } from 'react';

interface FilterPanelProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  valueRange: [number, number];
  onValueRangeChange: (range: [number, number]) => void;
}

export const FilterPanel = React.memo(function FilterPanel({
  categories,
  selectedCategories,
  onCategoryChange,
  valueRange,
  onValueRangeChange,
}: FilterPanelProps) {
  const [minValue, setMinValue] = useState(valueRange[0]);
  const [maxValue, setMaxValue] = useState(valueRange[1]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newCategories);
  };

  const handleApplyValueRange = () => {
    onValueRangeChange([minValue, maxValue]);
  };

  return (
    <div className="filter-panel" style={styles.container}>
      <h3 style={styles.title}>Filters</h3>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Categories</h4>
        <div style={styles.categoryList}>
          {categories.map((category) => (
            <label key={category} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                style={styles.checkbox}
              />
              <span style={styles.categoryText}>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Value Range</h4>
        <div style={styles.rangeInputs}>
          <input
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
            placeholder="Min"
            style={styles.input}
          />
          <span style={styles.rangeSeparator}>to</span>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            placeholder="Max"
            style={styles.input}
          />
        </div>
        <button onClick={handleApplyValueRange} style={styles.button}>
          Apply Range
        </button>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  categoryText: {
    fontSize: '14px',
    color: '#333',
  },
  rangeInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  rangeSeparator: {
    fontSize: '14px',
    color: '#666',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
