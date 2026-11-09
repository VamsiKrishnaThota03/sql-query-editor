// Mock data for the demo. Nothing here is fetched from a database.

const products = {
  columns: ['CategoryName', 'ProductName', 'UnitPrice', 'UnitsInStock', 'UnitsOnOrder'],
  rows: [
    ['Beverages', 'Chai', 18.0, 39, 0],
    ['Beverages', 'Chang', 19.0, 17, 40],
    ['Condiments', 'Aniseed Syrup', 10.0, 13, 70],
    ['Condiments', "Chef Anton's Cajun Seasoning", 22.0, 53, 0],
    ['Seafood', 'Boston Crab Meat', 18.4, 123, 0],
  ],
}

const orders = {
  columns: ['OrderID', 'Customer', 'Employee', 'OrderDate', 'ShippedDate', 'Freight'],
  rows: [
    [11077, 'Rattlesnake Canyon Grocery', 'Anne Dodsworth', '1998-05-06', '1998-05-08', 8.53],
    [11076, "Bon app'", 'Margaret Peacock', '1998-05-06', '1998-05-09', 38.28],
    [11075, 'Richter Supermarkt', 'Janet Leverling', '1998-05-06', null, 6.19],
    [11074, 'Simons bistro', 'Robert King', '1998-05-06', '1998-05-08', 18.44],
    [11073, 'Pericles Comidas clásicas', 'Steven Buchanan', '1998-05-05', '1998-05-08', 24.95],
  ],
}

const territories = {
  columns: ['RegionDescription', 'TerritoryDescription', 'TotalOrders', 'TotalRevenue'],
  rows: [
    ['Eastern', 'Boston', 150, 125689.5],
    ['Western', 'Seattle', 142, 117489.25],
    ['Northern', 'Montreal', 135, 98654.75],
    ['Southern', 'Atlanta', 128, 88965.4],
    ['Eastern', 'New York', 125, 85742.3],
  ],
}

const topProducts = {
  columns: ['ProductName', 'CategoryName', 'Supplier', 'UnitsSold', 'Revenue'],
  rows: [
    ['Gnocchi di nonna Alice', 'Pasta', 'Pasta Buttini s.r.l.', 3852, 42589.75],
    ['Ravioli Angelo', 'Pasta', 'Pasta Buttini s.r.l.', 3264, 38975.5],
    ['Camembert Pierrot', 'Dairy Products', 'Gai pâturage', 2856, 34856.25],
    ['Gorgonzola Telino', 'Dairy Products', 'Formaggi Fortini s.r.l.', 2672, 32458.6],
    ['Pavlova', 'Confections', 'Pavlova, Ltd.', 2568, 31789.4],
  ],
}

const shipping = {
  columns: ['Shipper', 'TotalOrders', 'AvgShipDays', 'AvgFreight', 'TotalFreight'],
  rows: [
    ['Federal Shipping', 168, 3.2, 78.24, 13136.32],
    ['United Package', 154, 2.8, 65.64, 10108.56],
    ['Speedy Express', 145, 2.5, 58.35, 8460.75],
  ],
}

const customers = {
  columns: ['CustomerID', 'CompanyName', 'ContactName', 'Country'],
  rows: [
    ['ALFKI', 'Alfreds Futterkiste', 'Maria Anders', 'Germany'],
    ['ANATR', 'Ana Trujillo Emparedados', 'Ana Trujillo', 'Mexico'],
    ['ANTON', 'Antonio Moreno Taquería', 'Antonio Moreno', 'Mexico'],
    ['AROUT', 'Around the Horn', 'Thomas Hardy', 'UK'],
    ['BERGS', 'Berglunds snabbköp', 'Christina Berglund', 'Sweden'],
  ],
}

/** Small deterministic PRNG so the large dataset is identical on every render and reload. */
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function buildLargeDataset(count = 1000) {
  const rand = seeded(42)
  const categories = ['Beverages', 'Condiments', 'Confections', 'Dairy Products', 'Seafood']
  const suppliers = ['Exotic Liquids', 'New Orleans Cajun Delights', 'Tokyo Traders', 'Svensk Sjöföda AB']
  const packs = ['10 boxes x 20 bags', '24 - 12 oz bottles', '12 - 550 ml bottles', '48 - 6 oz jars', '36 boxes']
  return {
    columns: ['ProductName', 'CategoryName', 'UnitPrice', 'UnitsInStock', 'UnitsOnOrder', 'Supplier', 'QuantityPerUnit'],
    rows: Array.from({ length: count }, (_, i) => [
      `Product ${i + 1}`,
      categories[i % categories.length],
      Math.round((5 + rand() * 95) * 100) / 100,
      Math.floor(rand() * 120),
      Math.floor(rand() * 60),
      suppliers[i % suppliers.length],
      packs[Math.floor(rand() * packs.length)],
    ]),
  }
}

