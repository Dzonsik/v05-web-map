import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  addEdge, Background, Controls, MiniMap,
  useEdgesState, useNodesState, MarkerType
} from "reactflow";
import "reactflow/dist/style.css";

import { TYPES } from "./data/types";
import { demo } from "./data/demoData";
import { useLocalStore, STORAGE_KEY } from "./lib/storage";

import Toolbar from "./components/Toolbar";
import NodeEditor from "./components/editors/NodeEditor";
import { nodeTypes as nodeTypes } from "./components/nodes/nodeTypes";
import './index.css';

export default function WebDevMap() {
  const { load, save, clear } = useLocalStore();
  const initial = useMemo(() => load() || demo(), [load]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(() => Object.fromEntries(TYPES.map(t=>[t.id,true])));

  useEffect(() => { save({ version: 2, nodes, edges }); }, [nodes, edges, save]);

  const onConnect = useCallback((params) =>
    setEdges((eds) => addEdge({ ...params, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
  []);

  const onAddNode = useCallback((type) => {
    const id = `n_${Date.now().toString(36)}_${Math.floor(Math.random()*999)}`;
    const base = { x: Math.random() * 200 + 100, y: Math.random() * 120 + 80 };
    const defaults = { title: TYPES.find(t=>t.id===type)?.label || "Uzel", summary: "", pros: [], cons: [], links: [], tags: [] };
    setNodes((ns) => ([...ns, { id, type, position: base, data: defaults }]));
  }, []);

  const onExport = useCallback(() => {
    const payload = { version: 2, nodes, edges };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "webdev-map.json"; a.click(); URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const onImport = useCallback((data) => {
    if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) { alert("Soubor nemá očekávanou strukturu."); return; }
    setNodes(data.nodes); setEdges(data.edges);
  }, []);

  const onReset = useCallback(() => { const d = demo(); setNodes(d.nodes); setEdges(d.edges); }, []);
  const onClear = useCallback(() => { clear(); alert("Lokální uložená data smazána."); }, [clear]);

  const onSelectionChange = useCallback(({ nodes: ns = [], edges: es = [] }) => { setSelected(ns[0] || es[0] || null); }, []);

  // Filtr
  const visibleNodeIds = useMemo(() => new Set(nodes.filter(n=>filters[n.type]).map(n=>n.id)), [nodes, filters]);
  const filteredNodes = useMemo(() => nodes.filter(n=>visibleNodeIds.has(n.id)), [nodes, visibleNodeIds]);
  const filteredEdges = useMemo(() => edges.filter(e=>visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)), [edges, visibleNodeIds]);

  return (
    <div className="page">
      <div className="left">
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
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap pannable zoomable />
            <Controls />
            <Background variant="dots" gap={16} size={1} />
          </ReactFlow>
        </div>
      </div>

      <div className="right">
        <div className="sidebar-header">Editor</div>
        <div className="sidebar-content">
          <NodeEditor
            selected={selected}
            onChange={(updated) => {
              if (!updated) return;
              if (updated.source && updated.target) {
                setEdges((eds) => eds.map((e) => (e.id === updated.id ? { ...e, ...updated } : e)));
              } else {
                setNodes((ns) => ns.map((n) => (n.id === updated.id ? { ...n, ...updated } : n)));
              }
              setSelected(updated);
            }}
          />
        </div>
        <div className="sidebar-footer">Autosave: LocalStorage → {STORAGE_KEY}</div>
      </div>
    </div>
  );
}