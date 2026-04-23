import { useId } from "react";

import styles from "../Table.module.scss";

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  isDisabled: boolean;
}

export function Toolbar({ 
  searchTerm, 
  onSearchChange, 
  onReset, 
  isDisabled 
}: TableToolbarProps) {
    const searchFieldId = useId();

    return (
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
                onChange={(event) => onSearchChange(event.target.value)}
            />
            </div>
            <button
                type="button"
                className={styles.resetButton}
                onClick={onReset}
                disabled={isDisabled}
            >
            Reset table
            </button>
        </div>
    )
}