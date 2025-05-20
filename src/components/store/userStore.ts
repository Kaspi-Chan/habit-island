import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { getUserData } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";

export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: Timestamp;
}
interface UserInfo {
  id: string;
  username: string;
  tasks: Task[];
}

// Initialize store
export const [userInfo, setUserInfo] = createStore<UserInfo>({
  id: "",
  username: "",
  tasks: [],
});
