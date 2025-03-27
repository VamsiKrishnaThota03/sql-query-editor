import { format } from 'date-fns'
import { FaCheck, FaTimes } from 'react-icons/fa'
import './QueryHistory.css'

const QueryHistory = ({ history, onSelect }) => {
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return format(date, 'MMM d, yyyy HH:mm:ss')  // Format: "Mar 14, 2024 15:30:45"
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid date'
    }
  }

  if (!history.length) {
    return (
      <div className="query-history query-list">
        <h3>Query History</h3>
        <div className="empty-history">No queries executed yet</div>
      </div>
    )
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
          >
            <small className="query-timestamp">
              {item.timestamp ? formatTimestamp(item.timestamp) : 'No timestamp'}
            </small>
            <span className="query-status">
              {item.success ? <FaCheck className="success" /> : <FaTimes className="error" />}
            </span>
            <div className="query-tooltip">
              <code>{item.query}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueryHistory 