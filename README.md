# SQL Query Editor

A browser-based SQL editor demo built with React, Vite and CodeMirror. It has syntax highlighting, query formatting, a virtualized results table, query history and CSV export.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![CodeMirror](https://img.shields.io/badge/CodeMirror-6-D30707)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel)

## Live demo

**https://sql-query-editor-fawn.vercel.app**

## Overview

This is a **frontend-only** project for exploring a SQL editing workflow in the browser. There is no database connection. Queries run against built-in mock datasets modeled on the Northwind sample schema (Products, Categories, Orders, Customers, Territories, Shippers):

- Picking one of the predefined queries loads its sample result set straight away.
- A query you write yourself is checked for basic `SELECT ... FROM ...` syntax. The app then matches it by keyword (products/categories, orders/customers, territories/regions, shipping/freight) to a mock result set, after a short simulated delay. Simple `WHERE column = 'value'` filters are applied to the product dataset.

## Features

- **SQL editor:** CodeMirror 6 with SQL syntax highlighting (`@uiw/react-codemirror`, `@codemirror/lang-sql`)
- **Format button:** pretty-prints the query with `sql-formatter`
- **Predefined query library:** six sample queries in the analytics, reports and demo categories, with a search box
- **Query validation:** rejects empty queries, comment-only input and statements that are not `SELECT ... FROM ...`
- **Results table:**
  - virtualized rows with `react-window` (`FixedSizeList`); the "Large Dataset Demo" query renders 1,000 generated rows
  - sort by clicking a column header
  - expanded/collapsed view toggle
  - CSV export (`react-csv`)
- **Query history:** the last 10 executions, with success/failure status and timestamps (`date-fns`), saved to `localStorage`. Click an entry to load it again.
- **Light/dark theme:** defaults to the OS preference and is saved to `localStorage`
- **Responsive layout,** including mobile-friendly tables
- **Load timing log:** page load time and First Contentful Paint are written to the browser console

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 18, Vite 5 |
| Editor | `@uiw/react-codemirror`, `@codemirror/lang-sql`, `sql-formatter` |
| Results | `react-window`, `react-csv` |
| Utilities | `date-fns`, `react-icons`, `web-vitals` |
| Tooling | ESLint |
| Hosting | Vercel (SPA rewrite in `vercel.json`) |

## Project structure

```
sql-query-editor/
├── docs/
│   ├── ARCHITECTURE.md     # component overview
│   └── TECHNICAL.md        # implementation notes
├── src/
│   ├── App.jsx             # state, predefined queries, mock execution, history
│   ├── components/
│   │   ├── QueryEditor.jsx     # CodeMirror editor + run / format buttons
│   │   ├── QuerySelector.jsx   # searchable predefined query list
│   │   ├── ResultsTable.jsx    # virtualized, sortable table + CSV export
│   │   ├── QueryHistory.jsx    # recent queries with timestamps
│   │   └── Navbar.jsx          # navigation + theme toggle
│   └── main.jsx
├── vercel.json
└── vite.config.js
```

## Getting started

### Prerequisites

- Node.js 14 or later (a current LTS release is recommended for Vite 5) and npm

### Install and run

```bash
git clone https://github.com/VamsiKrishnaThota03/sql-query-editor.git
cd sql-query-editor
npm install
npm run dev
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

There are no environment variables to set.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Technical notes](docs/TECHNICAL.md)

## Contact

Questions or feedback: vamsikrishnathota483@gmail.com
