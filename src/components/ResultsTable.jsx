import './ResultsTable.css'
import { memo } from 'react'
import { FixedSizeList } from 'react-window'
import { CSVLink } from 'react-csv'
import { FaDownload } from 'react-icons/fa'

// Memoize the component to prevent unnecessary re-renders
const ResultsTable = memo(({ results }) => {
  if (!results || !results.columns || !results.rows) return null

  const Row = ({ index, style }) => {
    const row = index === 0 ? results.columns : results.rows[index - 1]
    return (
      <div 
        style={{ ...style, display: 'flex' }} 
        className="table-row"
        data-row={`Row ${index}`}  // Add row number for demonstration
      >
        {row.map((cell, i) => (
          <div key={i} className="table-cell">
            {index === 0 ? cell : cell}
            {index > 0 && i === 0 && <span className="row-indicator">#{index}</span>}
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
          <table>
            <thead>
              <tr>
                {results.columns.map((column, i) => (
                  <th key={i}>{column}</th>
                ))}
              </tr>
            </thead>
            <FixedSizeList
              height={400}
              itemCount={1 + results.rows.length}
              itemSize={35}
              width="100%"
            >
              {Row}
            </FixedSizeList>
          </table>
        </div>
      </div>
    </div>
  )
})

export default ResultsTable 