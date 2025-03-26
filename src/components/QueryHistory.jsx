import { format } from 'date-fns'
import './QueryHistory.css'

function QueryHistory({ history, onSelect }) {
  if (!history.length) {
    return null
  }

  return (
    <div className="query-history">
      <h3>Query History</h3>
      <div className="history-list">
        {history.map((item, index) => (
          <div 
            key={index}
            className={`history-item ${item.success ? 'success' : 'error'}`}
            onClick={() => onSelect(item)}
          >
            <div className="history-item-time">
              {format(new Date(item.timestamp), 'HH:mm:ss')}
            </div>
            <pre className="history-item-query">{item.query}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueryHistory 