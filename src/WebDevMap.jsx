// Hlavní React komponenta pro interaktivní mapu dovedností ve webdevu.
// Tento soubor obsahuje kontejner celé aplikace, práci se stavem uzlů/hran,
// filtrováním, import/export dat, a pravým panelem s editorem.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge, Background, Controls, MiniMap,
  useEdgesState, useNodesState, MarkerType
} from "reactflow";
import "reactflow/dist/style.css";

// Konstanty s typy uzlů (kategorie) a demo data
import { TYPES } from "./data/types";
import { demo } from "./data/demoData";
// Hook pro práci s LocalStorage (načítání/ukládání) a klíč pro storage
import { useLocalStore, STORAGE_KEY } from "./lib/storage";

// UI komponenty: horní/levý toolbar a pravý editor vlastností uzlu/hrany
import Toolbar from "./components/Toolbar";
import NodeEditor from "./components/editors/NodeEditor";
import { nodeTypes as NODE_TYPES } from "./components/nodes/nodeTypes";
import './index.css';

export default function WebDevMap() {
  // Persistenční API nad LocalStorage
  const { load, save, clear } = useLocalStore();
  // Po prvním renderu zkusíme načíst uložená data, jinak použijeme demo
  const initial = useMemo(() => load() || demo(), [load]);

  // Stav React Flow: seznam uzlů a hran (+ obslužné funkce změn)
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  // Aktuálně vybraný prvek (uzel nebo hrana)
  const [selected, setSelected] = useState(null);
  // Stav filtrů podle typu uzlu (výchozí: vše zapnuto)
  const [filters, setFilters] = useState(() => Object.fromEntries(TYPES.map(t=>[t.id,true])));
  // Rozměry panelu (pravého sidebaru)
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const dragStateRef = useRef(null);

  // Autosave: při každé změně uzlů/hran uložit do LocalStorage
  useEffect(() => { save({ version: 2, nodes, edges }); }, [nodes, edges, save]);

  // Přidání hrany mezi uzly (použijeme hladký typ s šipkou)
  const onConnect = useCallback((params) =>
    setEdges((eds) => addEdge({ ...params, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
  []);

  // Přidání nového uzlu vybraného typu s náhodnou pozicí
  const onAddNode = useCallback((type) => {
    const id = `n_${Date.now().toString(36)}_${Math.floor(Math.random()*999)}`;
    const base = { x: Math.random() * 200 + 100, y: Math.random() * 120 + 80 };
    const defaults = { title: TYPES.find(t=>t.id===type)?.label || "Uzel", summary: "", pros: [], cons: [], links: [], tags: [] };
    setNodes((ns) => ([...ns, { id, type, position: base, data: defaults }]));
  }, []);

  // Export aktuálního grafu jako JSON soubor
  const onExport = useCallback(() => {
    const payload = { version: 2, nodes, edges };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "webdev-map.json"; a.click(); URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Import grafu z JSONu (základní validace struktury)
  const onImport = useCallback((data) => {
    if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) { alert("Soubor nemá očekávanou strukturu."); return; }
    setNodes(data.nodes); setEdges(data.edges);
  }, []);

  // Obnovení na výchozí demo data
  const onReset = useCallback(() => { const d = demo(); setNodes(d.nodes); setEdges(d.edges); }, []);
  // Vymazání uložených dat v LocalStorage
  const onClear = useCallback(() => { clear(); alert("Lokální uložená data smazána."); }, [clear]);

  // Reakce na změnu výběru v plátně (uzel/ hrana / nic)
  const onSelectionChange = useCallback(({ nodes: ns = [], edges: es = [] }) => { setSelected(ns[0] || es[0] || null); }, []);

  // Filtr: vypočítáme, které uzly jsou viditelné dle aktivních filtrů
  const visibleNodeIds = useMemo(() => new Set(nodes.filter(n=>filters[n.type]).map(n=>n.id)), [nodes, filters]);
  const filteredNodes = useMemo(() => nodes.filter(n=>visibleNodeIds.has(n.id)), [nodes, visibleNodeIds]);
  const filteredEdges = useMemo(() => edges.filter(e=>visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)), [edges, visibleNodeIds]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      event.preventDefault();

      if (drag.type === "sidebar") {
        const delta = event.clientX - drag.startX;
        const next = Math.min(Math.max(drag.startValue - delta, 260), 640);
        setSidebarWidth(next);
      }

    };

    const handlePointerUp = () => {
      if (!dragStateRef.current) return;
      dragStateRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [setSidebarWidth]);

  const startSidebarResize = useCallback((event) => {
    dragStateRef.current = { type: "sidebar", startX: event.clientX, startValue: sidebarWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    event.preventDefault();
    event.stopPropagation();
  }, [sidebarWidth]);

  useEffect(() => () => {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const nodeTypesRef = useRef(NODE_TYPES);

  return (
    <div className="page" style={{ gridTemplateColumns: `minmax(0,1fr) ${Math.round(sidebarWidth)}px` }}>
      <div className="left">
        {/* Levý panel: Toolbar + plátno React Flow */}
        <Toolbar
          onAddNode={onAddNode}
          onExport={onExport}
          onImport={onImport}
          onReset={onReset}
          onClear={onClear}
          filters={filters}
          setFilters={setFilters}
        />
        <div className="rf-wrapper">
          <ReactFlow
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypesRef.current}
            fitView
            style={{ height: "100%" }}
          >
            {/* Pomocné prvky plátna: mini mapa, ovládací prvky a pozadí */}
            <Controls />
            <Background variant="dots" gap={16} size={1} />
          </ReactFlow>
        </div>
      </div>

      <div className="right" style={{ width: sidebarWidth, minWidth: sidebarWidth }}>
        <div
          className="resize-handle resize-handle-vertical"
          onPointerDown={startSidebarResize}
          role="separator"
          aria-orientation="vertical"
        />
        {/* Pravý panel: editor detailů pro vybraný uzel/ hranu */}
        <div className="sidebar-header">Editor</div>
        <div className="sidebar-content">
          <NodeEditor
            selected={selected}
            onChange={(updated) => {
              // Aktualizace dat podle toho, zda je vybraná hrana nebo uzel
              if (!updated) return;
              if (updated.source && updated.target) {
                setEdges((eds) => eds.map((e) => (e.id === updated.id ? { ...e, ...updated } : e)));
              } else {
                setNodes((ns) => ns.map((n) => (n.id === updated.id ? { ...n, ...updated } : n)));
              }
              setSelected(updated);
            }}
          />
          <aside>
            <MiniMap
              pannable
              zoomable
              position="bottom-right"
              style={{ border: "none", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)" }}
              nodeColor={(node) => TYPES.find((t) => t.id === node.type)?.color || "#f1f5f9"}
              nodeStrokeColor={(node) => TYPES.find((t) => t.id === node.type)?.border || "#cbd5f5"}
            />
          </aside>
        </div>
        {/* Informace o autosave a použitém klíči v LocalStorage */}
        <div className="sidebar-footer">Autosave: LocalStorage → {STORAGE_KEY}</div>
      </div>
    </div>
  );
}
