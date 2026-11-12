import styles from "./SectionHeading.module.css";

/** Eyebrow + headline (with optional serif accent) + lead, used by every landing section. */
export function SectionHeading({ eyebrow, title, accent, lead, align = "center" }) {
  return (
    <div className={`${styles.heading} ${styles[align]}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={styles.title}>
        {title} {accent && <span className="serif-accent">{accent}</span>}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}
