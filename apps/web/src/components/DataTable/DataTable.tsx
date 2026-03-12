import Table from '../Table/Table';
import styles from './DataTable.module.scss';

interface TableProps {
    readonly headers: string[];
    readonly data: Record<string, string>[];
}

export function DataTable ({headers, data} : TableProps) {
    // Ensure that the data isn't empty
        // There is edge case where an empty object may exist in the array
    if (data.length <= 0 || Object.keys(data[0]).length <= 0) {
        return (
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        {headers.map((header) => {
                            return (<th>{header}</th>)
                        })}
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={headers.length}>{"Data Not Found."}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        )
    }

    return (
        <Table columns = {headers} data = {data}/>
    );
}

export default DataTable;