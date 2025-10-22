// Mapování typů uzlů pro React Flow.
// React Flow očekává objekt { [type]: ReactComponent }, který použije při renderu uzlu.
import BaseNode from "./BaseNode";

// Pomocný wrapper, který předá BaseNode typ a props z React Flow
const wrap = (type) => ({ data, selected }) => (
  <BaseNode type={type} data={data} selected={selected} />
);

// Vytvoříme jednou a zmrazíme – stabilní reference zlepšují výkon a brání mutacím
export const nodeTypes = Object.freeze({
  info: wrap("info"),
  decision: wrap("decision"),
  tech: wrap("tech"),
  task: wrap("task"),
  resource: wrap("resource"),
});
