import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Skill, Task } from "../../types";

interface UserInfo {
  id: string;
  username: string;
  xp: number;
  level: number;
  tasks: Task[];
  skills: Skill[];
}

// Initialize store
export const [userInfo, setUserInfo] = createStore<UserInfo>({
  id: "",
  username: "",
  xp: 0,
  level: 0,
  tasks: [],
  skills: [],
});

export const [taskToEdit, setTaskToEdit] = createSignal<Task | null>(null);
