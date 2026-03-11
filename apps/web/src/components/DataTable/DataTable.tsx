import Table from '../Table/Table';
import styles from './DataTable.module.scss';

// TableProps are populated from SheetData
    // SheetData has the form of string[][] where
    // the first entry is the headers, and subsequent ones are
    // the data; they must be converted to Record<string,string>
    // prior to being passed into the component
interface TableProps {
    readonly headers: string[]; // headers
    readonly data: Record<string, string>[]; // spreadsheet values
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

    // Creates column headers
        // Assumes that all rows of data have the same headers
    const keyedHeaders = headers.map((header) => ({
        key: header.toLowerCase(),
        label: header
    }));

    // Create rows
    const rowData = data.map((row) => {
        const rowObject: Record<string, any> = {};

        Object.keys(row).forEach((key) => {
            rowObject[key] = row[key];
        });

        return rowObject;
    })

    return (
        <Table columns = {keyedHeaders} data = {rowData}/>
    );
}

export default DataTable;