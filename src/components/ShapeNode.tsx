import {
  Handle,
  Position,
  type NodeProps,
  useReactFlow,
} from "reactflow";

export type ShapeType = "rectangle" | "circle" | "diamond";

export interface ShapeNodeData {
  label: string;
  shape: ShapeType;
}

export default function ShapeNode({
  id,
  data,
}: NodeProps<ShapeNodeData>) {
  const { setNodes, setEdges } = useReactFlow();

  const handleLabelChange = (value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: value } }
          : node
      )
    );
  };

  const handleDelete = () => {
    setNodes((nds) =>
      nds.filter((node) => node.id !== id)
    );

    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== id && edge.target !== id
      )
    );
  };

  const baseStyle: React.CSSProperties = {
    padding: 10,
    border: "2px solid black",
    background: "white",
    textAlign: "center",
    minWidth: 120,
  };

  const shapeStyles = {
    rectangle: { borderRadius: 8 },
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
    <div
      style={{
        ...baseStyle,
        ...shapeStyles[data.shape],
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div style={contentStyle}>
        <input
          value={data.label}
          onChange={(e) =>
            handleLabelChange(e.target.value)
          }
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            textAlign: "center",
          }}
        />

        <div>
          <button
            onClick={handleDelete}
            style={{ marginTop: 5 }}
          >
            Delete
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
