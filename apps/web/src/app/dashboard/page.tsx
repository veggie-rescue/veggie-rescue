 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTableData } from '@/context/TableDataContext';
import DataTable from '@/components/DataTable/DataTable';
import styles from './page.module.scss';

export default function Home() {
  const { data, isLoading, error, fetchData } = useTableData();
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    void fetchData();
  }, [fetchData, isAuthenticated, isHydrated, router]);

  if (!isHydrated) return <p>Loading data...</p>;
  if (!isAuthenticated) return <p>Redirecting to login...</p>;

  const values = data?.values ?? [];

  const headers = values[0] ?? [];

  const columns = headers.map((header) => ({
    key: header.toLowerCase(),
    label: header,
  }));

  const rows = values.slice(1).map((row) => {
    const rowObject: Record<string, string> = {};

    headers.forEach((header, index) => {
      const key = header.toLowerCase();
      rowObject[key] = row[index];
    });

    return rowObject;
  });

  if (isLoading) return <p>Loading data...</p>;
  if (error) return <p>Error loading data: {error}</p>;
  if (!values.length) return <p>No data available</p>;

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      <section className={styles.tableSection}>
        <DataTable columns={columns} data={rows} />
      </section>
    </main>
  );
}
