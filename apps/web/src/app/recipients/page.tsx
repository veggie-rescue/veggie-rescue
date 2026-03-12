"use client";
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable/DataTable';

export default function Recipients() {
    // Loading and Error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch data
    const [sheetData, setSheetData] = useState([]);

    useEffect(() => {
        // TODO: adjust fetch route when the backend route changes
        async function fetchData() {
            try {
                const res = await fetch('http://localhost:3000/testing');

                if (!res.ok) {
                    throw new Error('HTTP error. Could not fetch data.');
                }

                const data = await res.json();
                setSheetData(data);
            }
            catch (err) {
                setError(true);
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <>
                <p>Loading...</p>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <p>Failed to fetch data.</p>
            </>
        );
    }

    // Pull headers from the objects
    const headers = Object.keys(sheetData[0]);

    return (
        <>
            <h1>Recipients</h1>
            <DataTable headers={headers} data={sheetData} />
        </>
    );
}