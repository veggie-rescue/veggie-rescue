import styles from './TableState.module.scss';

type TableStateVariant = 'loading' | 'error' | 'empty';

type TableStateProps = {
  title: string;
  message: string;
  variant?: TableStateVariant;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
};

const variantLabels: Record<TableStateVariant, string> = {
  loading: 'Loading',
  error: 'Error',
  empty: 'Empty state',
};

export default function TableState({
  title,
  message,
  variant = 'empty',
  actionLabel,
  onAction,
  compact = false,
}: Readonly<TableStateProps>) {
  const role = variant === 'error' ? 'alert' : 'status';
  const liveMode = variant === 'error' ? 'assertive' : 'polite';
  const className = [
    styles.stateCard,
    styles[variant],
    compact ? styles.compact : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={className} role={role} aria-live={liveMode}>
      <div className={styles.stateBody}>
        <span className={styles.badge}>
          <span
            className={[
              styles.badgeDot,
              variant === 'loading' ? styles.loadingDot : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          />
          {variantLabels[variant]}
        </span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        {actionLabel && onAction ? (
          <button type="button" className={styles.actionButton} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
