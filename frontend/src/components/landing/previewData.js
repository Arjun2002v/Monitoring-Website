// Illustrative sample data for the landing-page product preview only.

// Deterministic pseudo-random so the preview looks identical on every render.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeChecks(seed, { base, jitter, downAt = [] }) {
  const rand = seeded(seed);
  return Array.from({ length: 40 }, (_, i) => ({
    isUp: !downAt.includes(i),
    responseTime: Math.round(base + rand() * jitter + (downAt.includes(i) ? 900 : 0)),
  }));
}

export const PREVIEW_MONITORS = [
  { id: 1, name: "Marketing site", host: "www.acme.dev", status: "UP", interval: "30s", avg: "142ms",
    checks: makeChecks(3, { base: 110, jitter: 70 }) },
  { id: 2, name: "Checkout API", host: "api.acme.dev/checkout", status: "DOWN", interval: "30s", avg: "1.24s",
    checks: makeChecks(7, { base: 180, jitter: 90, downAt: [0, 1, 2, 17] }) },
  { id: 3, name: "Auth service", host: "auth.acme.dev", status: "UP", interval: "1m", avg: "88ms",
    checks: makeChecks(11, { base: 70, jitter: 40, downAt: [26] }) },
  { id: 4, name: "Docs", host: "docs.acme.dev", status: "UP", interval: "5m", avg: "203ms",
    checks: makeChecks(19, { base: 160, jitter: 90 }) },
  { id: 5, name: "Status webhook", host: "hooks.acme.dev/status", status: "UNKNOWN", interval: "15m", avg: "—",
    checks: [] },
];

export const PREVIEW_INCIDENTS = [
  { id: 1, monitor: "Checkout API", started: "Today, 14:02", duration: "Ongoing · 1m 30s", open: true },
  { id: 2, monitor: "Auth service", started: "Today, 09:41", duration: "Resolved in 2m 10s" },
  { id: 3, monitor: "Checkout API", started: "Yesterday, 22:17", duration: "Resolved in 48s" },
  { id: 4, monitor: "Marketing site", started: "Mon, 03:05", duration: "Resolved in 4m 02s" },
];

export const PREVIEW_ALERTS = [
  { id: 1, tone: "down", title: "Checkout API is down", body: "HTTP 503 · 3 failed checks in a row", time: "now" },
  { id: 2, tone: "up", title: "Auth service recovered", body: "Back up after 2m 10s", time: "4h" },
  { id: 3, tone: "up", title: "Marketing site recovered", body: "Back up after 4m 02s", time: "Mon" },
];
