import React, { useRef } from "react";
import { TYPES } from "../data/types";

export default function Toolbar({ onAddNode, onExport, onImport, onReset, onClear, filters, setFilters }) {
  const fileRef = useRef(null);

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <div className="toolbar-group">
          {TYPES.map((t) => (
            <button key={t.id} className="btn" onClick={() => onAddNode(t.id)}>+ {t.label}</button>
          ))}
        </div>
        <div className="toolbar-group">
          <button className="btn" onClick={onExport}>Export JSON</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => {
                try { onImport(JSON.parse(String(reader.result))); } catch { alert("Soubor není platný JSON."); }
              };
              reader.readAsText(f);
              e.currentTarget.value = "";
            }}
          />
          <button className="btn" onClick={() => fileRef.current?.click()}>Import JSON</button>
          <button className="btn" onClick={onReset}>Reset na demo</button>
          <button className="btn" onClick={onClear}>Smazat uložené</button>
        </div>
      </div>

      <div className="filter-row">
        <span className="muted">Filtry:</span>
        {TYPES.map((t) => (
          <label key={t.id} className="filter-item">
            <input type="checkbox" checked={filters[t.id]} onChange={(e)=>setFilters((f)=>({...f, [t.id]: e.target.checked}))} />
            <span>{t.label}</span>
          </label>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="link" onClick={()=>setFilters(Object.fromEntries(TYPES.map(t=>[t.id,true])))}>Zobrazit vše</button>
          <button className="link" onClick={()=>setFilters(Object.fromEntries(TYPES.map(t=>[t.id,false])))}>Skrýt vše</button>
        </div>
      </div>
    </div>
  );
}