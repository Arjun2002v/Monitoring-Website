import { SectionHeading } from "./SectionHeading";
import styles from "./StackBand.module.css";

const STACK = [
  { name: "Express", role: "REST API" },
  { name: "PostgreSQL", role: "Monitors, checks & incidents" },
  { name: "Prisma", role: "Typed data access" },
  { name: "Redis", role: "Job queue storage" },
  { name: "BullMQ", role: "Repeatable check jobs" },
  { name: "JWT", role: "Stateless auth" },
];

export function StackBand() {
  return (
    <section id="stack" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <SectionHeading
          align="left"
          eyebrow="Under the hood"
          title="Boring technology,"
          accent="on purpose."
          lead="Checks run as repeatable jobs on a queue, results land in Postgres, and the API stays fast no matter how many sites you watch."
        />
        <dl className={styles.list}>
          {STACK.map((s) => (
            <div key={s.name} className={styles.item}>
              <dt>{s.name}</dt>
              <dd>{s.role}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
