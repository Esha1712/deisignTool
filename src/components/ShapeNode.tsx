import { Handle, Position, type NodeProps } from "reactflow";
import { type CSSProperties } from "react";

export type ShapeType = "rectangle" | "circle" | "diamond";

interface ShapeData {
  label: string;
  shape: ShapeType;
  onLabelChange?: (value: string) => void;
  onDelete?: () => void;
}

export default function ShapeNode({ data }: NodeProps<ShapeData>) {
  const baseStyle: CSSProperties = {
    padding: 10,
    border: "2px solid #222",
    background: "white",
    textAlign: "center",
    minWidth: 120,
  };

  const shapeStyles: Record<ShapeType, CSSProperties> = {
    rectangle: {
      borderRadius: 8,
    },
    circle: {
      borderRadius: "50%",
      width: 120,
      height: 120,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    diamond: {
      transform: "rotate(45deg)",
      width: 120,
      height: 120,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  const contentStyle =
    data.shape === "diamond"
      ? { transform: "rotate(-45deg)" }
      : undefined;

  return (
    <div style={{ ...baseStyle, ...shapeStyles[data.shape] }}>
      <Handle type="target" position={Position.Top} />

      <div style={contentStyle}>
        <input
          value={data.label}
          onChange={(e) => data.onLabelChange?.(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            textAlign: "center",
            background: "transparent",
          }}
        />

        <div>
          <button
            onClick={data.onDelete}
            style={{
              marginTop: 5,
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
