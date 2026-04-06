import type { MouseEventHandler } from 'react';

import styles from './Table.module.scss';

export interface Column {
  key: string;
  label: string;
}

export interface DataRow {
  [key: string]: string;
}

export type SortDirection = 'asc' | 'desc';

interface TableProps {
  columns: Column[];
  data: DataRow[];
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (columnKey: string) => void;
}

function Table({
  columns,
  data,
  sortKey = null,
  sortDirection = 'asc',
  onSort,
}: Readonly<TableProps>) {
  const getSortIndicator = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return '';
    }

    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getAriaSort = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return 'none';
    }

    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const createSortHandler = (columnKey: string): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      onSort?.(columnKey);
    };
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" aria-sort={getAriaSort(column.key)}>
                <button
                  type="button"
                  className={styles.sortButton}
                  onClick={createSortHandler(column.key)}
                  aria-label={`Sort by ${column.label}`}
                >
                  <span>{column.label}</span>
                  <span className={styles.sortIndicator} aria-hidden="true">
                    {getSortIndicator(column.key)}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={`${row[columns[0]?.key ?? 'row'] ?? 'row'}-${rowIndex}`}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
