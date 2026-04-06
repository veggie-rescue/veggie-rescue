import Table from '../Table/Table';

    // mockData will replaced with real data in the future
    // const mockData = {
    //     values: [
    //         ['Name', 'Age', 'City'],
    //         ['Alice', '30', 'New York'],
    //         ['Bob', '25', 'San Francisco'],
    //         ['Charlie', '35', 'London'],
    //         ['Diana', '28', 'Tokyo'],
    //         ['Eve', '32', 'Paris'],
    //         ['Frank', '29', 'Berlin'],
    //         ['Grace', '31', 'Sydney'],
    //         ['Henry', '27', 'Toronto'],
    //         ['Iris', '33', 'Amsterdam'],
    //         ['Jack', '26', 'Seoul'],
    //     ]
    // };

    type DataTableProps = {
        columns : {key: string, label: string}[];
        data: Record<string, string>[];
    };

    function DataTable({ columns, data }: DataTableProps) {
        return <Table columns={columns} data={data} />;
    }

export default DataTable;
