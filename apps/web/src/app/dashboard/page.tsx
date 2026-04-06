'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTableData } from '@/context/TableDataContext';
import DataTable from '@/components/DataTable/DataTable';
import TableState from '@/components/TableState/TableState';
import styles from './page.module.scss';

export default function DashboardPage() {
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

  const values = data?.values ?? [];
  const headers = values[0] ?? [];
  const rows = values.slice(1);

  if (!isHydrated) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
        <TableState
          variant="loading"
          title="Loading dashboard"
          message="Checking access and preparing your dashboard view."
        />
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading && !values.length) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
        <TableState
          variant="loading"
          title="Loading dashboard"
          message="Fetching the latest sheet data for this view."
        />
      </main>
    );
  }

  if (error && !values.length) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
        <TableState
          variant="error"
          title="Unable to load dashboard"
          message={error}
          actionLabel="Try again"
          onAction={() => void fetchData()}
        />
      </main>
    );
  }

  if (!headers.length || !rows.length) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
        <TableState
          variant="empty"
          title="No dashboard data"
          message="This table is empty right now. Check back after more data is added."
        />
      </main>
    );
  }

  const columns = headers.map((header) => ({
    key: header.toLowerCase(),
    label: header,
  }));

  const tableRows = rows.map((row) => {
    const rowObject: Record<string, string> = {};

    headers.forEach((header, index) => {
      rowObject[header.toLowerCase()] = row[index] ?? '';
    });

    return rowObject;
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      <section className={styles.tableSection}>
        {isLoading ? (
          <p className={styles.statusBanner}>Refreshing data...</p>
        ) : error ? (
          <p className={`${styles.statusBanner} ${styles.statusBannerWarning}`}>
            Showing saved data. Latest fetch failed.
          </p>
        ) : null}
        <DataTable columns={columns} data={tableRows} />
      </section>
    </main>
  );
}