export const tables = { products, orders, territories, topProducts, shipping, customers }

export const predefinedQueries = [
  {
    id: 1,
    name: 'Products by Category',
    category: 'analytics',
    description: 'All products grouped by category with inventory details',
    query: `SELECT
  c.CategoryName,
  p.ProductName,
  p.UnitPrice,
  p.UnitsInStock,
  p.UnitsOnOrder
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
ORDER BY c.CategoryName, p.ProductName;`,
    results: products,
  },
  {
    id: 2,
    name: 'Order Details Analysis',
    category: 'reports',
    description: 'Recent orders with customer and employee information',
    query: `SELECT
  o.OrderID,
  c.CompanyName AS Customer,
  e.FirstName + ' ' + e.LastName AS Employee,
  o.OrderDate,
  o.ShippedDate,
  o.Freight
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
JOIN Employees e ON o.EmployeeID = e.EmployeeID
ORDER BY o.OrderDate DESC
LIMIT 5;`,
    results: orders,
  },
  {
    id: 3,
    name: 'Sales by Territory',
    category: 'analytics',
    description: 'Sales performance across territories and regions',
    query: `SELECT
  r.RegionDescription,
  t.TerritoryDescription,
  COUNT(DISTINCT o.OrderID) AS TotalOrders,
  ROUND(SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)), 2) AS TotalRevenue
FROM Orders o
JOIN Employees e ON o.EmployeeID = e.EmployeeID
JOIN EmployeeTerritories et ON e.EmployeeID = et.EmployeeID
JOIN Territories t ON et.TerritoryID = t.TerritoryID
JOIN Region r ON t.RegionID = r.RegionID
JOIN OrderDetails od ON o.OrderID = od.OrderID
GROUP BY r.RegionDescription, t.TerritoryDescription
ORDER BY TotalRevenue DESC;`,
    results: territories,
  },
  {
    id: 4,
    name: 'Top Selling Products',
    category: 'reports',
    description: 'Best-performing products by sales volume and revenue',
    query: `SELECT
  p.ProductName,
  c.CategoryName,
  s.CompanyName AS Supplier,
  SUM(od.Quantity) AS UnitsSold,
  ROUND(SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)), 2) AS Revenue
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
JOIN Suppliers s ON p.SupplierID = s.SupplierID
JOIN OrderDetails od ON p.ProductID = od.ProductID
GROUP BY p.ProductID, p.ProductName, c.CategoryName, s.CompanyName
ORDER BY Revenue DESC
LIMIT 5;`,
    results: topProducts,
  },
  {
    id: 5,
    name: 'Shipping Analysis',
    category: 'analytics',
    description: 'Delivery times and freight costs per shipper',
    query: `SELECT
  s.CompanyName AS Shipper,
  COUNT(o.OrderID) AS TotalOrders,
  ROUND(AVG(JULIANDAY(o.ShippedDate) - JULIANDAY(o.OrderDate)), 1) AS AvgShipDays,
  ROUND(AVG(o.Freight), 2) AS AvgFreight,
  ROUND(SUM(o.Freight), 2) AS TotalFreight
FROM Orders o
JOIN Shippers s ON o.ShipVia = s.ShipperID
WHERE o.ShippedDate IS NOT NULL
GROUP BY s.ShipperID, s.CompanyName
ORDER BY TotalOrders DESC;`,
    results: shipping,
  },
  {
    id: 6,
    name: 'Large Dataset Demo',
    category: 'demo',
    description: '1,000 rows to show virtual scrolling',
    query: `SELECT
  p.ProductName,
  c.CategoryName,
  p.UnitPrice,
  p.UnitsInStock,
  p.UnitsOnOrder,
  s.CompanyName AS Supplier,
  p.QuantityPerUnit
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
JOIN Suppliers s ON p.SupplierID = s.SupplierID
ORDER BY c.CategoryName, p.ProductName;`,
    results: buildLargeDataset(),
  },
]
