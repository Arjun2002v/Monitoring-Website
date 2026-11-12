import styles from "./EmptyState.module.css";

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className={styles.empty}>
      {Icon && (
        <span className={styles.icon}>
          <Icon size={20} strokeWidth={1.6} />
        </span>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
