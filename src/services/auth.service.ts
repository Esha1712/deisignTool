import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  FirestoreError,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import type { AppUser } from "../types/user.types";

const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    default:
      return "An error occurred during login. Please try again.";
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: "Please enter both email and password.",
      };
    }

    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: getAuthErrorMessage(error as AuthError),
    };
  }
};

export const logout = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Failed to log out. Please try again.",
    };
  }
};

export const listenToAuthChanges = (
  callback: (user: AppUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    try {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      const docRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const userData = snapshot.data();
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          role: userData.role,
        });
      } else {
        console.warn(
          `User document not found for uid: ${firebaseUser.uid}`
        );
        callback(null);
      }
    } catch (error) {
      console.error("Error in auth state change listener:", error);
      callback(null);
    }
  });
};

export const getUserByEmail = async (
  email: string
): Promise<{ id: string; email: string; role: string } | null> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const userData = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      email: userData.email,
      role: userData.role,
    };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    
    if (error instanceof FirestoreError) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    throw error;
  }
};
