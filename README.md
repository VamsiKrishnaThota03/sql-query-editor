# SQL Query Editor

A web-based SQL query editor that allows users to write, execute, and visualize SQL queries in an intuitive interface.

## Overview

This application provides:
- Interactive SQL query editor with syntax highlighting
- Predefined query templates
- Query history tracking
- Results visualization in tabular format
- Dark/Light theme support
- Responsive design for various screen sizes

## Tech Stack

### Framework
- React (Vite) - Chosen for its performance and modern development experience

### Major Packages
- `@uiw/react-codemirror` - For SQL editor with syntax highlighting
- `@codemirror/lang-sql` - SQL language support for CodeMirror
- `react-window` - For efficient rendering of large result sets
- `date-fns` - For date formatting in query history
- `react-csv` - For exporting query results
- `sql-formatter` - For SQL query formatting

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

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The application is deployed on Vercel with automatic deployments configured for the main branch.

## License

MIT
