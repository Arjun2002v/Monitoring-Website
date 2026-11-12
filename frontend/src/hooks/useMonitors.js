import { useCallback, useEffect, useState } from "react";
import { monitorService } from "../services/monitorService";

export function useMonitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setMonitors(await monitorService.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input) => {
      await monitorService.create(input);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id, input) => {
      await monitorService.update(id, input);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(async (id) => {
    await monitorService.remove(id);
    setMonitors((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { monitors, loading, error, refresh, create, update, remove };
}
