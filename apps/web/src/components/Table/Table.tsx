import { useMemo, useState } from "react";
import TableState from "./TableState/TableState";
import { sortRows } from "./util/sortRows";
import { filterRows } from "./util/filterRows";
import { Toolbar } from "./Toolbar/Toolbar";

import styles from './Table.module.scss';

export interface Column {
  key: string;
  label: string;
}

export interface DataRow {
  [key: string]: string;
}

export type SortDirection = 'asc' | 'desc';

// Search bar is automatically on; can be toggled off when Table is created
interface TableProps {
  columns: Column[],
  data: DataRow[],
  toggleSearchBar?: boolean | null
}

export function Table({
    columns, 
    data, 
    toggleSearchBar = true
} : Readonly<TableProps>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const isTableReset = !searchTerm.trim() && sortKey === null;

    // Create sorted data
    const sortedRows = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
        const filteredRows = filterRows(data, columns, normalizedSearchTerm);

        return sortRows(filteredRows, sortDirection, sortKey ?? null);
    }, [data, columns, searchTerm, sortDirection, sortKey]);
    const hasNoSearchResults = sortedRows.length <= 0;

    // Handlers
    function handleSort(columnKey: string) {
        if (sortKey === columnKey) {
            setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
            return;
        }

        setSortKey(columnKey);
        setSortDirection('asc');
    };

    function handleResetTable() {
        setSearchTerm('');
        setSortKey(null);
        setSortDirection('asc');
    };

    // Semantic data
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

    // Empty Rows/Columns
    if (columns.length <= 0 || data.length <= 0) {
        return (
            <TableState
                variant="empty"
                title="No Table Data."
                message="There is no data to show."
            />
        )
    }

    // Populated Table
    return (
        <section className={styles.tableSection}>
            {/* Search Bar */}
            {toggleSearchBar  && (
                <Toolbar
                searchTerm={searchTerm}
                onReset={handleResetTable}
                onSearchChange={setSearchTerm}
                isDisabled={isTableReset}
            />
            )}
            

            {/* Meta Row */}
            <div className={styles.metaRow}>
                <p className={styles.resultCount}>{`${sortedRows.length} ${sortedRows.length === 1 ? 'row' : 'rows'} shown`}</p>
                <p className={styles.helperText}>
                    Click a column title to sort. Swipe sideways on smaller screens to see every
                    column.
                </p>
            </div>

            <div className={styles.tableContainer} aria-label="Scrollable data table">
                {/* No search results */}
                {hasNoSearchResults ? (
                    <TableState
                        compact
                        variant="empty"
                        title="No matching rows"
                        message="Try a different search term to find the row you need."
                    />
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                            {columns.map((column) => (
                                <th key={column.key} scope="col" aria-sort={getAriaSort(column.key)}>
                                    <button
                                        type="button"
                                        className={styles.sortButton}
                                        onClick={() => handleSort(column.key)}
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
                            {sortedRows.map((row, rowIndex) => (
                            <tr key={`${row[columns[0]?.key ?? 'row'] ?? 'row'}-${rowIndex}`}>
                                {columns.map((column) => (
                                <td key={column.key}>{row[column.key] ?? ''}</td>
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}
