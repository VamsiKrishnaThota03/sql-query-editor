import { useState } from 'react'
import { FaSearch, FaPlay } from 'react-icons/fa'
import './QuerySelector.css'

function QuerySelector({ queries, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredQueries = queries.filter(query => 
    query.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="query-selector query-list">
      <div className="selector-header">
        <h3>Sample Queries</h3>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="queries-list">
        {filteredQueries.map((query) => (
          <div 
            key={query.id} 
            className="query-item"
            onClick={() => onSelect(query)}
          >
            <div className="query-item-header">
              <h4>{query.name}</h4>
              <button className="run-button">
                <FaPlay /> Run
              </button>
            </div>
            <div className="query-preview">
              <pre>{query.query}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuerySelector 