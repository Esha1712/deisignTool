import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Diagram } from "../types/diagram.types";
import type { Node, Edge } from "reactflow";
import type { UserRole } from "../types/user.types";

export class DiagramError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "DiagramError";
  }
}

export const createDiagram = async (
  diagram: Omit<Diagram, "id">
): Promise<string> => {
  try {
    const ref = doc(collection(db, "diagrams"));
    const diagramData = {
      ...diagram,
      id: ref.id,
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, diagramData);
    return ref.id;
  } catch (error) {
    console.error("Error creating diagram:", error);
    
    if (error instanceof FirestoreError) {
      throw new DiagramError(
        `Failed to create diagram: ${error.message}`,
        error.code
      );
    }
    
    throw new DiagramError("An unexpected error occurred while creating the diagram");
  }
};

export const saveDiagram = async (
  id: string,
  ownerId: string,
  nodes: Node[],
  edges: Edge[]
): Promise<void> => {
  try {
    if (!id || !ownerId) {
      throw new DiagramError("Diagram ID and owner ID are required");
    }

    const docRef = doc(db, "diagrams", id);
    const existing = await getDoc(docRef);

    const previousShared = existing.exists()
      ? existing.data().sharedWith || {}
      : {};

    const diagramData = {
      ownerId,
      nodes,
      edges,
      sharedWith: previousShared,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, diagramData);
  } catch (error) {
    console.error("Error saving diagram:", error);
    
    if (error instanceof DiagramError) {
      throw error;
    }
    
    if (error instanceof FirestoreError) {
      if (error.code === "permission-denied") {
        throw new DiagramError(
          "You don't have permission to save this diagram",
          error.code
        );
      }
      throw new DiagramError(
        `Failed to save diagram: ${error.message}`,
        error.code
      );
    }
    
    throw new DiagramError("An unexpected error occurred while saving the diagram");
  }
};

export const getDiagram = async (id: string): Promise<Diagram | null> => {
  try {
    if (!id) {
      throw new DiagramError("Diagram ID is required");
    }

    const docRef = doc(db, "diagrams", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as Diagram;
  } catch (error) {
    console.error("Error getting diagram:", error);
    
    if (error instanceof DiagramError) {
      throw error;
    }
    
    if (error instanceof FirestoreError) {
      if (error.code === "permission-denied") {
        throw new DiagramError(
          "You don't have permission to view this diagram",
          error.code
        );
      }
      throw new DiagramError(
        `Failed to fetch diagram: ${error.message}`,
        error.code
      );
    }
    
    throw new DiagramError("An unexpected error occurred while fetching the diagram");
  }
};

export const getUserDiagrams = async (uid: string): Promise<Diagram[]> => {
  try {
    if (!uid) {
      throw new DiagramError("User ID is required");
    }

    const q = query(collection(db, "diagrams"), where("ownerId", "==", uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Diagram[];
  } catch (error) {
    console.error("Error getting user diagrams:", error);
    
    if (error instanceof DiagramError) {
      throw error;
    }
    
    if (error instanceof FirestoreError) {
      throw new DiagramError(
        `Failed to fetch diagrams: ${error.message}`,
        error.code
      );
    }
    
    throw new DiagramError("An unexpected error occurred while fetching diagrams");
  }
};

export const getSharedDiagrams = async (uid: string): Promise<Diagram[]> => {
  try {
    if (!uid) {
      throw new DiagramError("User ID is required");
    }

    // Get all diagrams where the user is in the sharedWith map
    const allDiagramsSnapshot = await getDocs(collection(db, "diagrams"));
    
    const sharedDiagrams = allDiagramsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Diagram)
      .filter((diagram) => {
        const sharedWith = diagram.sharedWith || {};
        return uid in sharedWith && diagram.ownerId !== uid;
      });

    return sharedDiagrams;
  } catch (error) {
    console.error("Error getting shared diagrams:", error);
    
    if (error instanceof FirestoreError) {
      throw new DiagramError(
        `Failed to fetch shared diagrams: ${error.message}`,
        error.code
      );
    }
    
    throw new DiagramError("An unexpected error occurred while fetching shared diagrams");
  }
};

export const shareDiagram = async (
  diagramId: string,
  targetUid: string,
  role: UserRole
): Promise<void> => {
  try {
    if (!diagramId || !targetUid || !role) {
      throw new DiagramError("Diagram ID, target user ID, and role are required");
    }

    const ref = doc(db, "diagrams", diagramId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new DiagramError("Diagram not found", "not-found");
    }

    const data = snapshot.data();
    const updatedShared = {
      ...(data.sharedWith || {}),
      [targetUid]: role,
    };

    await setDoc(
      ref,
      {
        ...data,
        sharedWith: updatedShared,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error sharing diagram:", error);
    
    if (error instanceof DiagramError) {
      throw error;
    }
    
    if (error instanceof FirestoreError) {
      if (error.code === "permission-denied") {
        throw new DiagramError(
          "You don't have permission to share this diagram",
          error.code
        );
      }
      throw new DiagramError(
        `Failed to share diagram: ${error.message}`,
        error.code
      );
    }
    
    throw new DiagramError("An unexpected error occurred while sharing the diagram");
  }
};

export const deleteDiagram = async (id: string): Promise<void> => {
  try {
    if (!id) {
      throw new DiagramError("Diagram ID is required");
    }

    const docRef = doc(db, "diagrams", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting diagram:", error);
    
    if (error instanceof FirestoreError) {
      if (error.code === "permission-denied") {
        throw new DiagramError(
          "You don't have permission to delete this diagram",
          error.code
        );
      }
      throw new DiagramError(
        `Failed to delete diagram: ${error.message}`,
        error.code
      );
    }
    
    throw new DiagramError("An unexpected error occurred while deleting the diagram");
  }
};
