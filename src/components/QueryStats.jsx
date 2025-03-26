import { FaClock, FaDatabase, FaHistory, FaCheck } from 'react-icons/fa'
import './QueryStats.css'

function QueryStats({ totalQueries, avgExecutionTime, successRate }) {
  return (
    <div className="query-stats">
      <div className="stat-card">
        <FaDatabase className="stat-icon" />
        <div className="stat-info">
          <h4>Total Queries</h4>
          <span>{totalQueries}</span>
        </div>
      </div>
      <div className="stat-card">
        <FaClock className="stat-icon" />
        <div className="stat-info">
          <h4>Avg. Execution Time</h4>
          <span>{avgExecutionTime}ms</span>
        </div>
      </div>
      <div className="stat-card">
        <FaCheck className="stat-icon" />
        <div className="stat-info">
          <h4>Success Rate</h4>
          <span>{successRate}%</span>
        </div>
      </div>
    </div>
  )
}

export default QueryStats 