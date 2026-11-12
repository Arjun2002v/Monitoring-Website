import { Link } from "react-router-dom";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatInterval, formatRelative, hostOf } from "../../utils/format";
import { PATHS } from "../../routes/paths";
import styles from "./MonitorTable.module.css";

export function MonitorTable({ monitors, onEdit, onDelete }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Monitor</th>
            <th>Status</th>
            <th>Interval</th>
            <th>Created</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {monitors.map((m) => (
            <tr key={m.id}>
              <td>
                <Link to={PATHS.monitor(m.id)} className={styles.name}>
                  <span className={styles.favicon}>{(m.name || "?").charAt(0).toUpperCase()}</span>
                  <span className={styles.nameText}>
                    <strong>{m.name}</strong>
                    <span className={styles.host}>{hostOf(m.url)}</span>
                  </span>
                </Link>
              </td>
              <td><StatusBadge status={m.status} /></td>
              <td className="mono">{formatInterval(m.interval)}</td>
              <td className={styles.muted}>{formatRelative(m.createdAt)}</td>
              <td>
                <div className={styles.actions}>
                  <a href={m.url} target="_blank" rel="noreferrer" className={styles.icon} aria-label={`Open ${m.name}`}>
                    <ExternalLink size={15} strokeWidth={1.75} />
                  </a>
                  <button className={styles.icon} onClick={() => onEdit(m)} aria-label={`Edit ${m.name}`}>
                    <Pencil size={15} strokeWidth={1.75} />
                  </button>
                  <button className={`${styles.icon} ${styles.danger}`} onClick={() => onDelete(m)} aria-label={`Delete ${m.name}`}>
                    <Trash2 size={15} strokeWidth={1.75} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
