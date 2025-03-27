# SQL Query Editor

A web-based SQL query editor that allows users to write, format, and execute SQL queries with a modern, user-friendly interface.

## 🚀 Features

### Query Editor
- Syntax highlighting
- Auto-formatting
- Keyboard shortcuts
- Error handling

### Results Display
- Virtualized table for handling large datasets
- CSV export functionality
- Column sorting

### User Experience
- Dark/Light theme
- Query history (last 10 queries)
- Predefined query templates
- Responsive design

### Performance
- Fast initial load time
- Table virtualization
- Optimized re-renders
- Local storage for persistence

## 🛠️ Technologies Used

- **Framework:** React 18
- **Editor:** CodeMirror
- **Key Dependencies:**
  - `@uiw/react-codemirror`: SQL editor with syntax highlighting
  - `@codemirror/lang-sql`: SQL language support
  - `react-window`: Table virtualization
  - `react-csv`: CSV export functionality
  - `sql-formatter`: SQL query formatting
  - `react-icons`: UI icons

## ⚡ Performance Metrics

### Page Load Time
Measured using Performance API and Web Vitals:
- Initial Load: Measured using `performance.getEntriesByType('navigation')`
- Time to Interactive: Calculated from First Input Delay + Component Render Time
- Additional metrics:
  - Cumulative Layout Shift (CLS)
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)

### Optimizations
#### Component Memoization
```javascript
const ResultsTable = memo(({ results }) => {
  // Component code
})
```

#### Table Virtualization
```javascript
<FixedSizeList
  height={400}
  itemCount={results.rows.length}
  itemSize={35}
  width="100%"
>
  {Row}
</FixedSizeList>
```

#### Local Storage
- Caching theme preference
- Storing query history
- Persisting metrics

#### Lazy Loading
- Dynamic imports for heavy components
- Deferred loading of non-critical features

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
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

### Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📚 Usage

### Writing Queries
- Use the editor to write SQL queries
- Press `Ctrl + Enter` to execute
- Press `Alt + F` to format query

### Keyboard Shortcuts
- `Ctrl + Enter`: Execute query
- `Alt + F`: Format query
- `Ctrl + /`: Toggle comment

### Theme Toggle
- Click the theme icon in navbar
- Automatically syncs with system preference

### Query History
- View last 10 executed queries
- Click to restore previous queries
- Timestamps for each execution

## 👀 Code Structure

```
sql-query-editor/
├── src/
│   ├── components/
│   │   ├── QueryEditor.jsx
│   │   ├── ResultsTable.jsx
│   │   ├── QueryHistory.jsx
│   │   ├── QuerySelector.jsx
│   │   └── Navbar.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

## 📊 Performance Testing

Load time measurements were conducted using:
```javascript
useEffect(() => {
  const startTime = performance.now();
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);
  });
}, []);
```

### Results:
- Average Load Time: ~300ms
- First Contentful Paint: ~250ms
- Time to Interactive: ~400ms

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
