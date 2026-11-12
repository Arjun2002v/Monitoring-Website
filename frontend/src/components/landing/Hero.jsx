import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { ProductPreview } from "./ProductPreview";
import { PATHS } from "../../routes/paths";
import styles from "./Hero.module.css";

const TABS = [
  { id: "monitors", label: "Monitors" },
  { id: "incidents", label: "Incidents" },
  { id: "latency", label: "Response time" },
];

const scrollToFeatures = () =>
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

export function Hero() {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <section className={styles.hero}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <a href="#how-it-works" className={styles.pill}>
          <span className={styles.pillNew}>New</span>
          Background checks now run on BullMQ workers
          <ArrowRight size={14} strokeWidth={2} />
        </a>

        <h1 className={styles.title}>
          The uptime monitor
          <br />
          your team will <span className={`serif-accent ${styles.accent}`}>actually read.</span>
        </h1>

        <p className={styles.lead}>
          Add a URL, pick how often to check it, and know the second it goes down, with every
          response time and incident kept on record.
        </p>

        <div className={styles.ctas}>
          <Button to={PATHS.register} size="lg">Start monitoring free</Button>
          <Button variant="secondary" size="lg" onClick={scrollToFeatures}>
            See how it works
          </Button>
        </div>

        <ul className={styles.meta}>
          <li>Free to self-host</li>
          <li>Checks every 30 seconds</li>
          <li>No credit card</li>
        </ul>

        <div className={styles.tabs} role="tablist" aria-label="Product preview">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`container ${styles.previewWrap}`}>
        <ProductPreview tab={tab} />
      </div>
    </section>
  );
}
