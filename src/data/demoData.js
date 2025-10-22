import { MarkerType } from "reactflow";

// Demo obsah mapy
export const demo = () => ({
  version: 2,
  nodes: [
    { id: "start", type: "info", position: { x: 0, y: 0 }, data: { title: "Nápad", summary: "Co chci postavit a proč?", tags: ["brief"] } },
    { id: "goal", type: "decision", position: { x: 350, y: -40 }, data: { title: "Cíl webu", summary: "Portfolio / Blog / E-shop / App" } },
    { id: "content", type: "decision", position: { x: 700, y: -120 }, data: { title: "Obsah", summary: "Statický vs. dynamický" } },
    { id: "frontend", type: "tech", position: { x: 700, y: 80 }, data: { title: "Frontend", summary: "HTML/CSS/JS → framework?", tags: ["FE"] } },
    { id: "todo-structure", type: "task", position: { x: 350, y: 120 }, data: { title: "Rozkresli IA", summary: "Mapa stránek, klíčové obrazovky" } },
    { id: "ref-links", type: "resource", position: { x: 50, y: 160 }, data: { title: "Reference", summary: "Checklisty, články", links: [{label:"Web.dev Guides", url:"https://web.dev/learn/"}] } },
  ],
  edges: [
    { id: "e1", source: "start", target: "goal", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, label: "definuj" },
    { id: "e2", source: "goal", target: "content", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, label: "obsah" },
    { id: "e3", source: "goal", target: "frontend", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, label: "UI" },
    { id: "e4", source: "goal", target: "todo-structure", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, label: "úkol" },
    { id: "e5", source: "start", target: "ref-links", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, label: "inspirace" },
  ],
  viewport: { x: 0, y: 0, zoom: 1 },
});