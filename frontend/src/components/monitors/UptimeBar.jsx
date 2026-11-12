import styles from "./UptimeBar.module.css";

/**
 * A row of thin bars, oldest → newest. `checks` items need `isUp`;
 * missing slots render as empty so a new monitor still shows a full-width bar.
 */
export function UptimeBar({ checks = [], slots = 30 }) {
  const recent = checks.slice(0, slots).reverse();
  const padded = [...Array(Math.max(0, slots - recent.length)).fill(null), ...recent];

  return (
    <div className={styles.bar} role="img" aria-label={`Last ${recent.length} checks`}>
      {padded.map((c, i) => (
        <span
          key={i}
          className={`${styles.tick} ${c == null ? styles.empty : c.isUp ? styles.up : styles.down}`}
          title={c ? `${c.isUp ? "Up" : "Down"}${c.responseTime != null ? ` · ${c.responseTime}ms` : ""}` : "No data"}
        />
      ))}
    </div>
  );
}
