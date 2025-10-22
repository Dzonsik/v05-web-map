// Jednoduché API nad LocalStorage pro perzistenci diagramu.
// Poskytuje hook `useLocalStore` se třemi funkcemi: load, save, clear.
import { useCallback } from "react";

// Klíč, pod kterým jsou data uložena v LocalStorage
export const STORAGE_KEY = "maps:webdev";

export function useLocalStore() {
  // Načtení uložených dat. Vrací null při chybě/nenalezeno/neplatná verze.
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

  // Uložení dat (bezpečně obaleno try/catch, např. pro režimy blokující storage)
  const save = useCallback((payload) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
  }, []);

  // Smazání uložených dat pro daný klíč
  const clear = useCallback(() => { localStorage.removeItem(STORAGE_KEY); }, []);

  return { load, save, clear };
}
