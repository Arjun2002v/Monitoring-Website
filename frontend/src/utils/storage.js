// Exception-safe wrapper around localStorage for the auth session.
const KEY = "pulse.session";

export const sessionStore = {
  read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  write(session) {
    try {
      localStorage.setItem(KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable: session lives in memory only */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};
