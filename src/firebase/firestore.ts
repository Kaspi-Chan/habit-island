import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const addTask = async (
  userId: string,
  newTask: { title: string; category: string; date: Date }
) => {
  const taskCol = collection(db, "users", userId, "tasks");
  await addDoc(taskCol, {
    title: newTask.title,
    category: newTask.category,
    dueDate: Timestamp.fromDate(newTask.date),
    createdAt: serverTimestamp(),
  });
};

export const removeTask = async (userId: string, taskId: string) => {
  await deleteDoc(doc(db, "users", userId, "tasks", taskId));
};
