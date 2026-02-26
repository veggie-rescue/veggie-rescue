import VeggieCard from '@/components/VeggieCard';
import DataTable from '@/components/DataTable/DataTable';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Veggie Rescue</h1>
      <p className={styles.description}>Rescuing vegetables, reducing waste.</p>

      <section className={styles.grid}>
        <VeggieCard
          name="Organic Carrots"
          description="Fresh locally-grown carrots, perfect for soups and salads."
          daysUntilExpiry={5}
          imageEmoji="🥕"
        />
        <VeggieCard
          name="Baby Spinach"
          description="Tender spinach leaves, great for smoothies."
          daysUntilExpiry={2}
          imageEmoji="🥬"
        />
        <VeggieCard
          name="Ripe Tomatoes"
          description="Vine-ripened tomatoes ready to use today."
          daysUntilExpiry={1}
          imageEmoji="🍅"
        />

        <DataTable />
      </section>
    </main>
  );
}
