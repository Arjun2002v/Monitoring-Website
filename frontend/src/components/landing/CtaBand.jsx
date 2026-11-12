import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { PATHS } from "../../routes/paths";
import styles from "./CtaBand.module.css";

export function CtaBand() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.glow} aria-hidden="true" />
          <h2 className={styles.title}>
            Know before your <span className="serif-accent">customers do.</span>
          </h2>
          <p className={styles.lead}>Your first monitor takes less than a minute to set up.</p>
          <div className={styles.ctas}>
            <Button to={PATHS.register} size="lg" iconRight={ArrowRight}>Start monitoring free</Button>
            <Button to={PATHS.login} size="lg" variant="ghost" className={styles.ghost}>Log in</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
