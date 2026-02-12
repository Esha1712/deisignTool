import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { AppUser } from "../types/user.types";

export const login = async (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => signOut(auth);

export const listenToAuthChanges = (
  callback: (user: AppUser | null) => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    const docRef = doc(db, "users", firebaseUser.uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role: snapshot.data().role,
      });
    }
  });
};
