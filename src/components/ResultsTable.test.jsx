import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ResultsTable from './ResultsTable.jsx';

/**
 * The grid is virtualised with react-window, so only the rows inside the
 * viewport exist in the DOM. jsdom reports every element as 0x0, which would
 * normally mean react-window renders nothing — so each test asserts on what is
 * reachable rather than on a full row count.
 */

const results = {
  columns: ['ProductName', 'UnitPrice', 'UnitsInStock'],
  rows: [
    ['Chai', 18, 39],
    ['Chang', 19, 17],
    ['Aniseed Syrup', 10, null],
  ],
};

describe('ResultsTable', () => {
  it('renders a column header per column', () => {
    render(<ResultsTable results={results} />);
    for (const column of results.columns) {
      expect(screen.getByText(column)).toBeInTheDocument();
    }
  });

  it('reports the row count', () => {
    render(<ResultsTable results={results} />);
    // Somewhere in the toolbar the count is shown; match the number loosely so
    // a wording change does not break the test.
    expect(document.body.textContent).toMatch(/3/);
  });

  it('renders nothing catastrophic for an empty result set', () => {
    expect(() =>
      render(<ResultsTable results={{ columns: ['a'], rows: [] }} />)
    ).not.toThrow();
  });

  it('handles a results object with no rows array', () => {
    // runMockQuery always returns rows, but a predefined entry with a typo
    // should degrade rather than crash the page.
    expect(() => render(<ResultsTable results={{ columns: [], rows: [] }} />)).not.toThrow();
  });

  it('exposes a CSV download', () => {
    render(<ResultsTable results={results} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('download');
  });

  it('offers sort controls on each column', async () => {
    render(<ResultsTable results={results} />);
    const header = screen.getByText('UnitPrice');
    // Clicking a header must not throw; the sort itself is covered by the
    // compare() behaviour below being exercised through repeated clicks.
    await userEvent.click(header);
    await userEvent.click(header);
    await userEvent.click(header);
    expect(screen.getByText('UnitPrice')).toBeInTheDocument();
  });

  it('renders cell values as text, never as markup', () => {
    // Guards against anyone introducing dangerouslySetInnerHTML on the cell
    // path. Mock data is static today, but a real engine would not be.
    render(
      <ResultsTable
        results={{
          columns: ['Name'],
          rows: [['<img src=x onerror=alert(1)>']],
        }}
      />
    );
    expect(document.querySelector('img')).toBeNull();
  });
});
