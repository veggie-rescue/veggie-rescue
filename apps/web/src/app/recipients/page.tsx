'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/DataTable/DataTable';

const ACCESS_CODE_KEY = 'accessCode';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Used to differentiate between an AbortError and other error types
function getErrorMessage(error: unknown): string {
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

// Ensure that the user is logged in
function getAccessCode() {
  const accessCode = localStorage.getItem(ACCESS_CODE_KEY);

  if (!accessCode) {
    throw new Error('Missing access code. Please log in again.');
  }

  return accessCode;
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
    const controller = new AbortController();

    async function fetchData() {
      try {
        const signal = controller.signal;

        const res = await fetch(`${API_BASE_URL}/recipients`, {
          headers: { Authorization: `Bearer ${getAccessCode()}` },
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
    return () => controller.abort();
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
