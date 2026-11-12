import { NavLink } from "react-router-dom";
import { Activity, LayoutGrid, LogOut } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../routes/paths";
import styles from "./Sidebar.module.css";

const NAV = [
  { to: PATHS.dashboard, label: "Monitors", icon: LayoutGrid, end: false },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const initials = (user?.name || user?.email || "?").slice(0, 1).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Logo to={PATHS.dashboard} />
      </div>

      <p className={styles.section}>Monitoring</p>
      <nav className={styles.nav}>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
        <span className={`${styles.item} ${styles.disabled}`} title="Coming soon">
          <Activity size={16} strokeWidth={1.75} />
          Incidents
          <span className={styles.soon}>Soon</span>
        </span>
      </nav>

      <div className={styles.user}>
        <span className={styles.avatar}>{initials}</span>
        <div className={styles.who}>
          <strong>{user?.name || "Account"}</strong>
          <span>{user?.email}</span>
        </div>
        <button className={styles.logout} onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={16} strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
}
