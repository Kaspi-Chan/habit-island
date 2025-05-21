// auth.ts
import { FirebaseError } from "firebase/app";
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  updateProfile,
} from "firebase/auth";
import { getAuthErrorMessage } from "./ErrorHandler/index.js";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { DEFAULT_SKILLS } from "../config.js";
import { initUserDocument } from "./firestore.js";

export const registerWithEmail = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    await updateProfile(user, { displayName: username });
    await initUserDocument(user, userRef);
  } catch (error) {
    if (error instanceof FirebaseError) {
      return getAuthErrorMessage(error.code);
    }
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      return getAuthErrorMessage(error.code);
    }
  }
};

export const loginWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  const user = userCredential.user;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await initUserDocument(user, userRef);
  }

  return userCredential;
};

export const logout = async (): Promise<void> => {
  return signOut(auth);
};
