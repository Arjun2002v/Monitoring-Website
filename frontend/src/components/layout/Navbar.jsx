import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../routes/paths";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#stack", label: "Under the hood" },
];

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <Logo />
          <nav className={styles.links} aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          {isAuthenticated ? (
            <Button to={PATHS.dashboard} size="sm">
              Open dashboard
            </Button>
          ) : (
            <>
              <Button to={PATHS.login} variant="ghost" size="sm" className={styles.login}>
                Log in
              </Button>
              <Button to={PATHS.register} size="sm">
                Sign up free
              </Button>
            </>
          )}
          <button
            className={styles.burger}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className={styles.mobile} aria-label="Mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          {!isAuthenticated && <a href={PATHS.login}>Log in</a>}
        </nav>
      )}
    </header>
  );
}
