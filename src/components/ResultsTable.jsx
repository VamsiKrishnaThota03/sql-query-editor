import './ResultsTable.css'
import { memo } from 'react'
import { FixedSizeList } from 'react-window'
import { CSVLink } from 'react-csv'
import { FaDownload } from 'react-icons/fa'

// Memoize the component to prevent unnecessary re-renders
const ResultsTable = memo(({ results }) => {
  if (!results || !results.columns || !results.rows) return null

  const Row = ({ index, style }) => {
    // Header row
    if (index === 0) {
      return (
        <div className="table-row header" style={style}>
          {results.columns.map((column, colIndex) => (
            <div key={colIndex} className="table-cell">
              {column}
            </div>
          ))}
        </div>
      )
    }

    // Data rows
    const rowData = results.rows[index - 1]
    return (
      <div className="table-row" style={style}>
        {rowData.map((cell, cellIndex) => (
          <div key={cellIndex} className="table-cell">
            {cell}
          </div>
        ))}
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
    <div className="results-container">
      <div className="results-header">
        <h3>Query Results</h3>
        <div className="actions">
          <CSVLink {...exportData} className="export-button">
            <FaDownload /> Export CSV
          </CSVLink>
        </div>
        <span className="row-count">
          {results.rows.length} row{results.rows.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="results-table">
        <div className="table">
          <FixedSizeList
            height={400}
            itemCount={1 + results.rows.length}
            itemSize={35}
            width="100%"
            className="results-table"
          >
            {Row}
          </FixedSizeList>
        </div>
      </div>
    </div>
  )
})

export default ResultsTable 