import type { Node, Edge } from "reactflow";
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
  sharedWith?: SharedUser[];
}
