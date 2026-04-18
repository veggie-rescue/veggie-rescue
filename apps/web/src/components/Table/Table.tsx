'use client';

import { type MouseEventHandler, useId, useState } from 'react';
import TableState from '../TableState/TableState';

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

function getSortableValue(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return trimmedValue;
  }

  const numericValue = Number(trimmedValue);

  if (!Number.isNaN(numericValue) && Number.isFinite(numericValue)) {
    return numericValue;
  }

  return trimmedValue.toLowerCase();
}

function compareValues(left: string, right: string) {
  const leftValue = getSortableValue(left);
  const rightValue = getSortableValue(right);

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return leftValue - rightValue;
  }

  return String(leftValue).localeCompare(String(rightValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function Table({
  columns,
  data,
  sortKey = null,
  sortDirection = 'asc',
  onSort,
}: Readonly<TableProps>) {
  const searchFieldId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const isTableReset = !searchTerm.trim() && sortKey === null;

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

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredRows = data.filter((row) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    return columns.some((column) =>
      (row[column.key] ?? '').toLowerCase().includes(normalizedSearchTerm)
    );
  });

  const sortedRows = [...filteredRows];

   if (sortKey) {
    sortedRows.sort((leftRow, rightRow) => {
      const key = sortKey;
      const comparison = compareValues(leftRow[key] ?? '', rightRow[sortKey] ?? '');

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const resultCountLabel = `${sortedRows.length} ${
    sortedRows.length === 1 ? 'row' : 'rows'
  } shown`;

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      sortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    sortKey = columnKey;
    sortDirection = 'asc';
  };

  const handleResetTable = () => {
    setSearchTerm('');
    sortKey = null;
    sortDirection = 'asc';
  };

  if (!columns.length || !data.length) {
    return (
      <TableState
        variant="empty"
        title="No table data"
        message="There is no data to show in this table yet."
      />
    );
  }

  return (
    <div className={styles.tableContainer}>
      {/* Search Bar */}
      <div className={styles.toolbar}>
        <div className={styles.searchGroup}>
          <label className={styles.searchLabel} htmlFor={searchFieldId}>
            Search table
          </label>
          <input
            id={searchFieldId}
            className={styles.searchInput}
            type="search"
            placeholder="Search rows"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleResetTable}
          disabled={isTableReset}
        >
          Reset table
        </button>
      </div>

      {/* Table */}
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
