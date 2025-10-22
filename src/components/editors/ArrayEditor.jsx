// Univerzální editor prostého seznamu stringů (např. výhody/nevýhody).
// Umožňuje přidávání Enterem i tlačítkem a mazání položek.
import React, { useState } from "react";

export default function ArrayEditor({ label, items, onChange }) {
  const [value, setValue] = useState("");
  return (
    <div className="stack">
      <div className="panel-subtitle">{label}</div>
      <div className="row">
        <input
          className="input"
          placeholder="přidej položku"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Přidání položky klávesou Enter (ignorujeme prázdné)
            if (e.key === "Enter" && value.trim()) {
              onChange([...(items || []), value.trim()]);
              setValue("");
            }
          }}
        />
        {/* Přidání položky tlačítkem (stejná validace jako Enter) */}
        <button className="btn" onClick={() => { if (!value.trim()) return; onChange([...(items || []), value.trim()]); setValue(""); }}>
          Přidat
        </button>
      </div>
      <ul className="list">
        {(items || []).map((it, idx) => (
          <li key={idx} className="list-item">
            <span className="truncate">{it}</span>
            {/* Smazání položky podle indexu */}
            <button className="link" onClick={() => onChange(items.filter((_, i) => i !== idx))}>
              smazat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
