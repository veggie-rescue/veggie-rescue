'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/DataTable/DataTable';

const ACCESS_CODE_KEY = 'accessCode';

// Used to differentiate between an AbortError and other error types
function getErrorMessage(error: any): string {
    if (!(error instanceof Error)) {
      return 'Unknown error';
    }
    else if (error.name === 'AbortError') {
      return 'Fetch aborted.';
    } 
    else {
      return error.message;
    }
}

export default function Recipients() {
  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const [sheetData, setSheetData] = useState([]);

  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // TODO: adjust fetch route when the backend route changes
    async function fetchData() {
      try {
        const controller = new  AbortController();
        const signal = controller.signal;
        
        const accessCode = localStorage.getItem(ACCESS_CODE_KEY);
        if (!accessCode) {
          throw new Error('Missing access code. Please log in again.');
        }

        const res = await fetch('http://localhost:3000/recipients', { 
          signal, 
          headers: { Authorization: `Bearer ${accessCode}` },
        });

        if (res.status === 401) {
          logout();
          router.replace('/');
          return;
        }

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setSheetData(data);
      } catch (err) {
        const error = getErrorMessage(err);
        
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [logout, router]);

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
        <p>Failed to fetch data. Error: {error}</p>
      </>
    );
  }

  // Pull headers from the objects
  if (sheetData.length <= 0) {
    return <p>No Data Found.</p>;
  }

  const headers = Object.keys(sheetData[0]);
  const columns = headers.map((header) => ({
    key: header,
    label: header,
  }));

  return (
    <>
      <h1>Recipients</h1>
      <DataTable columns={columns} data={sheetData} />
    </>
  );
}
