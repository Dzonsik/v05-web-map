// Editor seznamu odkazů pro uzel: přidávání a mazání položek.
import React, { useState } from "react";

export default function LinkEditor({ links, onChange }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  return (
    <div className="stack">
      <div className="panel-subtitle">Odkazy</div>
      <div className="row">
        <input className="input" placeholder="název" value={label} onChange={(e)=>setLabel(e.target.value)} />
        <input className="input" placeholder="https://..." value={url} onChange={(e)=>setUrl(e.target.value)} />
        {/* Přidání odkazu: vyžaduje URL; label se doplní URL pokud není zadán */}
        <button className="btn" onClick={()=>{ if(!url.trim()) return; onChange([...(links||[]), {label: label||url, url}]); setLabel(""); setUrl(""); }}>
          Přidat
        </button>
      </div>
      <ul className="list">
        {(links||[]).map((l, idx)=>(
          <li key={idx} className="list-item">
            <a className="link" href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
            {/* Odstranění odkazu podle indexu */}
            <button className="link" onClick={()=>onChange(links.filter((_,i)=>i!==idx))}>smazat</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
