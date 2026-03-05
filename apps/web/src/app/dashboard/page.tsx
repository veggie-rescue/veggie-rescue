 'use client';

import { useEffect } from 'react';
import VeggieCard from '@/components/VeggieCard';
import { useTableData } from '@/context/TableDataContext';
import DataTable from '@/components/DataTable/DataTable';
import styles from './page.module.scss';

export default function Home() {
  const { fetchData } = useTableData();

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Veggie Rescue</h1>
      <p className={styles.description}>Rescuing vegetables, reducing waste.</p>

      <section className={styles.grid}></section>
      <DataTable />
    </main>
  );
}
