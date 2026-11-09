import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { CSVLink } from 'react-csv'
import { FaDownload, FaExpand, FaCompress, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import './ResultsTable.css'

const ROW_HEIGHT = 36
const MIN_COL_WIDTH = 96
const MAX_AUTO_WIDTH = 320

const dataType = (value) => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'string'
}

const formatCell = (value) => {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return value.toLocaleString(undefined, { maximumFractionDigits: 4 })
  return String(value)
}

function compare(a, b) {
  if (a === b) return 0
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

/** Estimate column widths from the header and a sample of rows. */
function autoWidths(results, available) {
  const sample = results.rows.slice(0, 100)
  const widths = results.columns.map((column, i) => {
    // Header text is bold and needs room for the sort icon
    const headerWidth = column.length * 8.5 + 52
    const valueWidth = Math.max(0, ...sample.map((row) => formatCell(row[i]).length)) * 8 + 28
    return Math.min(Math.max(headerWidth, valueWidth, MIN_COL_WIDTH), MAX_AUTO_WIDTH)
  })
  const total = widths.reduce((s, w) => s + w, 0)
  if (total < available) {
    const extra = Math.floor((available - total) / widths.length)
    return widths.map((w) => w + extra)
  }
  return widths
}

// Rendered by react-window; defined outside the component so rows are not remounted on every render
const Row = memo(({ index, style, data }) => {
  const { rows, widths } = data
  const row = rows[index]
  return (
    <div className={`table-row ${index % 2 ? 'odd' : ''}`} style={style} role="row" aria-rowindex={index + 2}>
      {row.map((cell, i) => {
        const text = formatCell(cell)
        return (
          <div key={i} className="table-cell" data-type={dataType(cell)} style={{ width: widths[i] }} role="cell" title={text.length > 30 ? text : undefined}>
            {text}
          </div>
        )
      })}
    </div>
  )
})
Row.displayName = 'Row'

const ResultsTable = memo(({ results, meta }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [widths, setWidths] = useState([])
  const [sort, setSort] = useState({ index: null, direction: 'asc' })
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight)
  const wrapperRef = useRef(null)
  const resizeRef = useRef(null)

  // Reset sorting and recompute widths when a new result set arrives
  useEffect(() => {
    setSort({ index: null, direction: 'asc' })
    const available = wrapperRef.current ? wrapperRef.current.clientWidth : 800
    setWidths(autoWidths(results, available))
  }, [results])

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!isExpanded) return
    const onKey = (e) => e.key === 'Escape' && setIsExpanded(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded])

  const sortedRows = useMemo(() => {
    if (sort.index === null) return results.rows
    const dir = sort.direction === 'asc' ? 1 : -1
    return [...results.rows].sort((a, b) => dir * compare(a[sort.index], b[sort.index]))
  }, [results.rows, sort])

  const toggleSort = (index) =>
    setSort((prev) =>
      prev.index !== index
        ? { index, direction: 'asc' }
        : prev.direction === 'asc'
          ? { index, direction: 'desc' }
          : { index: null, direction: 'asc' }
    )

  // Column resizing: refs avoid stale state inside the document listeners
  const onResizeMove = useCallback((e) => {
    const r = resizeRef.current
    if (!r) return
    const width = Math.max(MIN_COL_WIDTH, r.startWidth + e.clientX - r.startX)
    setWidths((prev) => prev.map((w, i) => (i === r.index ? width : w)))
  }, [])

  const onResizeEnd = useCallback(() => {
    resizeRef.current = null
    document.body.classList.remove('col-resizing')
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
  }, [onResizeMove])

  const onResizeStart = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = { index, startX: e.clientX, startWidth: widths[index] }
    document.body.classList.add('col-resizing')
    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
  }

  useEffect(() => onResizeEnd, [onResizeEnd])

  const totalWidth = widths.reduce((s, w) => s + w, 0)
  const bodyHeight = isExpanded
    ? Math.max(200, viewportHeight - 170)
    : Math.min(400, Math.max(ROW_HEIGHT, sortedRows.length * ROW_HEIGHT))
  const itemData = useMemo(() => ({ rows: sortedRows, widths }), [sortedRows, widths])

  const csv = {
    filename: `query_results_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`,
    data: [results.columns, ...sortedRows],
  }

  return (
    <div className={`panel results-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="panel-header">
        <div className="results-title">
          <h2>Results</h2>
          <span className="row-count">
            {results.rows.length.toLocaleString()} row{results.rows.length !== 1 ? 's' : ''}
            {meta?.duration ? ` · ${meta.duration} ms` : ''}
          </span>
        </div>
        <div className="actions">
          {results.rows.length > 0 && (
            <CSVLink {...csv} className="btn btn-secondary">
              <FaDownload aria-hidden="true" /> Export CSV
            </CSVLink>
          )}
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => setIsExpanded((v) => !v)}
            aria-label={isExpanded ? 'Exit full screen' : 'Expand results'}
            title={isExpanded ? 'Exit full screen (Esc)' : 'Expand'}
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {results.rows.length === 0 ? (
        <div className="empty-state">The query returned no rows.</div>
      ) : (
        <div className="results-table-wrapper" ref={wrapperRef} role="table" aria-rowcount={sortedRows.length + 1}>
          <div className="results-table" style={{ width: totalWidth || '100%' }}>
            <div className="table-row header" role="row" aria-rowindex={1}>
              {results.columns.map((column, i) => {
                const active = sort.index === i
                return (
                  <div
                    key={column + i}
                    className="table-cell header-cell"
                    style={{ width: widths[i] }}
                    role="columnheader"
                    aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button type="button" className="column-title" onClick={() => toggleSort(i)} title={`Sort by ${column}`}>
                      <span>{column}</span>
                      {active ? (
                        sort.direction === 'asc' ? <FaSortUp aria-hidden="true" /> : <FaSortDown aria-hidden="true" />
                      ) : (
                        <FaSort className="sort-icon" aria-hidden="true" />
                      )}
                    </button>
                    <span className="resize-handle" onMouseDown={(e) => onResizeStart(e, i)} aria-hidden="true" />
                  </div>
                )
              })}
            </div>
            {widths.length > 0 && (
              <FixedSizeList
                height={bodyHeight}
                itemCount={sortedRows.length}
                itemSize={ROW_HEIGHT}
                width={totalWidth}
                itemData={itemData}
                overscanCount={10}
              >
                {Row}
              </FixedSizeList>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

ResultsTable.displayName = 'ResultsTable'

export default ResultsTable
