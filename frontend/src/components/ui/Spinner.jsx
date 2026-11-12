import styles from "./Spinner.module.css";

export function Spinner({ size = 18, label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={styles.spinner}
      style={{ width: size, height: size }}
    />
  );
}
