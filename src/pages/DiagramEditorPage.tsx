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
import EditableNode from "../components/EditableNode";

const nodeTypes = {
    editable: EditableNode,
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

    const addNode = () => {
        const newNode: Node = {
            id: crypto.randomUUID(),
            type: "editable", // important
            position: {
                x: Math.random() * 400,
                y: Math.random() * 400,
            },
            data: {
                label: "New Node",
                onChange: (newLabel: string) => {
                    setNodes((nds) =>
                        nds.map((node) =>
                            node.id === newNode.id
                                ? { ...node, data: { ...node.data, label: newLabel } }
                                : node
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
                <button
                    style={{ position: "absolute", zIndex: 10 }}
                    onClick={addNode}
                >
                    Add Node
                </button>
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
