import { Handle, Position, type NodeProps } from "reactflow";
import { useState } from "react";

export default function EditableNode({ data }: NodeProps) {
  const [label, setLabel] = useState(data.label);

  return (
    <div
      style={{
        padding: 10,
        border: "2px solid #222",
        borderRadius: 8,
        background: "white",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <input
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          data.onChange?.(e.target.value);
        }}
        style={{
          border: "none",
          outline: "none",
          textAlign: "center",
        }}
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
