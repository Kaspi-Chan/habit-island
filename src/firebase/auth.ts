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
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

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
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: user.email,
      createdAt: serverTimestamp(),
    });
    await updateProfile(user, { displayName: username });
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

  if (userSnap.exists()) return userCredential;

  await setDoc(doc(db, "users", user.uid), {
    username: user.displayName,
    email: user.email,
    createdAt: serverTimestamp(),
  });

  return userCredential;
};

export const logout = async (): Promise<void> => {
  return signOut(auth);
};
