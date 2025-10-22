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
            if (e.key === "Enter" && value.trim()) {
              onChange([...(items || []), value.trim()]);
              setValue("");
            }
          }}
        />
        <button className="btn" onClick={() => { if (!value.trim()) return; onChange([...(items || []), value.trim()]); setValue(""); }}>
          Přidat
        </button>
      </div>
      <ul className="list">
        {(items || []).map((it, idx) => (
          <li key={idx} className="list-item">
            <span className="truncate">{it}</span>
            <button className="link" onClick={() => onChange(items.filter((_, i) => i !== idx))}>
              smazat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}