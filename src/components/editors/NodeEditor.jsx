// Editor vlastností pro vybraný prvek v plátně (uzel nebo hrana).
// Přepíná se mezi záložkami a deleguje specifické části na ArrayEditor/LinkEditor.
import React, { useState, useEffect, useRef } from "react";
import { TYPES } from "../../data/types";
import ArrayEditor from "./ArrayEditor";
import LinkEditor from "./LinkEditor";

export default function NodeEditor({ selected, onChange }) {
  const [tab, setTab] = useState("basic");
  const isEdge = !!(selected?.source && selected?.target);

  const skipTagSync = useRef(false);
  const [tagInput, setTagInput] = useState(() => {
    if (!selected || isEdge) return "";
    return Array.isArray(selected.data.tags) ? selected.data.tags.join(", ") : "";
  });

  useEffect(() => {
    if (!selected || isEdge) {
      setTagInput("");
      skipTagSync.current = false;
      return;
    }

    if (skipTagSync.current) {
      skipTagSync.current = false;
      return;
    }

    const tagsArray = Array.isArray(selected.data.tags) ? selected.data.tags : [];
    setTagInput(tagsArray.join(", "));
  }, [isEdge, selected?.id, selected?.data?.tags]);

  const handleTagChange = (raw) => {
    if (!selected || isEdge) return;
    setTagInput(raw);
    skipTagSync.current = true;
    const next = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onChange({ ...selected, data: { ...selected.data, tags: next } });
  };

  if (!selected) {
    return <div className="panel muted">Vyber uzel nebo hranu pro úpravu.</div>;
  }

  if (isEdge) {
    // Režim editace hrany: label a volitelná podmínka v `data.condition`
    return (
      <div className="panel">
        <div className="panel-subtitle">Hrana: {selected.id}</div>
        <label className="label">Popisek (label)</label>
        <input className="input" value={selected.label || ""} onChange={(e) => onChange({ ...selected, label: e.target.value })} />
        <label className="label">Podmínka (data.condition)</label>
        <input className="input" value={selected.data?.condition || ""} onChange={(e) => onChange({ ...selected, data: { ...(selected.data||{}), condition: e.target.value } })} />
      </div>
    );
  }

  const node = selected;

  // Pomocná funkce pro částečnou aktualizaci `node.data`
  const setData = (patch) => onChange({ ...node, data: { ...node.data, ...patch } });

  return (
    <div className="panel">
      <div className="tabs">
        <button className={`tab ${tab === 'basic' ? 'tab-active' : ''}`} onClick={()=>setTab('basic')}>Základ</button>
        <button className={`tab ${tab === 'pros' ? 'tab-active' : ''}`} onClick={()=>setTab('pros')}>Plus / Mínus</button>
        <button className={`tab ${tab === 'links' ? 'tab-active' : ''}`} onClick={()=>setTab('links')}>Odkazy / Tagy</button>
      </div>

      {tab === 'basic' && (
        <>
          <label className="label">Nadpis</label>
          <input className="input" value={node.data.title || ""} onChange={(e) => setData({ title: e.target.value })} />

          <label className="label">Shrnutí</label>
          <textarea className="textarea" value={node.data.summary || ""} onChange={(e) => setData({ summary: e.target.value })} />

          <div className="row">
            <div className="col">
              <label className="label">Typ uzlu</label>
              {/* Přepnutí typu uzlu ovlivní barvy i vzhled v plátně */}
              <select className="input" value={node.type} onChange={(e) => onChange({ ...node, type: e.target.value })}>
                {TYPES.map(t=> (<option key={t.id} value={t.id}>{t.label}</option>))}
              </select>
            </div>
            <div className="col">
              <label className="label">Tagy (čárkou)</label>
              {/* Input drží vlastní text, aby při psaní nezmizely čárky; do dat ukládáme pole tagů */}
              <input
                className="input"
                value={tagInput}
                onChange={(e) => handleTagChange(e.target.value)}
                onBlur={() => {
                  // Po opuštění pole text normalizujeme podle uložených tagů
                  const tagsArray = Array.isArray(node.data.tags) ? node.data.tags : [];
                  setTagInput(tagsArray.join(", "));
                }}
              />
            </div>
          </div>
        </>
      )}

      {tab === 'pros' && (
        <div className="row">
          {/* Editor seznamů výhod/nevýhod */}
          <ArrayEditor label="Výhody" items={node.data.pros || []} onChange={(arr) => setData({ pros: arr })} />
          <ArrayEditor label="Nevýhody" items={node.data.cons || []} onChange={(arr) => setData({ cons: arr })} />
        </div>
      )}

      {tab === 'links' && (
        // Editor odkazů a tagů (tagy lze upravit i v "Základ")
        <LinkEditor links={node.data.links || []} onChange={(links) => setData({ links })} />
      )}
    </div>
  );
}
