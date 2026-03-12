import styles from './Table.module.scss';

interface DataRow {
    [key: string]: any;
}

interface TableProps {
    columns: string[];
    data: DataRow[];
}

function Table ({columns, data} : TableProps) {
    return (
        <div className = {styles.tableContainer}> 
            <table className = {styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={column}>
                                    {row[column]}
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