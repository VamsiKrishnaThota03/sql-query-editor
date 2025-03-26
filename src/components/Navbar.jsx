import { FaMoon, FaSun } from 'react-icons/fa'
import './Navbar.css'

function Navbar({ isDarkMode, onThemeToggle }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>SQL Query Editor</h1>
        </div>
        <button 
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar 