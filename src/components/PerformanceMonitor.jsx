import { useState, useEffect } from 'react'
import { getCLS, getFID, getLCP } from 'web-vitals'

function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    initialLoad: 0,
    tti: 0,
    cls: 0,
    fid: 0,
    lcp: 0
  })

  useEffect(() => {
    // Initial Load Time
    const navigationEntry = performance.getEntriesByType('navigation')[0]
    setMetrics(m => ({
      ...m,
      initialLoad: navigationEntry.loadEventEnd - navigationEntry.startTime
    }))

    // Web Vitals
    getCLS(metric => setMetrics(m => ({ ...m, cls: metric.value })))
    getFID(metric => setMetrics(m => ({ ...m, fid: metric.value })))
    getLCP(metric => setMetrics(m => ({ ...m, lcp: metric.value })))

    // Component Render Time
    const componentStart = performance.now()
    return () => {
      const renderTime = performance.now() - componentStart
      setMetrics(m => ({ ...m, tti: m.fid + renderTime }))
    }
  }, [])

  return (
    <div className="performance-metrics">
      <h3>Performance Metrics</h3>
      <ul>
        <li>Initial Load: {metrics.initialLoad.toFixed(2)}ms</li>
        <li>Time to Interactive: {metrics.tti.toFixed(2)}ms</li>
        <li>Cumulative Layout Shift: {metrics.cls.toFixed(3)}</li>
        <li>First Input Delay: {metrics.fid.toFixed(2)}ms</li>
        <li>Largest Contentful Paint: {metrics.lcp.toFixed(2)}ms</li>
      </ul>
    </div>
  )
}

export default PerformanceMonitor 