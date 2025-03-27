import { useState, useEffect } from 'react'
import QueryEditor from './components/QueryEditor'
import ResultsTable from './components/ResultsTable'
import QuerySelector from './components/QuerySelector'
import QueryHistory from './components/QueryHistory'
import Navbar from './components/Navbar'
import './App.css'

"As you can see, this application is built using React with Vite for optimal performance."

// Add loading state indicator
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <span>Executing query...</span>
  </div>
)

// Add this helper function at the top of the file
const cleanSqlQuery = (query) => {
  // Remove single-line comments
  const noSingleLineComments = query.replace(/--.*$/gm, '')
  // Remove multi-line comments
  const noComments = noSingleLineComments.replace(/\/\*[\s\S]*?\*\//gm, '')
  // Remove extra whitespace and newlines
  return noComments.trim().replace(/\s+/g, ' ')
}

function App() {
  const [currentQuery, setCurrentQuery] = useState('')
  const [queryResults, setQueryResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [queryHistory, setQueryHistory] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [isEditorView, setIsEditorView] = useState(false)
  
  // Load query history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('queryHistory')
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Simplified performance monitoring
  useEffect(() => {
    const startTime = performance.now()
    
    const logTiming = () => {
      const loadTime = performance.now() - startTime
      console.log('Load time:', loadTime.toFixed(2) + 'ms')
      
      // Get other performance metrics
      const paint = performance.getEntriesByType('paint')
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
      if (fcp) {
        console.log('First Contentful Paint:', fcp.startTime.toFixed(2) + 'ms')
      }
    }

    window.addEventListener('load', logTiming)
    return () => window.removeEventListener('load', logTiming)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const predefinedQueries = [
    {
      id: 1,
      name: "Products by Category",
      description: "View all products grouped by their categories...",
      query: `SELECT 
        c.CategoryName,
        p.ProductName...`
    },
    {
      id: 2,
      name: "Order Details Analysis",
      category: "reports",
      description: "Recent orders with customer and employee information",
      query: `SELECT 
        o.OrderID,
        c.CompanyName as Customer,
        e.FirstName + ' ' + e.LastName as Employee,
        o.OrderDate,
        o.ShippedDate,
        o.Freight
      FROM Orders o
      JOIN Customers c ON o.CustomerID = c.CustomerID
      JOIN Employees e ON o.EmployeeID = e.EmployeeID
      ORDER BY o.OrderDate DESC
      LIMIT 5;`,
      results: {
        columns: ['OrderID', 'Customer', 'Employee', 'OrderDate', 'ShippedDate', 'Freight'],
        rows: [
          [11077, 'Rattlesnake Canyon Grocery', 'Anne Dodsworth', '1998-05-06', '1998-05-08', 8.53],
          [11076, 'Bon app\'', 'Margaret Peacock', '1998-05-06', '1998-05-09', 38.28],
          [11075, 'Richter Supermarkt', 'Janet Leverling', '1998-05-06', null, 6.19],
          [11074, 'Simons bistro', 'Robert King', '1998-05-06', '1998-05-08', 18.44],
          [11073, 'Pericles Comidas clásicas', 'Steven Buchanan', '1998-05-05', '1998-05-08', 24.95]
        ]
      }
    },
    {
      id: 3,
      name: "Sales by Territory",
      category: "analytics",
      description: "Analyze sales performance across different territories and regions",
      query: `SELECT 
        r.RegionDescription,
        t.TerritoryDescription,
        COUNT(DISTINCT o.OrderID) as TotalOrders,
        ROUND(SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)), 2) as TotalRevenue
      FROM Orders o
      JOIN Employees e ON o.EmployeeID = e.EmployeeID
      JOIN EmployeeTerritories et ON e.EmployeeID = et.EmployeeID
      JOIN Territories t ON et.TerritoryID = t.TerritoryID
      JOIN Region r ON t.RegionID = r.RegionID
      JOIN OrderDetails od ON o.OrderID = od.OrderID
      GROUP BY r.RegionDescription, t.TerritoryDescription
      ORDER BY TotalRevenue DESC;`,
      results: {
        columns: ['RegionDescription', 'TerritoryDescription', 'TotalOrders', 'TotalRevenue'],
        rows: [
          ['Eastern', 'Boston', 150, 125689.50],
          ['Western', 'Seattle', 142, 117489.25],
          ['Northern', 'Montreal', 135, 98654.75],
          ['Southern', 'Atlanta', 128, 88965.40],
          ['Eastern', 'New York', 125, 85742.30]
        ]
      }
    },
    {
      id: 4,
      name: "Top Selling Products",
      category: "reports",
      description: "View best-performing products by sales volume and revenue",
      query: `SELECT 
        p.ProductName,
        c.CategoryName,
        s.CompanyName as Supplier,
        SUM(od.Quantity) as UnitsSold,
        ROUND(SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)), 2) as Revenue
      FROM Products p
      JOIN Categories c ON p.CategoryID = c.CategoryID
      JOIN Suppliers s ON p.SupplierID = s.SupplierID
      JOIN OrderDetails od ON p.ProductID = od.ProductID
      GROUP BY p.ProductID, p.ProductName, c.CategoryName, s.CompanyName
      ORDER BY Revenue DESC
      LIMIT 5;`,
      results: {
        columns: ['ProductName', 'CategoryName', 'Supplier', 'UnitsSold', 'Revenue'],
        rows: [
          ['Gnocchi di nonna Alice', 'Pasta', 'Pasta Buttini s.r.l.', 3852, 42589.75],
          ['Ravioli Angelo', 'Pasta', 'Pasta Buttini s.r.l.', 3264, 38975.50],
          ['Camembert Pierrot', 'Dairy Products', 'Gai pâturage', 2856, 34856.25],
          ['Gorgonzola Telino', 'Dairy Products', 'Formaggi Fortini s.r.l.', 2672, 32458.60],
          ['Pavlova', 'Confections', 'Pavlova, Ltd.', 2568, 31789.40]
        ]
      }
    },
    {
      id: 5,
      name: "Shipping Analysis",
      category: "analytics",
      description: "Analyze shipping performance metrics including delivery times and freight costs",
      query: `SELECT 
        s.CompanyName as Shipper,
        COUNT(o.OrderID) as TotalOrders,
        ROUND(AVG(JULIANDAY(o.ShippedDate) - JULIANDAY(o.OrderDate)), 1) as AvgShipDays,
        ROUND(AVG(o.Freight), 2) as AvgFreight,
        ROUND(SUM(o.Freight), 2) as TotalFreight
      FROM Orders o
      JOIN Shippers s ON o.ShipVia = s.ShipperID
      WHERE o.ShippedDate IS NOT NULL
      GROUP BY s.ShipperID, s.CompanyName
      ORDER BY TotalOrders DESC;`,
      results: {
        columns: ['Shipper', 'TotalOrders', 'AvgShipDays', 'AvgFreight', 'TotalFreight'],
        rows: [
          ['Federal Shipping', 168, 3.2, 78.24, 13136.32],
          ['United Package', 154, 2.8, 65.64, 10108.56],
          ['Speedy Express', 145, 2.5, 58.35, 8460.75]
        ]
      }
    },
    {
      id: 6,
      name: "Large Dataset Demo",
      description: "Demonstrates virtual scrolling with 1000+ rows",
      query: `SELECT * FROM Orders 
        JOIN OrderDetails 
        JOIN Products 
        ORDER BY OrderDate DESC;`,
      results: {
        columns: ['OrderID', 'ProductName', 'Quantity', 'UnitPrice', 'OrderDate', 'ShipCountry'],
        rows: Array(1000).fill(null).map((_, index) => [
          10248 + index,
          `Product ${index + 1}`,
          Math.floor(Math.random() * 100),
          (Math.random() * 100).toFixed(2),
          '2024-03-' + (index % 30 + 1),
          ['USA', 'UK', 'France', 'Germany', 'Spain'][index % 5]
        ])
      }
    }
  ]

  const handleQueryChange = (query) => {
    setCurrentQuery(query)
    setError(null)
  }

  const validateQuery = (query) => {
    if (!query.trim()) {
      return 'Query cannot be empty'
    }
    const basicSyntaxRegex = /^SELECT\s+.+?\s+FROM\s+.+/i
    if (!basicSyntaxRegex.test(cleanedQuery)) {
      return 'Invalid SQL syntax'
    }
  }

  const handleQuerySubmit = async () => {
    // Clean the query before validation
    const cleanedQuery = cleanSqlQuery(currentQuery)
    const validationError = validateQuery(currentQuery)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
      
      // Find the most relevant predefined query based on keywords
      const queryLower = cleanedQuery.toLowerCase()
      if (queryLower.includes('territory') || queryLower.includes('region')) {
        setQueryResults({
          columns: ['RegionDescription', 'TerritoryDescription', 'TotalOrders', 'TotalRevenue'],
          rows: [
            ['Eastern', 'Boston', 150, 125689.50],
            ['Western', 'Seattle', 142, 117489.25],
            ['Northern', 'Montreal', 135, 98654.75],
            ['Southern', 'Atlanta', 128, 88965.40],
            ['Eastern', 'New York', 125, 85742.30]
          ]
        })
      } else if (queryLower.includes('product') || queryLower.includes('category')) {
        setQueryResults({
          columns: ['CategoryName', 'ProductName', 'UnitPrice', 'UnitsInStock', 'UnitsOnOrder'],
          rows: [
            ['Beverages', 'Chai', 18.00, 39, 0],
            ['Beverages', 'Chang', 19.00, 17, 40],
          ]
        })
      } else if (queryLower.includes('order') || queryLower.includes('customer')) {
        setQueryResults({
          columns: ['OrderID', 'Customer', 'Employee', 'OrderDate', 'ShippedDate', 'Freight'],
          rows: [
            [11077, 'Rattlesnake Canyon Grocery', 'Anne Dodsworth', '1998-05-06', '1998-05-08', 8.53],
            [11076, 'Bon app\'', 'Margaret Peacock', '1998-05-06', '1998-05-09', 38.28],
            [11075, 'Richter Supermarkt', 'Janet Leverling', '1998-05-06', null, 6.19],
            [11074, 'Simons bistro', 'Robert King', '1998-05-06', '1998-05-08', 18.44],
            [11073, 'Pericles Comidas clásicas', 'Steven Buchanan', '1998-05-05', '1998-05-08', 24.95]
          ]
        })
      } else if (queryLower.includes('ship') || queryLower.includes('freight')) {
        setQueryResults({
          columns: ['Shipper', 'TotalOrders', 'AvgShipDays', 'AvgFreight', 'TotalFreight'],
          rows: [
            ['Federal Shipping', 168, 3.2, 78.24, 13136.32],
            ['United Package', 154, 2.8, 65.64, 10108.56],
            ['Speedy Express', 145, 2.5, 58.35, 8460.75]
          ]
        })
      } else {
        // For unrecognized queries, show a message
        setError('Demo: This query type is not recognized. Try querying Products, Orders, Territories, or Shipping.')
        return
      }

      // Add to history
      const newHistory = [{
        query: currentQuery,
        timestamp: new Date().toISOString(),
        success: true
      }, ...queryHistory].slice(0, 10)
      setQueryHistory(newHistory)
      localStorage.setItem('queryHistory', JSON.stringify(newHistory))

    } catch (err) {
      setError('Failed to execute query: ' + err.message)
      const newHistory = [{
        query: currentQuery,
        timestamp: new Date().toISOString(),
        success: false
      }, ...queryHistory].slice(0, 10)
      setQueryHistory(newHistory)
      localStorage.setItem('queryHistory', JSON.stringify(newHistory))
    } finally {
      setLoading(false)
    }
  }

  const handleQuerySelect = (query) => {
    setCurrentQuery(query.query)
    setError(null)
    setIsEditorView(true)
    
    // Directly use the results from the predefined query
    setQueryResults(query.results)
  }

  const handleHistorySelect = (historyItem) => {
    setCurrentQuery(historyItem.query)
    setIsEditorView(true)
    // Clean and execute the query from history
    const cleanedQuery = cleanSqlQuery(historyItem.query)
    
    // Use cleaned query for matching
    const matchingQuery = predefinedQueries.find(q => 
      cleanSqlQuery(q.query) === cleanedQuery
    )

    if (matchingQuery) {
      setQueryResults(matchingQuery.results)
    } else {
      // Check patterns in cleaned query
      if (cleanedQuery.toLowerCase().includes('products')) {
        setQueryResults({
          columns: ['CategoryName', 'ProductName', 'UnitPrice', 'UnitsInStock', 'UnitsOnOrder'],
          rows: [
            ['Beverages', 'Chai', 18.00, 39, 0],
            ['Beverages', 'Chang', 19.00, 17, 40],
          ]
        })
      } else if (cleanedQuery.toLowerCase().includes('orders')) {
        setQueryResults({
          columns: ['OrderID', 'CustomerID', 'OrderDate', 'ShipCountry'],
          rows: [
            [10248, 'VINET', '1996-07-04', 'France'],
            [10249, 'TOMSP', '1996-07-05', 'Germany'],
            [10250, 'HANAR', '1996-07-08', 'Brazil'],
            [10251, 'VICTE', '1996-07-08', 'France'],
            [10252, 'SUPRD', '1996-07-09', 'Belgium']
          ]
        })
      } else if (cleanedQuery.toLowerCase().includes('customers')) {
        setQueryResults({
          columns: ['CustomerID', 'CompanyName', 'ContactName', 'Country'],
          rows: [
            ['ALFKI', 'Alfreds Futterkiste', 'Maria Anders', 'Germany'],
            ['ANATR', 'Ana Trujillo Emparedados', 'Ana Trujillo', 'Mexico'],
            ['ANTON', 'Antonio Moreno Taquería', 'Antonio Moreno', 'Mexico'],
            ['AROUT', 'Around the Horn', 'Thomas Hardy', 'UK'],
            ['BERGS', 'Berglunds snabbköp', 'Christina Berglund', 'Sweden']
          ]
        })
      }
    }
    setError(null)
  }

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <div className="app">
      <Navbar 
        isDarkMode={isDarkMode} 
        onThemeToggle={handleThemeToggle}
        isEditorView={isEditorView}
        onViewToggle={setIsEditorView}
      />
      <div className={`main-container ${isEditorView ? 'editor-view' : 'grid-view'}`}>
        {isEditorView ? (
          <>
            <div className="sidebar">
              <QuerySelector 
                queries={predefinedQueries} 
                onSelect={handleQuerySelect} 
              />
              <QueryHistory 
                history={queryHistory}
                onSelect={handleHistorySelect}
              />
            </div>
            <div className="content">
              <QueryEditor 
                value={currentQuery}
                onChange={handleQueryChange}
                onSubmit={handleQuerySubmit}
                loading={loading}
                isDarkMode={isDarkMode}
              />
              {error && <div className="error-message">{error}</div>}
              {loading ? <LoadingSpinner /> : queryResults && <ResultsTable results={queryResults} />}
            </div>
          </>
        ) : (
          <div className="queries-grid">
            {predefinedQueries.map(query => (
              <div 
                key={query.id} 
                className="query-card"
                onClick={() => handleQuerySelect(query)}
              >
                <h3>{query.name}</h3>
                <p className="query-description">{query.description}</p>
                <div className="query-preview-container">
                  <pre className="query-preview">
                    {query.query.split('\n')
                      .map(line => line.trim())
                      .filter(line => line)
                      .slice(0, 3)
                      .join('\n') + (query.query.split('\n').length > 3 ? '\n...' : '')}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
