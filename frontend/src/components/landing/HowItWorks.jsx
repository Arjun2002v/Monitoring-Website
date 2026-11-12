import { SectionHeading } from "./SectionHeading";
import styles from "./HowItWorks.module.css";

const STEPS = [
  { title: "Add a URL", body: "Name it, paste the address and pick a check frequency. That's the whole setup." },
  { title: "We check it", body: "A background worker requests the URL on schedule and records status code and response time." },
  { title: "You hear about it", body: "When a check fails, an incident opens. When it recovers, it closes with the exact downtime." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="From URL to alert in"
          accent="three steps."
        />
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.body}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
