import { formatDistanceToNow } from 'date-fns'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { cleanSqlQuery } from '../lib/mockEngine'
import './QueryHistory.css'

const timeAgo = (timestamp) => {
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? '' : formatDistanceToNow(date, { addSuffix: true })
}

const QueryHistory = ({ history, onSelect, onClear }) => (
  <div className="panel query-history">
    <div className="panel-header">
      <h2>History</h2>
      {history.length > 0 && (
        <button type="button" className="btn btn-link" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
    {history.length === 0 ? (
      <p className="list-empty">Queries you run will appear here.</p>
    ) : (
      <ul className="item-list">
        {history.map((item) => (
          <li key={`${item.timestamp}-${item.query}`}>
            <button type="button" className="list-item history-item" onClick={() => onSelect(item)} title={item.query}>
              <span className="history-status" aria-label={item.success ? 'Succeeded' : 'Failed'}>
                {item.success ? <FaCheckCircle className="ok" /> : <FaTimesCircle className="fail" />}
              </span>
              <span className="history-body">
                <code className="history-query">{cleanSqlQuery(item.query)}</code>
                <span className="list-item-sub">
                  {timeAgo(item.timestamp)}
                  {item.success && typeof item.rowCount === 'number' ? ` · ${item.rowCount.toLocaleString()} rows` : ''}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default QueryHistory
