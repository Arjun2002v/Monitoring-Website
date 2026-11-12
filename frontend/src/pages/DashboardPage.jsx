import { useMemo, useState } from "react";
import { Plus, RefreshCw, Radar } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { EmptyState } from "../components/ui/EmptyState";
import { StatCard } from "../components/monitors/StatCard";
import { MonitorTable } from "../components/monitors/MonitorTable";
import { MonitorFormModal } from "../components/monitors/MonitorFormModal";
import { ConfirmDeleteModal } from "../components/monitors/ConfirmDeleteModal";
import { useMonitors } from "../hooks/useMonitors";
import { useAuth } from "../hooks/useAuth";
import styles from "./AppPage.module.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const { monitors, loading, error, refresh, create, update, remove } = useMonitors();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const stats = useMemo(() => {
    const count = (s) => monitors.filter((m) => m.status === s).length;
    return { total: monitors.length, up: count("UP"), down: count("DOWN"), pending: count("UNKNOWN") };
  }, [monitors]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setFormOpen(true);
  };

  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{firstName ? `Hi, ${firstName}` : "Monitors"}</h1>
          <p className={styles.subtitle}>
            {stats.down > 0
              ? `${stats.down} of ${stats.total} monitors need attention.`
              : stats.total > 0
                ? "Everything you're watching is reachable."
                : "Add a URL to start watching it."}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" icon={RefreshCw} onClick={refresh}>Refresh</Button>
          <Button icon={Plus} onClick={openCreate}>New monitor</Button>
        </div>
      </header>

      <section className={styles.stats}>
        <StatCard label="Total monitors" value={stats.total} />
        <StatCard label="Operational" value={stats.up} tone="up" />
        <StatCard label="Down" value={stats.down} tone={stats.down ? "down" : undefined} />
        <StatCard label="Pending first check" value={stats.pending} />
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <h2 className={styles.panelTitle}>All monitors</h2>
        </div>

        {loading ? (
          <div className={styles.center}><Spinner size={22} /></div>
        ) : error ? (
          <div className={styles.errorBox}>
            <Alert>{error}</Alert>
            <Button variant="secondary" size="sm" onClick={refresh}>Try again</Button>
          </div>
        ) : monitors.length === 0 ? (
          <EmptyState
            icon={Radar}
            title="No monitors yet"
            description="Add your first URL. We'll check it on schedule and tell you the moment it stops responding."
            action={<Button icon={Plus} onClick={openCreate}>Add your first monitor</Button>}
          />
        ) : (
          <MonitorTable monitors={monitors} onEdit={openEdit} onDelete={setDeleting} />
        )}
      </section>

      <MonitorFormModal
        open={formOpen}
        monitor={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(values) => (editing ? update(editing.id, values) : create(values))}
      />
      <ConfirmDeleteModal monitor={deleting} onClose={() => setDeleting(null)} onConfirm={(m) => remove(m.id)} />
    </>
  );
}
