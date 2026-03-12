"use client";
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable/DataTable';

export default function Recipients() {
    const [sheetData, setSheetData] = useState([]);

    useEffect(() => {
        // TODO: adjust fetch route when the backend route changes
        async function fetchData() {
            const res = await fetch('http://localhost:3000/testing');
            const data = await res.json();

            setSheetData(data);
        }

        fetchData();
    }, []);

    // Ensure that the sheet data was fetched propely
    if (!sheetData || sheetData.length <= 0) {
        return (
            <DataTable headers={['No Data Found.']} data={[]} />
        )
    }

    const headers = Object.keys(sheetData[0]);

    return (
        <>
            <h1>Recipients</h1>
            <DataTable headers={headers} data={sheetData} />
        </>
    );
}