import { useCallback } from "react";

export const STORAGE_KEY = "maps:webdev";

export function useLocalStore() {
  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.version ? parsed : null;
    } catch {
      return null;
    }
  }, []);

  const save = useCallback((payload) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
  }, []);

  const clear = useCallback(() => { localStorage.removeItem(STORAGE_KEY); }, []);

  return { load, save, clear };
}