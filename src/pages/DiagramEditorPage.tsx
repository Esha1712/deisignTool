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
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";

import ShapeNode, { type ShapeType } from "../components/ShapeNode";
import NodePanel from "../components/NodePanel";
import { ShareDialog } from "../components/ShareDialog";
import { getDiagram, saveDiagram } from "../services/diagram.service";
import type { UserRole } from "../types/user.types";
import { showToast } from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { COLORS } from "../constants";

const nodeTypes = { shape: ShapeNode };

function DiagramEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [diagramOwner, setDiagramOwner] = useState<string | null>(null);
  const [diagramShared, setDiagramShared] = useState<Record<string, UserRole>>({});
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  const role: UserRole | undefined = user?.uid === diagramOwner
    ? "editor"
    : diagramShared[user?.uid ?? ""];

  const isOwner = user?.uid === diagramOwner;
  const isEditor = role === "editor";
  const hasAccess = role === "editor" || role === "viewer";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id || !user) return;

    const loadDiagram = async () => {
      setLoading(true);
      setError(null);

      try {
        if (id === "new") {
          const newId = crypto.randomUUID();
          await saveDiagram(newId, user.uid, [], []);
          navigate(`/diagram/${newId}`, { replace: true });
          return;
        }

        const data = await getDiagram(id);

        if (!data) {
          setError("Diagram not found");
          showToast("Diagram not found", "error");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        setDiagramOwner(data.ownerId);
        setDiagramShared(data.sharedWith || {});

        const userHasAccess =
          data.ownerId === user.uid ||
          (data.sharedWith && user.uid in data.sharedWith);

        if (!userHasAccess) {
          setError("You don't have permission to view this diagram");
          showToast("Access denied", "error");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        const safeNodes = (data.nodes ?? []).map((node) => ({
          ...node,
          type: "shape",
        }));

        setNodes(safeNodes);
        setEdges(data.edges ?? []);
        
        const userRole = data.ownerId === user.uid 
          ? "editor" 
          : data.sharedWith?.[user.uid];
        
        if (userRole === "viewer") {
          showToast("You have view-only access to this diagram", "info");
        }
      } catch (err) {
        console.error("Error loading diagram:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load diagram";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    loadDiagram();
  }, [id, user, navigate, setNodes, setEdges]);

  useEffect(() => {
    if (!id || id === "new" || !user || !diagramOwner || !isEditor) return;
    if (nodes.length === 0 && edges.length === 0) return;

    setHasUnsavedChanges(true);

    const timeout = setTimeout(async () => {
      setIsSaving(true);
      
      try {
        await saveDiagram(id, diagramOwner, nodes, edges);
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error("Error auto-saving diagram:", err);
        showToast("Failed to auto-save. Your changes might not be saved.", "error");
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [nodes, edges, id, user, diagramOwner, isEditor]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!isEditor) {
        showToast("You don't have permission to edit this diagram", "warning");
        return;
      }
      setEdges((eds) => addEdge(connection, eds));
    },
    [isEditor, setEdges]
  );

  const addNode = (shape: ShapeType) => {
    if (!isEditor) {
      showToast("You don't have permission to edit this diagram", "warning");
      return;
    }

    const uid = crypto.randomUUID();

    const centerPosition = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const randomOffset = {
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
    };

    const newNode: Node = {
      id: uid,
      type: "shape",
      position: {
        x: centerPosition.x + randomOffset.x,
        y: centerPosition.y + randomOffset.y,
      },
      data: {
        label: `${shape} node`,
        shape,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    showToast("Node added", "success");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner size="large" message="Loading diagram..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
        }}
      >
        <div
          style={{
            padding: "30px",
            background: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#721c24", marginBottom: "10px" }}>
            {error}
          </h2>
          <p style={{ color: "#721c24", marginBottom: "20px" }}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "30px",
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#856404", marginBottom: "10px" }}>
            Access Denied
          </h2>
          <p style={{ color: "#856404" }}>
            You don't have permission to view this diagram.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {isOwner && (
          <button
            onClick={() => setShowShareDialog(true)}
            style={{
              padding: "8px 16px",
              background: COLORS.PRIMARY,
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = COLORS.PRIMARY_HOVER;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = COLORS.PRIMARY;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Share
          </button>
        )}

        {(isSaving || hasUnsavedChanges) && (
          <div
            style={{
              padding: "8px 16px",
              background: isSaving ? COLORS.WARNING : COLORS.SUCCESS,
              color: "white",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {isSaving ? "Saving..." : "Saved"}
          </div>
        )}
      </div>

      {hasAccess && role === "viewer" && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            background: COLORS.WARNING,
            color: "white",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          View Only Mode
        </div>
      )}

      {isEditor && <NodePanel onAdd={addNode} />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={isEditor ? onNodesChange : undefined}
        onEdgesChange={isEditor ? onEdgesChange : undefined}
        onConnect={onConnect}
        fitView
        nodesDraggable={isEditor}
        nodesConnectable={isEditor}
        elementsSelectable={isEditor}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {showShareDialog && id && (
        <ShareDialog
          diagramId={id}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}

export default function DiagramEditorPage() {
  return (
    <ReactFlowProvider>
      <DiagramEditor />
    </ReactFlowProvider>
  );
}