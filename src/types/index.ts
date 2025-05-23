import { Timestamp } from "firebase/firestore";

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
  dueDate: Timestamp;
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
