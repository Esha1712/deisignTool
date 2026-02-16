import { useState } from "react";
import type { ShapeType } from "./ShapeNode";

interface NodePanelProps {
  onAdd: (shape: ShapeType) => void;
}

export default function NodePanel({ onAdd }: NodePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shapes: { type: ShapeType; icon: string; label: string; description: string }[] = [
    { type: "rectangle", icon: "▭", label: "Rectangle", description: "Standard box" },
    { type: "circle", icon: "●", label: "Circle", description: "Round shape" },
    { type: "diamond", icon: "◆", label: "Diamond", description: "Decision point" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: "24px",
        top: "24px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        border: "1px solid #e2e8f0",
        zIndex: 10,
        width: isExpanded ? "220px" : "auto",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "700",
              color: "#1a202c",
              letterSpacing: "-0.3px",
            }}
          >
            Add Elements
          </h4>
          {isExpanded && (
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: "11px",
                color: "#718096",
                fontWeight: "500",
              }}
            >
              Click to add shapes
            </p>
          )}
        </div>
        
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease",
            transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
          }}
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: "#718096" }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div
          style={{
            padding: "0 20px 20px 20px",
            animation: "slideDown 0.3s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {shapes.map((shape) => (
              <button
                key={shape.type}
                onClick={() => onAdd(shape.type)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "transparent",
                  color: "#2d3748",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.background = "#f7fafc";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px", opacity: 0.7 }}>{shape.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>
                      {shape.label}
                    </div>
                    <div style={{ fontSize: "10px", color: "#a0aec0", fontWeight: "500" }}>
                      {shape.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
