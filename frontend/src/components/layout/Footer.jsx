import { Logo } from "../ui/Logo";
import { SITE } from "../../config/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.blurb}>{SITE.description}</p>
        </div>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {SITE.name}. Built with Express, PostgreSQL & BullMQ.
        </p>
      </div>
    </footer>
  );
}
