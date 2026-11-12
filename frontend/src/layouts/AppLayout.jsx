import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
