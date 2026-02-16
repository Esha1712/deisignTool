import type { Node, Edge } from "reactflow";
import type { Timestamp } from "firebase/firestore";
import type { UserRole } from "./user.types";

export interface SharedUser {
  userId: string;
  role: UserRole;
}

export interface Diagram {
  id: string;
  ownerId: string;
  nodes: Node[];
  edges: Edge[];
  sharedWith?: Record<string, UserRole>;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
}

export const isDiagram = (data: unknown): data is Diagram => {
  return (
    data !== null &&
    typeof data === "object" &&
    "id" in data &&
    "ownerId" in data &&
    "nodes" in data &&
    "edges" in data &&
    typeof (data as Diagram).id === "string" &&
    typeof (data as Diagram).ownerId === "string" &&
    Array.isArray((data as Diagram).nodes) &&
    Array.isArray((data as Diagram).edges)
  );
};
