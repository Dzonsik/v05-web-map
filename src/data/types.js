// Definice typů uzlů používaných v mapě.
// Každý typ určuje:
// - `id`: interní identifikátor
// - `label`: zobrazovaný název v UI
// - `color`: výplň uzlu
// - `border`: barva rámečku
// - `ring`: barva zvýraznění (např. při výběru)
// Tyto barvy doplňují vzhled v komponentě uzlu (inline styly/Tailwind @apply).
export const TYPES = [
  { id: "info",     label: "Info",        color: "#ffffff", border: "#e5e7eb", ring: "#111827" },
  { id: "decision", label: "Rozhodnutí",  color: "#fffbeb", border: "#fcd34d", ring: "#f59e0b" },
  { id: "tech",     label: "Technologie", color: "#eef2ff", border: "#c7d2fe", ring: "#6366f1" },
  { id: "task",     label: "Úkol",        color: "#ecfdf5", border: "#a7f3d0", ring: "#10b981" },
  { id: "resource", label: "Zdroj",       color: "#eff6ff", border: "#bae6fd", ring: "#0ea5e9" },
];
