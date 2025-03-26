import './ResultsTable.css'
import { memo } from 'react'
import { FixedSizeList } from 'react-window'

// Memoize the component to prevent unnecessary re-renders
const ResultsTable = memo(({ results }) => {
  if (!results || !results.columns || !results.rows) return null

  const Row = ({ index, style }) => (
    <tr style={style}>
      {results.rows[index].map((cell, i) => (
        <td key={i}>{cell}</td>
      ))}
    </tr>
  )

  return (
    <div className="results-container">
      <div className="results-header">
        <h3>Query Results</h3>
        <span className="row-count">
          {results.rows.length} row{results.rows.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="results-table">
        <table>
          <thead>
            <tr>
              {results.columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
        </table>
        <FixedSizeList
          height={400}
          itemCount={results.rows.length}
          itemSize={35}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      </div>
    </div>
  )
})

export default ResultsTable 