// AuthProvider.tsx
import {
  createContext,
  createSignal,
  onCleanup,
  useContext,
  ParentComponent,
  Setter,
} from "solid-js";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase/firebase.js";
import { subscribeToUserData } from "../firebase/firestore.js";

interface AuthContextType {
  user: () => User | null;
  loading: () => boolean;
  setUser: Setter<User | null>;
}

const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null);
  const [loading, setLoading] = createSignal(true);

  // Subscribe to auth state changes
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    if (!currentUser) return;

    subscribeToUserData(currentUser);
  });

  // Clean up subscription on unmount
  onCleanup(() => unsubscribe());

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
};
