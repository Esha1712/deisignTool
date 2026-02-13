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
import type { UserRole } from "../types/user.types";

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
  const existing = await getDoc(doc(db, "diagrams", id));

  const previousShared = existing.exists()
    ? existing.data().sharedWith || {}
    : {};

  await setDoc(doc(db, "diagrams", id), {
    ownerId,
    nodes,
    edges,
    sharedWith: previousShared,
    updatedAt: serverTimestamp(),
  });
};

export const getDiagram = async (
  id: string,
): Promise<Diagram | null> => {
  const snapshot = await getDoc(doc(db, "diagrams", id));
  return snapshot.exists()
    ? (snapshot.data() as Diagram)
    : null;
};

export const getUserDiagrams = async (uid: string) => {
  const q = query(collection(db, "diagrams"), where("ownerId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
} as Diagram));
};

export const shareDiagram = async (
  diagramId: string,
  targetUid: string,
  role: UserRole
) => {
  const ref = doc(db, "diagrams", diagramId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return;

  const data = snapshot.data();
  const updatedShared = {
    ...(data.sharedWith || {}),
    [targetUid]: role,
  };

  await setDoc(ref, {
    ...data,
    sharedWith: updatedShared,
    updatedAt: serverTimestamp(),
  });
};
