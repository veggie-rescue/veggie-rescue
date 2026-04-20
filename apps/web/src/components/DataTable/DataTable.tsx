'use client';

import Table, { type Column, type DataRow } from '../Table/Table';

type DataTableProps = {
  data: DataRow[];
};

function DataTable({ data }: Readonly<DataTableProps>) {
  const HEADERS: Column[] = [
		{key: "recipient", label: "Recipient"},
		{key: "lastDelivery", label: "Last Delivery"},
		{key:"daysSinceLastDelivery", label: "Days Since Last Delivery"},
		{key: "totalDeliveriesThisMonth", label: "Total Deliveries This Month"},
		{key: "totalPoundsThisMonth", label: "Total Pounds This Month"},
		{key: "totalDeliveriesThisYear", label: "Total Deliveries This Year"},
		{key: "totalPoundsThisYear", label: "Total Pounds This Year"},
		{key: "avgPoundsPerDelivery", label: "Average Pounds Per Delivery"},
		{key: "priorityLevel", label: "Priority Level"},
		{key: "deliveryFrequency", label: "Delivery Frequency"},
		{key: "location", label: "Location"}
	]
  return (
    <Table
      columns={HEADERS}
      data={data}
    />
  );
}

export default DataTable;
