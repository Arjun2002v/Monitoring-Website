import { Outlet } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import styles from "./AuthLayout.module.css";

export function AuthLayout() {
  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <header className={styles.header}>
        <Logo />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
