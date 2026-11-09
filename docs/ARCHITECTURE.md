# SQL Query Editor Architecture

## System Architecture
```
┌─────────────────┐     ┌──────────────────┐
│                 │     │                  │
│  React Frontend │     │  Local Storage   │
│                 │     │                  │
└────────┬────────┘     └──────────┬───────┘
         │                         │
         │                         │
┌────────┴─────────────────────────┴───────┐
│                                          │
│              Components                  │
│                                          │
│  ┌──────────┐  ┌─────────┐  ┌────────┐  │
│  │  Query   │  │ Results │  │ Query  │  │
│  │  Editor  │  │  Table  │  │History │  │
│  └──────────┘  └─────────┘  └────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

## Component Structure
- **App.jsx**: application state (current query, results, history, theme, view), runs queries through the mock engine
- **data/queries.js**: predefined queries and mock datasets
- **lib/mockEngine.js**: validation and mock execution (`runMockQuery`)
- **QueryEditor** (lazy-loaded): CodeMirror 6 SQL editor, Run and Format buttons, keyboard shortcuts
- **ResultsTable**: virtualized, sortable, resizable table with CSV export and an expanded view
- **QuerySelector**: searchable list of predefined queries
- **QueryHistory**: recent runs with status, relative time and row count, persisted to `localStorage`
- **Navbar**: brand, back-to-queries button and theme toggle
