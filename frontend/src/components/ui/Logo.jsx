import { Link } from "react-router-dom";
import { SITE } from "../../config/site";
import styles from "./Logo.module.css";

export function Logo({ to = "/" }) {
  return (
    <Link to={to} className={styles.logo} aria-label={`${SITE.name} home`}>
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1.5 10h4l2.2-5 4.6 10 2.2-5h4" />
        </svg>
      </span>
      <span className={styles.word}>{SITE.name.toLowerCase()}</span>
    </Link>
  );
}
