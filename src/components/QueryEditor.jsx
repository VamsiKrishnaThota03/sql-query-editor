import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { FaPlay } from 'react-icons/fa'
import './QueryEditor.css'

function QueryEditor({ value, onChange, onSubmit, loading }) {
  const handleKeyDown = (e) => {
    // Execute query on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onSubmit()
    }
  }

  const shortcuts = [
    { key: 'Ctrl + Enter', action: 'Execute Query' },
    { key: 'Ctrl + /', action: 'Toggle Comment' },
    { key: 'Ctrl + Space', action: 'Show Suggestions' }
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
        </div>
      </div>
      <CodeMirror
        value={value}
        height="200px"
        extensions={[sql()]}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        theme="dark"
        placeholder="Enter your SQL query here..."
      />
      <div className="editor-footer">
        <span className="shortcut-hint">
          Press Ctrl+Enter to execute query
        </span>
      </div>
      <div className="shortcuts-tooltip">
        <h4>Keyboard Shortcuts</h4>
        {shortcuts.map(({ key, action }) => (
          <div key={key} className="shortcut-item">
            <kbd>{key}</kbd>
            <span>{action}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueryEditor 