import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Veggie Rescue</h1>
      <p className={styles.description}>Rescuing vegetables, reducing waste.</p>
    </main>
  );
}
