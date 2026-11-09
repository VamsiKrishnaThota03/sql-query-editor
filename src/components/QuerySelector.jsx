import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import './QuerySelector.css'

function QuerySelector({ queries, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const term = searchTerm.trim().toLowerCase()
  const filtered = queries.filter(
    (q) => q.name.toLowerCase().includes(term) || q.description.toLowerCase().includes(term)
  )

  return (
    <div className="panel query-selector">
      <div className="panel-header">
        <h2>Sample queries</h2>
      </div>
      <div className="search-box">
        <FaSearch className="search-icon" aria-hidden="true" />
        <label htmlFor="query-search" className="sr-only">
          Search sample queries
        </label>
        <input
          id="query-search"
          type="search"
          placeholder="Search queries…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="item-list">
        {filtered.map((query) => (
          <li key={query.id}>
            <button type="button" className="list-item" onClick={() => onSelect(query)}>
              <span className="list-item-title">{query.name}</span>
              <span className="list-item-sub">{query.description}</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="list-empty">No queries match “{searchTerm}”.</li>}
      </ul>
    </div>
  )
}

export default QuerySelector
