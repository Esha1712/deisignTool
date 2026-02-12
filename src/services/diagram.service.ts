import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import type { Diagram } from "../types/diagram.types";

export const createDiagram = async (diagram: Diagram) => {
  const ref = doc(collection(db, "diagrams"));
  await setDoc(ref, { ...diagram, id: ref.id });
};

export const getUserDiagrams = async (uid: string) => {
  const q = query(
    collection(db, "diagrams"),
    where("ownerId", "==", uid)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Diagram);
};
