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
import { setUserInfo, Task } from "../components/store/userStore.js";
import { collection, onSnapshot } from "firebase/firestore";

interface AuthContextType {
  user: () => User | null;
  setUser: Setter<User | null>;
}

const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null);

  // Subscribe to auth state changes
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);

    if (!currentUser) return;

    setUserInfo({ id: currentUser.uid, username: currentUser.displayName! });
    const tasksCol = collection(db, "users", currentUser.uid, "tasks");
    onSnapshot(tasksCol, (snapshot) => {
      const list = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Task)
      );
      setUserInfo("tasks", list);
    });
  });

  // Clean up subscription on unmount
  onCleanup(() => unsubscribe());

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};
