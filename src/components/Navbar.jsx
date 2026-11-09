import { FaArrowLeft, FaDatabase, FaMoon, FaSun } from 'react-icons/fa'
import './Navbar.css'

function Navbar({ isDarkMode, onThemeToggle, isEditorView, onViewToggle }) {
  return (
    <nav className="navbar" aria-label="Main">
      <div className="navbar-content">
        <button type="button" className="navbar-brand" onClick={() => onViewToggle(false)}>
          <span className="brand-icon" aria-hidden="true">
            <FaDatabase />
          </span>
          SQL Query Editor
          <span className="brand-tag">demo</span>
        </button>
        <div className="navbar-actions">
          {isEditorView && (
            <button type="button" className="btn btn-ghost" onClick={() => onViewToggle(false)} aria-label="All queries">
              <FaArrowLeft aria-hidden="true" /> <span className="btn-label">All queries</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-icon"
            onClick={onThemeToggle}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
