import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../utils/logger";

export function useNotifications({ page = 1, limit = 20, type = 'All' } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        Log('frontend', 'info', 'hook', `Loading notifications - Page: ${page}, Type: ${type}`);
        
        const data = await fetchNotifications({ page, limit, type });
        
        if (mounted) {
          setNotifications(data.notifications || []);
          setTotalPages(data.totalPages || 5);
          setError(null);
          Log('frontend', 'debug', 'hook', `Loaded ${data.notifications?.length || 0} notifications`);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          Log('frontend', 'error', 'hook', `Failed to load notifications into state ${err}`);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [page, limit, type]);

  return { notifications, totalPages, loading, error };
}
