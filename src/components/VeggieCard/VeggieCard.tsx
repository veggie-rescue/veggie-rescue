import styles from './VeggieCard.module.scss';

interface VeggieCardProps {
  name: string;
  description: string;
  daysUntilExpiry: number;
  imageEmoji?: string;
}

export default function VeggieCard({
  name,
  description,
  daysUntilExpiry,
  imageEmoji = '🥬',
}: Readonly<VeggieCardProps>) {
  const urgencyClass =
    daysUntilExpiry <= 1
      ? styles.urgent
      : daysUntilExpiry <= 3
        ? styles.warning
        : styles.fresh;

  return (
    <article className={styles.card}>
      <div className={styles.emoji}>{imageEmoji}</div>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.description}>{description}</p>
      <div className={`${styles.expiry} ${urgencyClass}`}>
        {daysUntilExpiry === 0
          ? 'Expires today!'
          : daysUntilExpiry === 1
            ? '1 day left'
            : `${daysUntilExpiry} days left`}
      </div>
    </article>
  );
}
