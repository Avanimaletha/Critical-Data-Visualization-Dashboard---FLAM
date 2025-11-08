# Performance-Critical Data Visualization Dashboard

A high-performance real-time dashboard built with **Next.js 14+ App Router** and **TypeScript** that smoothly renders and updates 10,000+ data points at 60fps.

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=Performance+Dashboard)

## 🚀 Features

### Dashboard Capabilities
- ✅ **Multiple Chart Types**: Line chart, bar chart, scatter plot, heatmap
- ✅ **Real-time Updates**: New data every 100ms (simulated)
- ✅ **Interactive Controls**: Zoom, pan, data filtering, time range selection
- ✅ **Data Aggregation**: Group by time periods (1min, 5min, 1hour)
- ✅ **Virtual Scrolling**: Efficiently handles large datasets in data tables
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile

### Performance Achievements
- 🎯 **60 FPS** during real-time updates with 10k+ points
- 🎯 **< 100ms** response time for all interactions
- 🎯 **Memory efficient** - stable memory usage over extended periods
- 🎯 **Smooth animations** - No UI freezing or janking

## 📦 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Rendering**: Canvas + SVG hybrid approach
- **State Management**: React hooks + Context API
- **Styling**: CSS-in-JS (inline styles)
- **Performance**: Custom optimizations (no external chart libraries)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd performance-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000` and automatically redirect to `/dashboard`.

## 🎯 Performance Testing

### Running Performance Tests

1. **FPS Test**: 
   - Start the data stream
   - Monitor the FPS counter in the Performance Metrics panel
   - Target: Steady 60 FPS with 10k points

2. **Stress Test**:
   - Click "Stress Test (+5k)" button multiple times
   - Watch performance metrics as data grows to 50k+ points
   - Monitor memory usage stability

3. **Real-time Updates**:
   - Enable streaming
   - Switch between chart types
   - Verify smooth animations at 60 FPS

4. **Interaction Response**:
   - Filter data by categories
   - Change time ranges
   - Scroll through virtualized table
   - Target: < 100ms response time

### Performance Monitoring Tools

The dashboard includes built-in performance monitoring:
- **FPS Counter**: Real-time frame rate
- **Memory Usage**: Current heap size (if available)
- **Render Time**: Last frame render duration
- **Data Processing Time**: Data transformation time

### External Tools

Use browser DevTools for deeper analysis:

```bash
# Chrome DevTools Performance Profiler
1. Open DevTools (F12)
2. Go to Performance tab
3. Record while interacting with dashboard
4. Analyze frame timeline and memory usage

# React DevTools Profiler
1. Install React DevTools extension
2. Open Profiler tab
3. Record component render times
4. Identify unnecessary re-renders
```

## 🏗️ Architecture Overview

### Next.js App Router Structure

```
app/
├── dashboard/
│   ├── page.tsx           # Client component - main dashboard UI
│   └── layout.tsx         # Data provider wrapper
├── api/
│   └── data/
│       └── route.ts       # Server-side data generation API
├── globals.css
├── layout.tsx             # Root layout
└── page.tsx               # Home page (redirects to dashboard)
```

### Component Organization

```
components/
├── charts/                # Canvas-based chart components
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── ScatterPlot.tsx
│   └── Heatmap.tsx
├── controls/              # Interactive control panels
│   ├── FilterPanel.tsx
│   └── TimeRangeSelector.tsx
├── ui/                    # UI components
│   ├── DataTable.tsx
│   └── PerformanceMonitor.tsx
└── providers/
    └── DataProvider.tsx   # React Context for data management
