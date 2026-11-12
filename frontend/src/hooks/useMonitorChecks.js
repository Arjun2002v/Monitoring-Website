import { useCallback, useEffect, useState } from "react";
import { monitorService } from "../services/monitorService";

export function useMonitorChecks(monitorId, { limit = 20 } = {}) {
  const [page, setPage] = useState(1);
  const [status, setStatusState] = useState("");
  const [data, setData] = useState({ checks: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await monitorService.checks(monitorId, { page, limit, status }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [monitorId, page, limit, status]);

  useEffect(() => {
    reload();
  }, [reload]);

  const setStatus = (next) => {
    setPage(1);
    setStatusState(next);
  };

  return { ...data, page, setPage, status, setStatus, loading, error, reload };
}
