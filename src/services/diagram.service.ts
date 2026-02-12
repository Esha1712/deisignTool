import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Diagram } from "../types/diagram.types";
import type { Node, Edge } from "reactflow";

export const createDiagram = async (diagram: Omit<Diagram, "id">) => {
  const ref = doc(collection(db, "diagrams"));
  await setDoc(ref, { ...diagram, id: ref.id, updatedAt: serverTimestamp() });
  return ref.id;
};

export const saveDiagram = async (
  id: string,
  ownerId: string,
  nodes: Node[],
  edges: Edge[],
): Promise<void> => {
  await setDoc(doc(db, "diagrams", id), {
    ownerId,
    nodes,
    edges,
    updatedAt: serverTimestamp(),
  });
};

export const getDiagram = async (
  id: string,
): Promise<{
  ownerId: string;
  nodes: Node[];
  edges: Edge[];
} | null> => {
  const snapshot = await getDoc(doc(db, "diagrams", id));
  return snapshot.exists() ? (snapshot.data() as any) : null;
};

export const getUserDiagrams = async (uid: string) => {
  const q = query(collection(db, "diagrams"), where("ownerId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Diagram);
};
