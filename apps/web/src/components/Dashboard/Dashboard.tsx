import Table from '../Table/Table';

function Dashboard () {
    // mockData will replaced with real data in the future
    const mockData = {
        values: [
            ['Name', 'Age', 'City'],
            ['Alice', '30', 'New York'],
            ['Bob', '25', 'San Francisco'],
            ['Charlie', '35', 'London'],
            ['Diana', '28', 'Tokyo'],
            ['Eve', '32', 'Paris'],
            ['Frank', '29', 'Berlin'],
            ['Grace', '31', 'Sydney'],
            ['Henry', '27', 'Toronto'],
            ['Iris', '33', 'Amsterdam'],
            ['Jack', '26', 'Seoul'],
        ]
    };

    const headers = mockData.values[0];
    const cols = headers.map((header) => ({
        key: header.toLowerCase(),
        label: header
    }));

    const data = mockData.values.slice(1).map((row) => {
        const rowObject: Record<string, any> = {};
        headers.forEach((header, index) => {
            const key = header.toLowerCase();
            rowObject[key] = row[index];
        });
        return rowObject;
    })

    return (
        <Table columns = {cols} data = {data}/>
    );
}

export default Dashboard;