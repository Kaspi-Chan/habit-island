// auth.ts
import { FirebaseError } from "firebase/app";
import { auth } from "./firebase.js";
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
    await updateProfile(user, { displayName: username });
    console.log(user);
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
  return signInWithPopup(auth, provider);
};

export const logout = async (): Promise<void> => {
  return signOut(auth);
};
