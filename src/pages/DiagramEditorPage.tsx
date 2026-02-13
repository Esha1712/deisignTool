import { useParams, useNavigate } from "react-router-dom";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  ReactFlow,
  Background,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";

import ShapeNode, { type ShapeType } from "../components/ShapeNode";
import NodePanel from "../components/NodePanel";
import { getDiagram, saveDiagram } from "../services/diagram.service";
import type { UserRole } from "../types/user.types";

const nodeTypes = { shape: ShapeNode };

export default function DiagramEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [diagramOwner, setDiagramOwner] = useState<string | null>(null);
  const [diagramShared, setDiagramShared] = useState<
    Record<string, UserRole>
  >({});

  useEffect(() => {
    if (!id || !user) return;

    if (id === "new") {
      const newId = crypto.randomUUID();

      saveDiagram(newId, user.uid, [], []).then(() => {
        navigate(`/diagram/${newId}`, { replace: true });
      });

      return;
    }

    getDiagram(id).then((data) => {
      if (!data) return;

      setDiagramOwner(data.ownerId);
      setDiagramShared((data as any).sharedWith || {});

      const safeNodes = (data.nodes ?? []).map((node) => ({
        ...node,
        type: "shape",
      }));

      setNodes(safeNodes);
      setEdges(data.edges ?? []);
    });
  }, [id, user, navigate, setNodes, setEdges]);

  const role: UserRole | undefined =
    user?.uid === diagramOwner
      ? "editor"
      : diagramShared[user?.uid ?? ""];

  const isEditor = role === "editor";

  useEffect(() => {
    if (!id || id === "new" || !user) return;

    const timeout = setTimeout(() => {
      saveDiagram(id, diagramOwner ?? user.uid, nodes, edges);
    }, 600);

    return () => clearTimeout(timeout);
  }, [nodes, edges, id, user, diagramOwner]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!isEditor) return;
      setEdges((eds) => addEdge(connection, eds));
    },
    [isEditor, setEdges]
  );

  const addNode = (shape: ShapeType) => {
    if (!isEditor) return;

    const uid = crypto.randomUUID();

    const newNode: Node = {
      id: uid,
      type: "shape",
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: `${shape} node`,
        shape,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {isEditor && <NodePanel onAdd={addNode} />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={isEditor ? onNodesChange : undefined}
        onEdgesChange={isEditor ? onEdgesChange : undefined}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
