import { describe, expect, it } from 'vitest';
import { cleanSqlQuery, runMockQuery, validateQuery } from './mockEngine.js';
import { predefinedQueries } from '../data/queries.js';

describe('cleanSqlQuery', () => {
  it('strips line comments, block comments and collapses whitespace', () => {
    expect(cleanSqlQuery('-- hi\nSELECT  *\n/* x */ FROM t')).toBe('SELECT * FROM t');
  });

  it('removes a block comment spanning multiple lines', () => {
    expect(cleanSqlQuery('SELECT *\n/* one\n   two */\nFROM t')).toBe('SELECT * FROM t');
  });

  it('normalises whitespace in a query with no comments', () => {
    expect(cleanSqlQuery('  SELECT   a,  b   FROM   t  ')).toBe('SELECT a, b FROM t');
  });
});

describe('validateQuery', () => {
  it('rejects an empty, whitespace-only or missing query', () => {
    expect(validateQuery('')).toMatch(/empty/);
    expect(validateQuery('   ')).toMatch(/empty/);
    expect(validateQuery(null)).toMatch(/empty/);
  });

  it('rejects a query that is only comments', () => {
    expect(validateQuery('-- only a comment')).toMatch(/comments/);
    expect(validateQuery('/* nothing here */')).toMatch(/comments/);
  });

  it('rejects anything that is not SELECT ... FROM ...', () => {
    // The editor is a read-only demo over mock data. Accepting a DELETE or
    // DROP would imply it does something it does not.
    for (const query of [
      'DELETE FROM Products',
      'DROP TABLE Products',
      'UPDATE Products SET UnitPrice = 0',
      'INSERT INTO Products VALUES (1)',
      'SELECT 1',
    ]) {
      expect(validateQuery(query), `${query} should be rejected`).toMatch(/SELECT/);
    }
  });

  it('accepts a valid SELECT regardless of case', () => {
    expect(validateQuery('select * from products')).toBeNull();
    expect(validateQuery('SELECT * FROM Products')).toBeNull();
  });
});

describe('runMockQuery predefined queries', () => {
  it("returns each predefined query's own result set verbatim", () => {
    for (const q of predefinedQueries) {
      expect(runMockQuery(q.query)).toStrictEqual(q.results);
    }
  });

  it('matches a predefined query despite comments, casing and a trailing semicolon', () => {
    const first = predefinedQueries[0];
    const noisy = `-- a comment\n${first.query.toUpperCase()}  ;`;
    expect(runMockQuery(noisy)).toStrictEqual(first.results);
  });

  it('keeps the large dataset deterministic and rectangular', () => {
    // The virtualised grid assumes every row has one cell per column; a ragged
    // row would render as a blank or shifted column rather than an error.
    const large = predefinedQueries.find((q) => q.id === 6).results;
    expect(large.rows).toHaveLength(1000);
    for (const row of large.rows) {
      expect(row).toHaveLength(large.columns.length);
    }
  });
});

describe('runMockQuery keyword fallback', () => {
  it('applies a WHERE equality filter', () => {
    const result = runMockQuery("SELECT * FROM Products WHERE CategoryName = 'Beverages'");
    expect(result.rows.length).toBeGreaterThan(0);
    const index = result.columns.indexOf('CategoryName');
    for (const row of result.rows) {
      expect(String(row[index]).toLowerCase()).toBe('beverages');
    }
  });

  it('matches WHERE values case-insensitively', () => {
    const upper = runMockQuery("SELECT * FROM Products WHERE CategoryName = 'Beverages'");
    const lower = runMockQuery("SELECT * FROM Products WHERE CategoryName = 'beverages'");
    expect(lower.rows).toStrictEqual(upper.rows);
  });

  it('accepts a double-quoted WHERE value', () => {
    const quoted = runMockQuery('SELECT * FROM Products WHERE CategoryName = "Beverages"');
    expect(quoted.rows.length).toBeGreaterThan(0);
  });

  it('accepts a numeric WHERE value without throwing', () => {
    expect(() => runMockQuery('SELECT * FROM Orders WHERE OrderID = 10248')).not.toThrow();
  });

  it('ignores a WHERE clause naming a column that does not exist', () => {
    // Returning everything is the documented behaviour. Silently returning
    // zero rows would look like missing data rather than an unsupported query.
    const all = runMockQuery('SELECT * FROM Products');
    const bogus = runMockQuery("SELECT * FROM Products WHERE NoSuchColumn = 'x'");
    expect(bogus.rows).toHaveLength(all.rows.length);
  });

  it('applies LIMIT', () => {
    const result = runMockQuery('SELECT * FROM Customers LIMIT 2');
    expect(result.rows).toHaveLength(2);
    expect(result.columns).toContain('CustomerID');
  });

  it('combines WHERE and LIMIT', () => {
    const result = runMockQuery(
      "SELECT * FROM Products WHERE CategoryName = 'Beverages' LIMIT 1"
    );
    expect(result.rows).toHaveLength(1);
  });

  it('routes a query to the table its keywords name', () => {
    expect(runMockQuery('SELECT * FROM Territories').columns).toContain('TerritoryDescription');
    expect(runMockQuery('SELECT * FROM Shippers').columns).toContain('Shipper');
    expect(runMockQuery('SELECT * FROM Orders').columns).toContain('OrderID');
    expect(runMockQuery('SELECT * FROM Customers').columns).toContain('CustomerID');
    expect(runMockQuery('SELECT * FROM Products').columns).toContain('ProductName');
  });

  it('prefers orders over shipping for an order-details query', () => {
    // 'ship' matches both tables; the orderid guard is what disambiguates.
    const result = runMockQuery('SELECT OrderID, Freight FROM Orders');
    expect(result.columns).toContain('OrderID');
  });
});

describe('runMockQuery errors', () => {
  it('raises a helpful error naming the available tables', () => {
    expect(() => runMockQuery('SELECT * FROM Planets')).toThrow(/no data/);
    expect(() => runMockQuery('SELECT * FROM Planets')).toThrow(/Products/);
  });

  it('propagates validation errors rather than returning an empty set', () => {
    expect(() => runMockQuery('DELETE FROM Products')).toThrow(/SELECT/);
    expect(() => runMockQuery('')).toThrow(/empty/);
  });

  it('never mutates the underlying mock tables', () => {
    // applyClauses filters and slices, both of which copy. A mutation here
    // would make results depend on the order queries happened to run in.
    const before = runMockQuery('SELECT * FROM Products').rows.length;
    runMockQuery("SELECT * FROM Products WHERE CategoryName = 'Beverages'");
    runMockQuery('SELECT * FROM Products LIMIT 1');
    expect(runMockQuery('SELECT * FROM Products').rows).toHaveLength(before);
  });
});
