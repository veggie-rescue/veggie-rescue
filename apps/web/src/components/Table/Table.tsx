import styles from './Table.module.scss';

interface Column {
    key: string;
    label: string;
}

interface DataRow {
    [key: string]: string;
}

interface TableProps {
    columns: Column[];
    data: DataRow[];
}

function Table ({columns, data} : TableProps) {
    return (
        <div className = {styles.tableContainer}>
            <table className = {styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
