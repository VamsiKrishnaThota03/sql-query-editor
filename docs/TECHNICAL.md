# SQL Query Editor Technical Notes

## Overview

A React 18 + Vite single-page app for writing SQL in the browser. There is no backend: queries are "executed" by a small mock engine against built-in Northwind-style datasets.

## Query execution (`src/lib/mockEngine.js`)

1. `validateQuery` strips comments and requires a `SELECT ... FROM ...` statement.
2. If the normalized query equals one of the predefined queries (`src/data/queries.js`), that query's result set is returned.
3. Otherwise a mock table is chosen by keyword (territories/regions, shippers/freight, products/categories, orders, customers).
4. A single `WHERE column = value` equality filter and `LIMIT n` are applied when present.
5. Anything else throws an error that the UI shows; the attempt is still recorded in history.

`App.jsx` adds a short simulated latency for typed queries so the loading state is visible. Picking a predefined query or a history entry runs it immediately.

The "Large Dataset Demo" rows are generated once with a seeded PRNG, so the data is identical across renders and reloads.

## Results table (`src/components/ResultsTable.jsx`)

- Body rows are virtualized with `react-window`'s `FixedSizeList`; rows are memoized and receive data through `itemData`.
- The header is rendered outside the virtual list, in the same horizontally scrolling wrapper, so it stays aligned and visible.
- Clicking a header cycles ascending, descending and unsorted. Numbers sort numerically, strings with `localeCompare` (numeric aware), and `NULL` sorts last.
- Column widths are estimated from the header and the first 100 rows, then can be dragged with the resize handle.
- CSV export (`react-csv`) writes the rows in the current sort order.

## Code splitting

`QueryEditor` (CodeMirror + `sql-formatter`) is loaded with `React.lazy` when the editor view first opens, which keeps the initial bundle small.

## Persistence

- `localStorage.queryHistory`: up to 20 recent runs (`query`, `timestamp`, `success`, `rowCount`), de-duplicated by query text
- `localStorage.theme`: `light` or `dark`

## Tests

`npm test` runs `node --test src/lib/` (no extra dependencies). It covers validation, predefined query matching, the deterministic large dataset, `WHERE`/`LIMIT` handling and the unknown-table error.
