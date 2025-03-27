# SQL Query Editor

A web-based SQL query editor built with React and Vite, featuring real-time syntax highlighting, virtual scrolling for large datasets, and performance optimizations.

## Live Demo
Check out the live demo: [SQL Query Editor](https://sql-query-editor-fawn.vercel.app/)

## Overview

This application provides a modern interface for writing and executing SQL queries with features like syntax highlighting, query history, and efficient handling of large result sets.

## Tech Stack

### Framework
- React (Vite) - Chosen for its performance and modern development experience

### Major Packages
- `@uiw/react-codemirror` - For SQL editor with syntax highlighting
- `@codemirror/lang-sql` - SQL language support for CodeMirror
- `react-window` - For efficient rendering of large result sets
- `date-fns` - For date formatting in query history
- `react-csv` - For exporting query results

## Performance Metrics

### Page Load Time
The application's performance is monitored using the following metrics:
```javascript
useEffect(() => {
  const startTime = performance.now()
  
  const logTiming = () => {
    const loadTime = performance.now() - startTime
    console.log('Load time:', loadTime.toFixed(2) + 'ms')
    
    // First Contentful Paint
    const paint = performance.getEntriesByType('paint')
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
    if (fcp) {
      console.log('First Contentful Paint:', fcp.startTime.toFixed(2) + 'ms')
    }
  }

  window.addEventListener('load', logTiming)
  return () => window.removeEventListener('load', logTiming)
}, [])
```

Average metrics:
- Initial Load Time: ~800ms
- First Contentful Paint: ~400ms

## Optimizations

1. **Code Splitting**
   - Lazy loading of components
   - Dynamic imports for heavy dependencies

2. **Performance Optimizations**
   - Virtual scrolling for large datasets using `react-window`
   - Debounced query execution
   - Memoized components to prevent unnecessary re-renders
   - Efficient state management using React hooks

3. **Load Time Improvements**
   - Minified production build
   - Optimized asset loading
   - Cached query history in localStorage
   - Compressed static assets

4. **UI/UX Optimizations**
   - Loading states for better user feedback
   - Error boundaries for graceful error handling
   - Responsive design for all screen sizes
   - Theme persistence using localStorage

## Features
- Interactive SQL query editor with syntax highlighting
- Virtual scrolling for large datasets
- Dark/Light theme support
- Query history with timestamps
- Predefined query templates
- CSV export functionality
- Responsive design

## Getting Started

### Prerequisites
- Node.js >= 14.x
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/sql-query-editor.git

# Navigate to project directory
cd sql-query-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Feel free to contact vamsikrishnathota483@gmail.com for any queries.