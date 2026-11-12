import { Bell, Gauge, LayoutGrid, Plus, Search, Siren } from "lucide-react";
import { StatusBadge } from "../monitors/StatusBadge";
import { UptimeBar } from "../monitors/UptimeBar";
import { ResponseChart } from "../monitors/ResponseChart";
import { PREVIEW_ALERTS, PREVIEW_INCIDENTS, PREVIEW_MONITORS } from "./previewData";
import styles from "./ProductPreview.module.css";

const SIDEBAR = [
  { icon: LayoutGrid, label: "Monitors", tab: "monitors" },
  { icon: Siren, label: "Incidents", tab: "incidents" },
  { icon: Gauge, label: "Response time", tab: "latency" },
];

function MonitorsView() {
  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.search}><Search size={13} /> Search monitors</div>
        <span className={styles.primaryChip}><Plus size={13} /> New monitor</span>
      </div>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <span>Monitor</span><span>Status</span><span className={styles.hideSm}>Last 40 checks</span><span className={styles.hideSm}>Avg</span>
        </div>
        {PREVIEW_MONITORS.map((m) => (
          <div key={m.id} className={styles.row}>
            <span className={styles.mName}>
              <strong>{m.name}</strong>
              <em>{m.host}</em>
            </span>
            <span><StatusBadge status={m.status} /></span>
            <span className={styles.hideSm}><UptimeBar checks={[...m.checks].reverse()} slots={40} /></span>
            <span className={`mono ${styles.hideSm}`}>{m.avg}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function IncidentsView() {
  return (
    <div className={styles.incidents}>
      {PREVIEW_INCIDENTS.map((i) => (
        <div key={i.id} className={styles.incident}>
          <span className={`${styles.incDot} ${i.open ? styles.incOpen : ""}`} />
          <div>
            <strong>{i.monitor}</strong>
            <p>{i.started}</p>
          </div>
          <span className={`${styles.incDur} ${i.open ? styles.incDurOpen : ""}`}>{i.duration}</span>
        </div>
      ))}
    </div>
  );
}

function LatencyView() {
  const m = PREVIEW_MONITORS[1];
  return (
    <div className={styles.latency}>
      <div className={styles.latencyHead}>
        <div>
          <strong>{m.name}</strong>
          <p className="mono">{m.host}</p>
        </div>
        <div className={styles.kpis}>
          <span><em>p50</em>212ms</span>
          <span><em>p95</em>1.08s</span>
          <span><em>Uptime</em>90.0%</span>
        </div>
      </div>
      <ResponseChart checks={[...m.checks].reverse()} height={200} />
    </div>
  );
}

const VIEWS = { monitors: MonitorsView, incidents: IncidentsView, latency: LatencyView };
const TITLES = { monitors: "Monitors", incidents: "Incidents", latency: "Response time" };

export function ProductPreview({ tab }) {
  const View = VIEWS[tab] ?? MonitorsView;

  return (
    <div className={styles.stage}>
      <div className={styles.app}>
        <span className={styles.chip}><span className={styles.live} /> Web app</span>
        <aside className={styles.side}>
          <p className={styles.sideLabel}>Monitoring</p>
          {SIDEBAR.map(({ icon: Icon, label, tab: t }) => (
            <span key={t} className={`${styles.sideItem} ${t === tab ? styles.sideActive : ""}`}>
              <Icon size={14} strokeWidth={1.75} /> {label}
            </span>
          ))}
        </aside>
        <div className={styles.main}>
          <div className={styles.crumbs}>
            <span>Workspace</span> <span>/</span> <strong>{TITLES[tab]}</strong>
          </div>
          <div key={tab} className={styles.view}>
            <View />
          </div>
        </div>
      </div>

      <div className={styles.phone}>
        <span className={`${styles.chip} ${styles.chipDark}`}><Bell size={12} /> Alerts</span>
        <div className={styles.clock} aria-hidden="true">
          <span>Tuesday, 14:03</span>
          <strong>14:03</strong>
        </div>
        <div className={styles.notifs}>
          {PREVIEW_ALERTS.map((a) => (
            <div key={a.id} className={styles.notif}>
              <span className={`${styles.nDot} ${styles[a.tone]}`} />
              <div>
                <strong>{a.title}</strong>
                <p>{a.body}</p>
              </div>
              <time>{a.time}</time>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
