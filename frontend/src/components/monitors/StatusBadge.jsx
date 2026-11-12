import styles from "./StatusBadge.module.css";

const LABELS = { UP: "Operational", DOWN: "Down", UNKNOWN: "Pending" };

export function StatusBadge({ status = "UNKNOWN", compact = false }) {
  const key = LABELS[status] ? status : "UNKNOWN";
  return (
    <span className={`${styles.badge} ${styles[key.toLowerCase()]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {compact ? key.charAt(0) + key.slice(1).toLowerCase() : LABELS[key]}
    </span>
  );
}
