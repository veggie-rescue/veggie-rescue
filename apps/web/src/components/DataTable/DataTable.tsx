'use client';

import { useId, useState } from 'react';

import Table, { type Column, type DataRow, type SortDirection } from '../Table/Table';
import TableState from '../TableState/TableState';
import styles from './DataTable.module.scss';

type DataTableProps = {
  columns: Column[];
  data: DataRow[];
};

function DataTable({ columns, data }: Readonly<DataTableProps>) {
  const searchFieldId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const isTableReset = !searchTerm.trim() && sortKey === null;

  

  

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

export default DataTable;
