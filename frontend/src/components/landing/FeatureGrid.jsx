import { BellRing, Clock3, Gauge, History, ShieldCheck, Workflow } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import styles from "./FeatureGrid.module.css";

const FEATURES = [
  { icon: Clock3, title: "Checks on your schedule", body: "Every 30 seconds for checkout, every hour for the docs. Each monitor runs on its own interval." },
  { icon: Gauge, title: "Response time, every time", body: "Every request is timed and stored, so a slow week shows up before it turns into an outage." },
  { icon: BellRing, title: "Incidents open themselves", body: "The first failed check opens an incident. The first good one closes it and records the duration." },
  { icon: History, title: "Full check history", body: "Page through every check, filtered by up or down, with the HTTP status code that came back." },
  { icon: Workflow, title: "Queue-backed workers", body: "Checks run as BullMQ jobs on Redis, separate from the API, so a slow site never blocks a request." },
  { icon: ShieldCheck, title: "Private by default", body: "Your monitors sit behind JWT auth. Nothing is public unless you decide to share it." },
];

export function FeatureGrid() {
  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to"
          accent="sleep through the night."
          lead="No agents to install and no dashboards to learn. Add a URL and the rest happens in the background."
        />
        <div className={styles.grid}>
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className={styles.card}>
              <span className={styles.icon}><Icon size={18} strokeWidth={1.6} /></span>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.body}>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
