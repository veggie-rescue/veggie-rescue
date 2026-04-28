import type { DataRow, Column } from "../Table";

// Returns rows with a column matching the filter
export function filterRows(data: DataRow[], columns: Column[], filter: string) {
    if (!filter) {
        return data;
    }

    return data.filter((row) => {
        return columns.some((column) => {
            return (row[column.key] ?? '')
                .toLocaleLowerCase()
                .includes(filter);
        })
    })
}