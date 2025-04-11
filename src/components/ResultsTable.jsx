import './ResultsTable.css'
import { memo, useState, useEffect, useRef, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import { CSVLink } from 'react-csv'
import { FaDownload, FaExpand, FaCompress, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

// Memoize the component to prevent unnecessary re-renders
const ResultsTable = memo(({ results, isDarkMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tableHeight, setTableHeight] = useState(400)
  const [columnWidths, setColumnWidths] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [resizingColumn, setResizingColumn] = useState(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const [rowHeight, setRowHeight] = useState(35)
  const tableRef = useRef(null)
  const tableWrapperRef = useRef(null)
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isExpanded) {
        setTableHeight(window.innerHeight - 200)
      } else {
        setTableHeight(400)
      }
      
      // Recalculate column widths on resize
      if (results && results.columns) {
        calculateColumnWidths()
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Initial calculation
    
    return () => window.removeEventListener('resize', handleResize)
  }, [isExpanded, results])
  
  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setTableHeight(window.innerHeight - 200)
    } else {
      setTableHeight(400)
    }
  }

  // Calculate column widths efficiently for large datasets
  const calculateColumnWidths = useCallback(() => {
    if (!results || !results.columns || !results.rows) return
    
    // Get the available width of the table wrapper
    const tableWrapperWidth = tableWrapperRef.current ? tableWrapperRef.current.clientWidth : 800
    const columnCount = results.columns.length
    
    // For tables with few columns, distribute width evenly
    if (columnCount <= 3) {
      const equalWidth = Math.floor(tableWrapperWidth / columnCount)
      setColumnWidths(Array(columnCount).fill(equalWidth))
      return
    }
    
    // For large datasets, only sample a subset of rows to calculate widths
    const sampleSize = Math.min(100, results.rows.length)
    const sampledRows = results.rows.slice(0, sampleSize)
    
    // Calculate minimum widths based on content
    const minWidths = results.columns.map((column, colIndex) => {
      // Get column values from sampled rows
      const columnValues = sampledRows.map(row => row[colIndex])
      
      // Get max length of values in this column
      const maxLength = Math.max(
        column.length,
        ...columnValues.map(val => String(val).length)
      )
      
      // Return width in pixels (min 120px, max 300px)
      return Math.min(Math.max(maxLength * 8, 120), 300)
    })
    
    // Calculate total minimum width
    const totalMinWidth = minWidths.reduce((sum, width) => sum + width, 0)
    
    // If total minimum width is less than available width, distribute extra space
    if (totalMinWidth < tableWrapperWidth) {
      const extraSpace = tableWrapperWidth - totalMinWidth
      const extraPerColumn = Math.floor(extraSpace / columnCount)
      
      setColumnWidths(minWidths.map(width => width + extraPerColumn))
    } else {
      // Otherwise use minimum widths
      setColumnWidths(minWidths)
    }
  }, [results])
  
  useEffect(() => {
    calculateColumnWidths()
  }, [calculateColumnWidths])

  // Handle column resizing
  const handleResizeStart = (e, columnIndex) => {
    e.preventDefault()
    setResizingColumn(columnIndex)
    setStartX(e.clientX)
    setStartWidth(columnWidths[columnIndex])
    
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }
  
  const handleResizeMove = useCallback((e) => {
    if (resizingColumn === null) return
    
    const diff = e.clientX - startX
    const newWidth = Math.max(120, startWidth + diff)
    
    setColumnWidths(prev => {
      const newWidths = [...prev]
      newWidths[resizingColumn] = newWidth
      return newWidths
    })
  }, [resizingColumn, startX, startWidth])
  
  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null)
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }, [handleResizeMove])
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [handleResizeMove, handleResizeEnd])

  // Handle sorting
  const handleSort = (columnIndex) => {
    const column = results.columns[columnIndex]
    
    setSortConfig(prev => {
      const direction = 
        prev.key === columnIndex && prev.direction === 'asc' ? 'desc' : 'asc'
      
      return { key: columnIndex, direction }
    })
  }
  
  // Get sorted data
  const getSortedData = () => {
    if (!sortConfig.key) return results.rows
    
    const { key, direction } = sortConfig
    const column = results.columns[key]
    
    return [...results.rows].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]
      
      // Handle null values
      if (aValue === null && bValue === null) return 0
      if (aValue === null) return direction === 'asc' ? 1 : -1
      if (bValue === null) return direction === 'asc' ? -1 : 1
      
      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      // Default string comparison
      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()
      
      if (aString < bString) return direction === 'asc' ? -1 : 1
      if (aString > bString) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  if (!results || !results.columns || !results.rows) return null
  
  // Handle empty results
  if (results.rows.length === 0) {
    return (
      <div className={`results-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="results-header">
          <h3>Query Results</h3>
          <span className="row-count">0 rows</span>
        </div>
        <div className="empty-results">
          <p>No results returned from this query.</p>
        </div>
      </div>
    )
  }

  // Format cell value based on data type
  const formatCellValue = (value) => {
    if (value === null || value === undefined) return 'NULL'
    if (typeof value === 'number') return value.toLocaleString()
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    return String(value)
  }

  // Get data type for styling
  const getDataType = (value) => {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'
    return 'string'
  }

  // Get sorted data
  const sortedData = getSortedData()

  const Row = ({ index, style }) => {
    // Header row
    if (index === 0) {
      return (
        <div className="table-row header" style={style}>
          {results.columns.map((column, colIndex) => (
            <div 
              key={colIndex} 
              className="table-cell header-cell"
              style={{ width: columnWidths[colIndex] || 150 }}
            >
              <div className="column-header-content">
                <span 
                  className="column-title"
                  onClick={() => handleSort(colIndex)}
                >
                  {column}
                  {sortConfig.key === colIndex && (
                    sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                  {sortConfig.key !== colIndex && <FaSort className="sort-icon" />}
                </span>
                <div 
                  className="resize-handle"
                  onMouseDown={(e) => handleResizeStart(e, colIndex)}
                />
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Data rows
    const rowData = sortedData[index - 1]
    return (
      <div className="table-row" style={style}>
        {rowData.map((cell, cellIndex) => {
          const dataType = getDataType(cell)
          const formattedValue = formatCellValue(cell)
          const isLongContent = formattedValue.length > 50
          
          return (
            <div 
              key={cellIndex} 
              className="table-cell"
              data-type={dataType}
              style={{ width: columnWidths[cellIndex] || 150 }}
              title={isLongContent ? formattedValue : undefined}
            >
              <div className="cell-content">
                {formattedValue}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const exportData = {
    filename: `query_results_${new Date().toISOString()}.csv`,
    data: [
      results.columns,
      ...results.rows
    ]
  }

  return (
    <div className={`results-container ${isDarkMode ? 'dark-mode' : ''} ${isExpanded ? 'expanded' : ''}`} ref={tableRef}>
      <div className="results-header">
        <h3>Query Results</h3>
        <div className="actions">
          <button 
            className="expand-button"
            onClick={toggleExpanded}
            title={isExpanded ? "Compress" : "Expand"}
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </button>
          <CSVLink {...exportData} className="export-button">
            <FaDownload /> Export CSV
          </CSVLink>
        </div>
        <span className="row-count">
          {results.rows.length} row{results.rows.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="results-table-container">
        <div className="results-table-wrapper" ref={tableWrapperRef}>
          <FixedSizeList
            height={tableHeight}
            itemCount={1 + sortedData.length}
            itemSize={rowHeight}
            width="100%"
            overscanCount={10}
          >
            {Row}
          </FixedSizeList>
        </div>
      </div>
      {resizingColumn !== null && (
        <div className="resize-overlay" />
      )}
    </div>
  )
})

export default ResultsTable 