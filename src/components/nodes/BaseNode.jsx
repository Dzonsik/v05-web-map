// Základní vizuální podoba uzlu v React Flow.
// Styluje se podle typu (barvy) a zobrazuje obsah z `data`.
import { Handle, Position } from "reactflow";
import { TYPES } from "../../data/types";

export default function BaseNode({ type, data, selected }) {
  // Najdeme definici typu (fallback na první typ, pokud neexistuje)
  const def = TYPES.find(t => t.id === type) || TYPES[0];
  return (
    <div
      className="node-card"
      style={{
        background: def.color,
        borderColor: def.border,
        // Při výběru zvýrazníme uzel barevným "ringem"
        boxShadow: selected ? `0 0 0 2px ${def.ring}` : '0 1px 2px rgba(0,0,0,0.08)'
      }}
    >
      {/* Horní handle: cílový (příchozí hrany) */}
      <Handle type="target" position={Position.Top} />
      <div className="node-title">{data.title || def.label}</div>

      {data.tags?.length ? (
        <div className="tags">
          {data.tags.map((t, i) => (<span key={i} className="tag">{t}</span>))}
        </div>
      ) : null}

      {data.summary && <div className="node-summary">{data.summary}</div>}

      {(data.pros?.length || data.cons?.length) ? (
        <div className="node-columns">
          {data.pros?.length ? (
            <div>
              <div className="panel-subtitle">Plus</div>
              <ul className="disc-list">{data.pros.map((p,i)=>(<li key={i}>{p}</li>))}</ul>
            </div>
          ) : null}
          {data.cons?.length ? (
            <div>
              <div className="panel-subtitle">Mínus</div>
              <ul className="disc-list">{data.cons.map((c,i)=>(<li key={i}>{c}</li>))}</ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {data.links?.length ? (
        <div className="node-links">
          <div className="panel-subtitle">Odkazy</div>
          <ul className="disc-list">
            {data.links.map((l,i)=>(<li key={i}><a className="link" href={l.url} target="_blank" rel="noreferrer">{l.label}</a></li>))}
          </ul>
        </div>
      ) : null}

      {/* Spodní handle: zdrojový (odchozí hrany) */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
