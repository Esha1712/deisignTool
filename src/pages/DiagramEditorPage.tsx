import ReactFlow, {
  Background,
  Controls,
  addEdge,
  type Connection,
  type Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import ShapeNode, { type ShapeType } from "../components/ShapeNode";

const nodeTypes = {
  shape: ShapeNode,
};

export default function DiagramEditorPage() {
  const { user } = useAuth();
  const isEditor = user?.role === "editor";

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = (shape: ShapeType) => {
    const id = crypto.randomUUID();

    const newNode: Node = {
      id,
      type: "shape",
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: `${shape} node`,
        shape,
        onLabelChange: (newLabel: string) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, label: newLabel } }
                : node
            )
          );
        },
        onDelete: () => {
          setNodes((nds) => nds.filter((node) => node.id !== id));
          setEdges((eds) =>
            eds.filter(
              (edge) => edge.source !== id && edge.target !== id
            )
          );
        },
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ height: "100vh" }}>
      {isEditor && (
        <div style={{ position: "absolute", zIndex: 10 }}>
          <button onClick={() => addNode("rectangle")}>
            Add Rectangle
          </button>
          <button onClick={() => addNode("circle")}>
            Add Circle
          </button>
          <button onClick={() => addNode("diamond")}>
            Add Diamond
          </button>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={isEditor ? onNodesChange : undefined}
        onEdgesChange={isEditor ? onEdgesChange : undefined}
        onConnect={isEditor ? onConnect : undefined}
        nodesDraggable={isEditor}
        nodesConnectable={isEditor}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
