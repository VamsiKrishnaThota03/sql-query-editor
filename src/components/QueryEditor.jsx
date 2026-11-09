import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { FaPlay, FaCode } from 'react-icons/fa'
import { format } from 'sql-formatter'
import './QueryEditor.css'

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
const mod = isMac ? '⌘' : 'Ctrl'

function QueryEditor({ value, onChange, onSubmit, loading, isDarkMode }) {
  const handleFormat = () => {
    try {
      onChange(format(value, { language: 'sql', keywordCase: 'upper' }))
    } catch (err) {
      console.error('Format failed:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onSubmit()
    }
    // Alt/Option + Shift + F formats (plain Alt+F types a character on macOS)
    if (e.code === 'KeyF' && e.altKey && e.shiftKey) {
      e.preventDefault()
      handleFormat()
    }
  }

  const shortcuts = [
    { key: `${mod} + Enter`, action: 'Run' },
    { key: `${isMac ? '⌥' : 'Alt'} + Shift + F`, action: 'Format' },
    { key: `${mod} + /`, action: 'Comment' },
  ]

  return (
    <div className="panel query-editor">
      <div className="panel-header">
        <h2>SQL query</h2>
        <div className="editor-actions">
          <button type="button" onClick={handleFormat} className="btn btn-secondary" disabled={!value.trim()}>
            <FaCode aria-hidden="true" /> Format
          </button>
          <button type="button" onClick={onSubmit} disabled={loading || !value.trim()} className="btn btn-primary">
            <FaPlay aria-hidden="true" /> {loading ? 'Running…' : 'Run query'}
          </button>
        </div>
      </div>
      <div className="editor-frame">
        <CodeMirror
          value={value}
          minHeight="180px"
          maxHeight="360px"
          extensions={[sql()]}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          theme={isDarkMode ? 'dark' : 'light'}
          placeholder="SELECT * FROM Products WHERE CategoryName = 'Beverages';"
          aria-label="SQL editor"
        />
      </div>
      <div className="editor-footer">
        {shortcuts.map(({ key, action }) => (
          <span key={key} className="shortcut-item">
            <kbd>{key}</kbd> {action}
          </span>
        ))}
      </div>
    </div>
  )
}

export default QueryEditor
