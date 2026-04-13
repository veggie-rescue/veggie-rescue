'use client';

import { useId, useState } from 'react';

import Table, { type Column, type DataRow, type SortDirection } from '../Table/Table';
import TableState from '../TableState/TableState';
import styles from '../Table/Table.module.scss';

type DataTableProps = {
  columns: Column[];
  data: DataRow[];
};

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

export function DataTable({ columns, data }: Readonly<DataTableProps>) {
  const searchFieldId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const isTableReset = !searchTerm.trim() && sortKey === null;

  if (!columns.length || !data.length) {
    return (
      <TableState
        variant="empty"
        title="No table data"
        message="There is no data to show in this table yet."
      />
    );
  }

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
      const comparison = compareValues(leftRow[sortKey] ?? '', rightRow[sortKey] ?? '');

      return sortDirection === 'asc' ? comparison : comparison * -1;
    });
  }

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setSortDirection((currentDirection) =>
        currentDirection === 'asc' ? 'desc' : 'asc'
      );
      return;
    }

    setSortKey(columnKey);
    setSortDirection('asc');
  };

  const handleResetTable = () => {
    setSearchTerm('');
    setSortKey(null);
    setSortDirection('asc');
  };

  const resultCountLabel = `${sortedRows.length} ${
    sortedRows.length === 1 ? 'row' : 'rows'
  } shown`;

  return (
    <section className={styles.wrapper}>
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

      <div className={styles.metaRow}>
        <p className={styles.resultCount}>{resultCountLabel}</p>
        <p className={styles.helperText}>
          Click a column title to sort. Swipe sideways on smaller screens to see every
          column.
        </p>
      </div>

      {sortedRows.length ? (
        <Table
          columns={columns}
          data={sortedRows}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : (
        <TableState
          compact
          variant="empty"
          title="No matching rows"
          message="Try a different search term to find the row you need."
        />
      )}
    </section>
  );
}