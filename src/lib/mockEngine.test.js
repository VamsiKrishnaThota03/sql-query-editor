import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanSqlQuery, runMockQuery, validateQuery } from './mockEngine.js'
import { predefinedQueries } from '../data/queries.js'

test('cleanSqlQuery strips comments and whitespace', () => {
  assert.equal(cleanSqlQuery('-- hi\nSELECT  *\n/* x */ FROM t'), 'SELECT * FROM t')
})

test('validateQuery rejects empty and non-SELECT queries', () => {
  assert.match(validateQuery(''), /empty/)
  assert.match(validateQuery('-- only a comment'), /comments/)
  assert.match(validateQuery('DELETE FROM Products'), /SELECT/)
  assert.equal(validateQuery('select * from products'), null)
})

test('predefined queries return their own result sets', () => {
  for (const q of predefinedQueries) {
    assert.deepEqual(runMockQuery(q.query), q.results)
  }
})

test('large dataset is deterministic and every row fills every column', () => {
  const large = predefinedQueries.find((q) => q.id === 6).results
  assert.equal(large.rows.length, 1000)
  for (const row of large.rows) assert.equal(row.length, large.columns.length)
})

test('keyword queries support WHERE equality and LIMIT', () => {
  const r = runMockQuery("SELECT * FROM Products WHERE CategoryName = 'Beverages'")
  assert.equal(r.rows.length, 2)
  const l = runMockQuery('SELECT * FROM Customers LIMIT 2')
  assert.equal(l.rows.length, 2)
  assert.equal(l.columns[0], 'CustomerID')
})

test('unknown tables raise a helpful error', () => {
  assert.throws(() => runMockQuery('SELECT * FROM Planets'), /no data/)
})
