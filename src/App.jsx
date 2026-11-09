import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import Navbar from './components/Navbar'
import QuerySelector from './components/QuerySelector'
import QueryHistory from './components/QueryHistory'
import ResultsTable from './components/ResultsTable'
import { predefinedQueries } from './data/queries'
import { runMockQuery } from './lib/mockEngine'
import './App.css'

// CodeMirror is the heaviest dependency, so load it only when the editor opens
const QueryEditor = lazy(() => import('./components/QueryEditor'))

const HISTORY_KEY = 'queryHistory'
const HISTORY_LIMIT = 20

function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((h) => h && typeof h.query === 'string') : []
  } catch {
    return []
  }
}

function initialDarkMode() {
  const saved = localStorage.getItem('theme')
  return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
}

const Spinner = () => (
  <div className="loading-spinner" role="status">
    <div className="spinner" aria-hidden="true" />
    <span>Executing query…</span>
  </div>
)

function App() {
  const [currentQuery, setCurrentQuery] = useState('')
  const [queryResults, setQueryResults] = useState(null)
  const [lastRun, setLastRun] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [queryHistory, setQueryHistory] = useState(loadHistory)
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode)
  const [isEditorView, setIsEditorView] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(queryHistory))
  }, [queryHistory])

  const addToHistory = useCallback((entry) => {
    setQueryHistory((prev) => [entry, ...prev.filter((h) => h.query !== entry.query)].slice(0, HISTORY_LIMIT))
  }, [])

  const execute = useCallback(
    async (query, { simulateLatency = true } = {}) => {
      setLoading(true)
      setError(null)
      const started = performance.now()
      try {
        // Simulate network latency so the loading state is visible
        if (simulateLatency) await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400))
        const results = runMockQuery(query)
        const duration = Math.round(performance.now() - started)
        setQueryResults(results)
        setLastRun({ duration, rowCount: results.rows.length })
        addToHistory({ query, timestamp: new Date().toISOString(), success: true, rowCount: results.rows.length })
      } catch (err) {
        setQueryResults(null)
        setLastRun(null)
        setError(err.message)
        addToHistory({ query, timestamp: new Date().toISOString(), success: false })
      } finally {
        setLoading(false)
      }
    },
    [addToHistory]
  )

  const handleQuerySubmit = () => {
    if (!loading) execute(currentQuery)
  }

  const openQuery = (query) => {
    setCurrentQuery(query)
    setIsEditorView(true)
    execute(query, { simulateLatency: false })
  }

  return (
    <div className="app">
      <Navbar
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode((prev) => !prev)}
        isEditorView={isEditorView}
        onViewToggle={setIsEditorView}
      />

      {isEditorView ? (
        <main className="main-container editor-view">
          <aside className="sidebar" aria-label="Queries">
            <QuerySelector queries={predefinedQueries} onSelect={(q) => openQuery(q.query)} />
            <QueryHistory history={queryHistory} onSelect={(h) => openQuery(h.query)} onClear={() => setQueryHistory([])} />
          </aside>
          <section className="content" aria-label="Editor and results">
            <Suspense fallback={<div className="panel editor-placeholder">Loading editor…</div>}>
              <QueryEditor
                value={currentQuery}
                onChange={(q) => {
                  setCurrentQuery(q)
                  setError(null)
                }}
                onSubmit={handleQuerySubmit}
                loading={loading}
                isDarkMode={isDarkMode}
              />
            </Suspense>
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}
            {loading ? (
              <Spinner />
            ) : queryResults ? (
              <ResultsTable results={queryResults} meta={lastRun} />
            ) : (
              !error && <div className="panel empty-state">Run a query to see results here.</div>
            )}
          </section>
        </main>
      ) : (
        <main className="main-container grid-view">
          <header className="intro">
            <h1>Explore the Northwind sample queries</h1>
            <p>
              Pick a query to open it in the editor, or write your own. Results come from built-in mock data, so nothing
              touches a real database.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setIsEditorView(true)}>
              Open a blank editor
            </button>
          </header>
          <div className="queries-grid">
            {predefinedQueries.map((query) => (
              <button type="button" key={query.id} className="query-card" onClick={() => openQuery(query.query)}>
                <div className="query-card-header">
                  <h2>{query.name}</h2>
                  <span className={`badge badge-${query.category}`}>{query.category}</span>
                </div>
                <p className="query-description">{query.description}</p>
                <pre className="query-preview">
                  {query.query.split('\n').slice(0, 4).join('\n')}
                  {query.query.split('\n').length > 4 ? '\n…' : ''}
                </pre>
                <span className="query-card-cta">
                  <FaPlay aria-hidden="true" /> Run query · {query.results.rows.length.toLocaleString()} rows
                </span>
              </button>
            ))}
          </div>
        </main>
      )}
    </div>
  )
}

export default App
