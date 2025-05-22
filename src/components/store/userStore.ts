import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { createStore } from "solid-js/store";

export type skillType =
  | "Physical Health & Fitness"
  | "Emotional Well-Being"
  | "Career & Finances"
  | "Relationships & Social"
  | "Personal Growth & Purpose"
  | string;

export type motivation = 1 | 2 | 3 | 4 | 5;
export type periodAmount = "1" | "2" | "3" | "4" | "5" | "6";
export type periodKind = "days" | "weeks" | "months" | "years";
export type repeatPeriod = { amount: periodAmount; kind: periodKind };

export interface Task {
  id: string;
  title: string;
  categories: string[];
  xp: number;
  dueDate: Timestamp | Date;
  motivation: motivation;
  repeat: boolean;
  repeatPeriod?: repeatPeriod;
  overdue: boolean;
}

export interface Skill {
  name: skillType;
  level: number;
  currentXP: number;
}

export interface UserAnimals {
  name: string;
  type: string;
}

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
