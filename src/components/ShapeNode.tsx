import { Handle, Position, type NodeProps, useReactFlow } from "reactflow";
import { useState } from "react";

export type ShapeType = "rectangle" | "circle" | "diamond";

export interface ShapeNodeData {
  label: string;
  shape: ShapeType;
}

export default function ShapeNode({ id, data, selected }: NodeProps<ShapeNodeData>) {
  const { setNodes, setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

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
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };

  const getShapeStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: "16px 20px",
      background: selected
        ? "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)"
        : "#ffffff",
      color: "#1a202c",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      boxShadow: selected
        ? "0 8px 30px rgba(102, 126, 234, 0.25), 0 0 0 2px #667eea"
        : isHovered
          ? "0 8px 30px rgba(0, 0, 0, 0.12)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
      border: "1px solid",
      borderColor: selected ? "#667eea" : "#e2e8f0",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "move",
      position: "relative",
    };

    switch (data.shape) {
      case "rectangle":
        return {
          ...baseStyle,
          borderRadius: "8px",
          minWidth: 150,
          minHeight: 75,
          maxWidth: 200,
        };
      case "circle":
        return {
          ...baseStyle,
          borderRadius: "50%",
          width: 120,
          height: 120,
        };
      case "diamond":
        return {
          ...baseStyle,
          transform: "rotate(45deg)",
          width: 120,
          height: 120,
          borderRadius: "12px",
          padding: "20px",
        };
      default:
        return baseStyle;
    }
  };

  const contentStyle: React.CSSProperties =
    data.shape === "diamond"
      ? {
          transform: "rotate(-45deg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          width: "75px",
          maxWidth: "75px",
        }
      : {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          maxWidth: "100%",
        };

  return (
    <div
      style={getShapeStyles()}
      data-shape={data.shape}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#667eea",
          border: "2px solid white",
          width: 10,
          height: 10,
          boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
        }}
      />

      <div style={contentStyle}>
        <input
          value={data.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          title={data.label} // Show full text on hover
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            textAlign: "center",
            width: "100%",
            fontSize: data.shape === "diamond" ? "12px" : "14px",
            fontWeight: "600",
            color: "#2d3748",
            padding: "6px 8px",
            borderBottom: "2px solid transparent",
            transition: "all 0.2s ease",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          onFocus={(e) => {
            e.target.style.borderBottomColor = "#667eea";
            e.target.style.color = "#667eea";
          }}
          onBlur={(e) => {
            e.target.style.borderBottomColor = "transparent";
            e.target.style.color = "#2d3748";
          }}
          aria-label="Node label"
        />

        <button
          onClick={handleDelete}
          style={{
            padding: data.shape === "diamond" ? "4px 10px" : "5px 14px",
            fontSize: "11px",
            background: "transparent",
            color: "#e53e3e",
            border: "1px solid #e53e3e",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s ease",
            opacity: 0,
            animation: "fadeIn 0.2s ease forwards",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#e53e3e";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#e53e3e";
          }}
          aria-label="Delete node"
        >
          Delete
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#667eea",
          border: "2px solid white",
          width: 10,
          height: 10,
          boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
        }}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
