import { FaMoon, FaSun } from 'react-icons/fa'
import './Navbar.css'

function Navbar({ isDarkMode, onThemeToggle, isEditorView, onViewToggle }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>SQL Query Editor</h1>
        </div>
        <div className="navbar-actions">
          {isEditorView && (
            <button 
              className="nav-button"
              onClick={() => onViewToggle(false)}
            >
              Back to Grid
            </button>
          )}
          <button 
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 