import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, ListChecks, Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { EmptyState } from "../components/ui/EmptyState";
import { StatusBadge } from "../components/monitors/StatusBadge";
import { StatCard } from "../components/monitors/StatCard";
import { UptimeBar } from "../components/monitors/UptimeBar";
import { ResponseChart } from "../components/monitors/ResponseChart";
import { ChecksTable } from "../components/monitors/ChecksTable";
import { MonitorFormModal } from "../components/monitors/MonitorFormModal";
import { ConfirmDeleteModal } from "../components/monitors/ConfirmDeleteModal";
import { useMonitors } from "../hooks/useMonitors";
import { useMonitorChecks } from "../hooks/useMonitorChecks";
import { monitorService } from "../services/monitorService";
import { formatInterval, formatMs, formatRelative } from "../utils/format";
import { PATHS } from "../routes/paths";
import styles from "./AppPage.module.css";

const FILTERS = [
  { value: "", label: "All" },
  { value: "UP", label: "Up" },
  { value: "DOWN", label: "Down" },
];

export default function MonitorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { monitors, loading, error, refresh, update, remove } = useMonitors();
  const checks = useMonitorChecks(id, { limit: 30 });
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState(null);

  const monitor = monitors.find((m) => String(m.id) === id);

  const summary = useMemo(() => {
    const list = checks.checks;
    if (!list.length) return { uptime: "—", avg: "—", last: "—" };
    const up = list.filter((c) => c.isUp).length;
    const avg = list.reduce((sum, c) => sum + (c.responseTime || 0), 0) / list.length;
    return {
      uptime: `${((up / list.length) * 100).toFixed(1)}%`,
      avg: formatMs(avg),
      last: formatRelative(list[0].checkedAt),
    };
  }, [checks.checks]);

  const runCheck = async () => {
    setRunning(true);
    setRunError(null);
    try {
      await monitorService.checkNow(monitor);
      await Promise.all([checks.reload(), refresh()]);
    } catch (err) {
      setRunError(err.message);
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <div className={styles.center}><Spinner size={22} /></div>;
  if (error) return <Alert>{error}</Alert>;
  if (!monitor) {
    return (
      <EmptyState
        title="Monitor not found"
        description="It may have been deleted, or the link is wrong."
        action={<Button to={PATHS.dashboard} variant="secondary" icon={ArrowLeft}>Back to monitors</Button>}
      />
    );
  }

  return (
    <>
      <Link to={PATHS.dashboard} className={styles.back}>
        <ArrowLeft size={15} /> All monitors
      </Link>

      <header className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{monitor.name}</h1>
            <StatusBadge status={monitor.status} />
          </div>
          <a href={monitor.url} target="_blank" rel="noreferrer" className={styles.url}>
            {monitor.url} <ExternalLink size={13} />
          </a>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>Edit</Button>
          <Button variant="secondary" icon={Trash2} onClick={() => setDeleteOpen(true)}>Delete</Button>
          <Button icon={Play} loading={running} onClick={runCheck}>Run check now</Button>
        </div>
      </header>

      {runError && <div style={{ marginTop: 16 }}><Alert>{runError}</Alert></div>}

      <section className={styles.stats}>
        <StatCard label="Uptime (shown checks)" value={summary.uptime} tone={monitor.status === "DOWN" ? "down" : "up"} />
        <StatCard label="Avg response" value={summary.avg} />
        <StatCard label="Last checked" value={summary.last} />
        <StatCard label="Check interval" value={formatInterval(monitor.interval)} />
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Response time</h2>
        </div>
        <div className={styles.panelBody}>
          <ResponseChart checks={checks.checks} height={180} />
          <div className={styles.uptimeRow}>
            <UptimeBar checks={checks.checks} slots={30} />
            <div className={styles.uptimeLegend}>
              <span>Older</span>
              <span>Most recent</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Check history</h2>
          <div className={styles.segmented} role="tablist" aria-label="Filter checks">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                role="tab"
                aria-selected={checks.status === f.value}
                className={`${styles.segment} ${checks.status === f.value ? styles.segmentActive : ""}`}
                onClick={() => checks.setStatus(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {checks.loading ? (
          <div className={styles.center}><Spinner size={22} /></div>
        ) : checks.error ? (
          <div className={styles.errorBox}><Alert>{checks.error}</Alert></div>
        ) : checks.checks.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No checks yet"
            description="The worker will record the first result on the next interval, or run one now."
          />
        ) : (
          <>
            <ChecksTable checks={checks.checks} />
            <div className={styles.pager}>
              <span>
                Page {checks.page} of {checks.totalPages} · {checks.total} checks
              </span>
              <div className={styles.pagerBtns}>
                <Button size="sm" variant="secondary" disabled={checks.page <= 1} onClick={() => checks.setPage(checks.page - 1)}>Previous</Button>
                <Button size="sm" variant="secondary" disabled={checks.page >= checks.totalPages} onClick={() => checks.setPage(checks.page + 1)}>Next</Button>
              </div>
            </div>
          </>
        )}
      </section>

      <MonitorFormModal open={editOpen} monitor={monitor} onClose={() => setEditOpen(false)} onSubmit={(v) => update(monitor.id, v)} />
      <ConfirmDeleteModal
        monitor={deleteOpen ? monitor : null}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async (m) => {
          await remove(m.id);
          navigate(PATHS.dashboard, { replace: true });
        }}
      />
    </>
  );
}