```

### Custom Hooks

```
hooks/
├── useDataStream.ts       # Real-time data streaming
├── useChartRenderer.ts    # Canvas rendering optimization
├── usePerformanceMonitor.ts  # FPS and memory tracking
└── useVirtualization.ts   # Virtual scrolling for tables
```

### Utility Libraries

```
lib/
├── types.ts               # TypeScript definitions
├── dataGenerator.ts       # Realistic data generation
├── performanceUtils.ts    # Performance helpers
└── canvasUtils.ts         # Canvas drawing utilities
```

## 🎨 Browser Compatibility

### Tested Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Browser Features
- Canvas API
- RequestAnimationFrame
- Performance API
- ES2020 features

### Polyfills
No polyfills required for modern browsers (2021+).

## 🚀 Next.js Specific Optimizations

### App Router Features Used

1. **Server Components**
   - Root layout for metadata
   - Initial data generation (can be SSR)

2. **Client Components**
   - Interactive charts (`'use client'`)
   - Real-time data streaming
   - Performance monitoring

3. **Route Handlers**
   - `/api/data` endpoint for data generation
   - Supports GET and POST methods

4. **Streaming & Suspense**
   - Ready for progressive loading
   - Can add loading.tsx for better UX

5. **Optimizations**
   - SWC minification enabled
   - Automatic code splitting
   - Image optimization ready

### Bundle Optimizations

- **Tree Shaking**: Only used code is included
- **Code Splitting**: Route-based automatic splitting
- **Minification**: Production builds are minified
- **Compression**: Gzip/Brotli in production

## 📊 Feature Overview

### 1. Real-Time Data Streaming
- Generates new data points every 100ms
- Maintains sliding window (max 50k points)
- Memory-efficient data management

### 2. Interactive Charts
- **Line Chart**: Continuous time-series visualization
- **Bar Chart**: Aggregated data by time periods
- **Scatter Plot**: Individual data point distribution
- **Heatmap**: 2D data density visualization

### 3. Performance Monitoring
- Live FPS counter (target: 60 FPS)
- Memory usage tracking
- Render time measurement
- Visual performance indicators

### 4. Data Controls
- **Filtering**: By category and value range
- **Time Range**: Last 1min, 5min, 15min, 1hour, or all
- **Aggregation**: 1min, 5min, 1hour periods
- **Stress Testing**: Add bulk data for testing

### 5. Virtualized Data Table
- Renders only visible rows
- Smooth scrolling with 10k+ rows
- Efficient memory usage

## 🔧 Development

### Project Structure Best Practices

1. **Separation of Concerns**
   - Logic in custom hooks
   - Utilities in lib/
   - Types centralized in types.ts

2. **Performance First**
   - useMemo for expensive calculations
   - useCallback for event handlers
   - React.memo for pure components

3. **TypeScript Strict Mode**
   - Full type safety
   - No implicit any
   - Strict null checks

### Adding New Chart Types

```typescript
// 1. Create component in components/charts/
'use client';
import React, { useMemo } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';

export const NewChart = React.memo(function NewChart({ data }) {
  const renderFn = useMemo(
    () => (ctx, width, height) => {
      // Your canvas rendering logic
    },
    [data]
  );
  
  const canvasRef = useChartRenderer(renderFn, null, { width, height });
  return <canvas ref={canvasRef} />;
});

// 2. Add to dashboard page
import { NewChart } from '@/components/charts/NewChart';
```

## 📝 Scripts

```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint"          // ESLint checking
}
```

## 🐛 Known Limitations

1. **Memory API**: Chrome-only (gracefully degrades)
2. **50k Data Points**: Performance may degrade beyond this
3. **Mobile Performance**: Limited by device capabilities
4. **Browser Zoom**: Canvas may appear blurry at high zoom levels

## 🎓 Learning Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Performance Best Practices](https://web.dev/performance/)

## 📄 License

MIT License - feel free to use for learning and portfolio purposes.

## 👤 Author

Built as a performance-critical dashboard assignment demonstrating:
- Next.js 14+ App Router mastery
- React performance optimization
- Canvas rendering techniques
- TypeScript best practices
- Real-time data visualization

---

**For detailed performance analysis and optimization techniques, see [PERFORMANCE.md](./PERFORMANCE.md)**
#   C r i t i c a l - D a t a - V i s u a l i z a t i o n - D a s h b o a r d - - - F L A M  
 