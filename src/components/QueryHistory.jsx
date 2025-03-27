import { format } from 'date-fns'
import './QueryHistory.css'

function QueryHistory({ history, onSelect }) {
  if (!history.length) {
    return (
      <div className="query-history query-list">
        <h3>Query History</h3>
        <div className="empty-history">No queries executed yet</div>
      </div>
    )
  }

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      // Format: "Jan 15, 14:30:45"
      return format(date, 'MMM d, HH:mm:ss')
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid date'
    }
  }

  const truncateQuery = (query) => {
    const maxLength = 60
    return query.length > maxLength 
      ? query.substring(0, maxLength) + '...'
      : query
  }

  return (
    <div className="query-history query-list">
      <h3>Query History</h3>
      <div className="query-list">
        {history.map((item, index) => (
          <div
            key={index}
            className={`query-item ${item.success ? 'success' : 'error'}`}
            onClick={() => onSelect(item)}
            title={item.query}
          >
            <div className="query-item-content">
              <div className="query-header">
                <small className="query-timestamp">
                  {item.timestamp ? formatDate(item.timestamp) : 'No timestamp'}
                </small>
                <span className="query-status">
                  {item.success ? '✓' : '✗'}
                </span>
              </div>
              <pre className="query-preview">{truncateQuery(item.query)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueryHistory 