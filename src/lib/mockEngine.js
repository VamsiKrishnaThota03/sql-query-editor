import { predefinedQueries, tables } from '../data/queries.js'

/** Strip comments and collapse whitespace. */
export function cleanSqlQuery(query) {
  return query
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

/** Returns an error message, or null when the query looks like a SELECT ... FROM ... */
export function validateQuery(query) {
  if (!query || !query.trim()) return 'Query cannot be empty.'
  const cleaned = cleanSqlQuery(query)
  if (!cleaned) return 'Query cannot be only comments.'
  if (!/^SELECT\s+.+?\s+FROM\s+.+/i.test(cleaned)) {
    return 'Only SELECT … FROM … queries are supported in this demo.'
  }
  return null
}

const normalize = (q) => cleanSqlQuery(q).replace(/;\s*$/, '').toLowerCase()

/** Pick a mock table from keywords in the query. */
function pickTable(lower) {
  if (/\bterritor|\bregion/.test(lower)) return tables.territories
  if (/\bshipper|\bfreight|\bship/.test(lower) && !/\border ?details?\b|orderid/.test(lower)) return tables.shipping
  if (/\bproducts?\b|\bcategor/.test(lower)) return tables.products
  if (/\borders?\b/.test(lower)) return tables.orders
  if (/\bcustomers?\b/.test(lower)) return tables.customers
  return null
}

/** Apply `WHERE col = 'value'` (single equality) and `LIMIT n` to a mock table. */
function applyClauses(table, cleaned) {
  let rows = table.rows
  const where = cleaned.match(/\bwhere\s+(?:\w+\.)?(\w+)\s*=\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?))/i)
  if (where) {
    const [, field, sq, dq, num] = where
    const value = sq ?? dq ?? num
    const index = table.columns.findIndex((c) => c.toLowerCase() === field.toLowerCase())
    if (index !== -1) {
      rows = rows.filter((row) => row[index] !== null && String(row[index]).toLowerCase() === String(value).toLowerCase())
    }
  }
  const limit = cleaned.match(/\blimit\s+(\d+)/i)
  if (limit) rows = rows.slice(0, Number(limit[1]))
  return { columns: table.columns, rows }
}

/**
 * "Execute" a query against the mock data.
 * Returns { columns, rows } or throws an Error with a user-facing message.
 */
export function runMockQuery(query) {
  const validationError = validateQuery(query)
  if (validationError) throw new Error(validationError)

  const target = normalize(query)
  const predefined = predefinedQueries.find((q) => normalize(q.query) === target)
  if (predefined) return predefined.results

  const cleaned = cleanSqlQuery(query)
  const table = pickTable(cleaned.toLowerCase())
  if (!table) {
    throw new Error('This demo has no data for that query. Try a query that mentions Products, Orders, Customers, Territories or Shippers.')
  }
  return applyClauses(table, cleaned)
}
