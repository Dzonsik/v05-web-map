// src/components/nodes/nodeTypes.jsx
import BaseNode from "./BaseNode";

const wrap = (type) => ({ data, selected }) => (
  <BaseNode type={type} data={data} selected={selected} />
);

// vytvoří se jednou při načtení modulu
export const nodeTypes = Object.freeze({
  info: wrap("info"),
  decision: wrap("decision"),
  tech: wrap("tech"),
  task: wrap("task"),
  resource: wrap("resource"),
});
