import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Skill, Task, UserAnimal } from "../../types";

interface UserInfo {
  id: string;
  username: string;
  xp: number;
  level: number;
  isReady: boolean;
  tasks: Task[];
  skills: Skill[];
  animals: UserAnimal[] | null;
}

// Initialize store
export const [userInfo, setUserInfo] = createStore<UserInfo>({
  id: "",
  username: "",
  xp: 0,
  level: 0,
  isReady: false,
  tasks: [],
  skills: [],
  animals: null,
});

export const [taskToEdit, setTaskToEdit] = createSignal<Task | null>(null);
