import { StatusBadge } from "./StatusBadge";
import { formatDateTime, formatMs } from "../../utils/format";
import styles from "./MonitorTable.module.css";

export function ChecksTable({ checks }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Result</th>
            <th>HTTP status</th>
            <th>Response time</th>
            <th>Checked at</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.id}>
              <td><StatusBadge status={c.isUp ? "UP" : "DOWN"} compact /></td>
              <td className="mono">{c.statusCode ?? "—"}</td>
              <td className="mono">{formatMs(c.responseTime)}</td>
              <td className={styles.muted}>{formatDateTime(c.checkedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
