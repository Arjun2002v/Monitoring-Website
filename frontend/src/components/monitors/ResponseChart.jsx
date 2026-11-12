import styles from "./ResponseChart.module.css";

/** Minimal SVG area chart of response times (oldest → newest). */
export function ResponseChart({ checks = [], height = 140 }) {
  const points = [...checks].reverse().filter((c) => c.responseTime != null);
  if (points.length < 2) {
    return <div className={styles.empty} style={{ height }}>Not enough checks yet to draw a chart.</div>;
  }

  const width = 600;
  const pad = 6;
  const max = Math.max(...points.map((p) => p.responseTime)) * 1.15;
  const x = (i) => pad + (i / (points.length - 1)) * (width - pad * 2);
  const y = (v) => height - pad - (v / max) * (height - pad * 2);

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.responseTime).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${height} L${x(0)},${height} Z`;

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={styles.svg} style={{ height }}>
        <defs>
          <linearGradient id="rt-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" x2={width} y1={height * t} y2={height * t} className={styles.grid} />
        ))}
        <path d={area} fill="url(#rt-fill)" />
        <path d={line} className={styles.line} vectorEffect="non-scaling-stroke" />
        {points.map((p, i) =>
          p.isUp ? null : <circle key={i} cx={x(i)} cy={y(p.responseTime)} r="3.5" className={styles.fail} />
        )}
      </svg>
      <span className={styles.max}>{Math.round(max)}ms</span>
    </div>
  );
}
