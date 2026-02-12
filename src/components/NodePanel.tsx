import type { ShapeType } from "./ShapeNode";

export default function NodePanel({
  onAdd,
}: {
  onAdd: (shape: ShapeType) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 12,
        top: 12,
        background: "#fff",
        padding: 10,
        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        borderRadius: 6,
        zIndex: 10,
      }}
    >
      <h4 style={{ margin: "0 0 8px 0" }}>Add Shape</h4>
      <button onClick={() => onAdd("rectangle")}>Rectangle</button>
      <button onClick={() => onAdd("circle")}>Circle</button>
      <button onClick={() => onAdd("diamond")}>Diamond</button>
    </div>
  );
}
