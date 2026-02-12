import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1NYCIqeKH51UGo5o6ZxwdXNkcUIVNtBE",
  authDomain: "visual-builder-248bd.firebaseapp.com",
  projectId: "visual-builder-248bd",
  storageBucket: "visual-builder-248bd.firebasestorage.app",
  messagingSenderId: "304542501348",
  appId: "1:304542501348:web:40cb41b4688a206e435ff1",
  measurementId: "G-9M6H9JVLW5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
