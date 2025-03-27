import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { FaPlay, FaCode } from 'react-icons/fa'
import { format } from 'sql-formatter'
import './QueryEditor.css'

function QueryEditor({ value, onChange, onSubmit, loading, isDarkMode }) {
  // Detect if user is on Mac
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  const handleKeyDown = (e) => {
    // Execute query on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onSubmit()
    }
    
    // Format query on Alt+F (Windows) or Option+F (Mac)
    if (e.key === 'f' && (e.altKey || e.metaKey)) {
      e.preventDefault()
      handleFormat()
    }
  }

  const handleFormat = () => {
    try {
      const formatted = format(value, {
        language: 'sql',
        uppercase: true
      })
      onChange(formatted)
    } catch (err) {
      console.error('Format failed:', err)
    }
  }

  const shortcuts = [
    { key: 'Ctrl + Enter', action: 'Execute Query' },
    { key: isMac ? '⌥ + F' : 'Alt + F', action: 'Format Query' },
    { key: 'Ctrl + /', action: 'Toggle Comment' }
  ]

  return (
    <div className="query-editor">
      <div className="editor-header">
        <h3>SQL Query</h3>
        <div className="editor-actions">
          <button 
            onClick={onSubmit} 
            disabled={loading}
            className="run-button"
          >
            <FaPlay /> Run Query
          </button>
          <button 
            onClick={handleFormat}
            className="format-button"
          >
            <FaCode /> Format SQL
          </button>
        </div>
      </div>
      <CodeMirror
        value={value}
        height="200px"
        extensions={[sql()]}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        theme={isDarkMode ? 'dark' : 'light'}
        placeholder="Enter your SQL query here..."
      />
      <div className="editor-footer">
        <div className="shortcuts-list">
          {shortcuts.map(({ key, action }) => (
            <span key={key} className="shortcut-item">
              <kbd>{key}</kbd> {action}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QueryEditor 