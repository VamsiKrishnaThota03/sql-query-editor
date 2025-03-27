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
- **App.jsx**: Main application container
  - State management
  - Theme handling
  - Query execution logic

- **QueryEditor**: SQL editor with syntax highlighting
  - CodeMirror integration
  - Query validation
  - Auto-formatting

- **ResultsTable**: Virtual scrolling table
  - Large dataset handling
  - CSV export
  - Performance optimization

- **QueryHistory**: History management
  - LocalStorage persistence
  - Timestamp tracking
  - Query reuse 