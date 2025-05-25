import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  onSnapshot,
  writeBatch,
  DocumentReference,
  DocumentData,
  query,
  where,
  getDocs,
  getDoc,
  limit,
  WriteBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import { setUserInfo, userInfo } from "../components/store/userStore";
import { User } from "firebase/auth";
import { DEFAULT_SKILLS, XP_PER_LEVEL } from "../config";
import { produce } from "solid-js/store";
import { assignTaskProperties } from "../gemini";
import { getDay } from "../utils/utils";
import { Skill, Task, UserAnimal } from "../types";

export const addTask = async (
  userId: string,
  newTask: Omit<Task, "categories" | "xp" | "id" | "overdue">
) => {
  // prompt gemini
  const response = await assignTaskProperties(
    newTask.title,
    newTask.motivation
  );

  // use try catch
  if (!response) {
    console.log("LLM Kaput");
    return;
  }

  const parsed = JSON.parse(response.text!);
  const { categories, xp } = parsed;

  const taskCol = collection(db, "users", userId, "tasks");
  await addDoc(taskCol, {
    title: newTask.title,
    categories: [...categories],
    xp: xp,
    dueDate: newTask.dueDate,
    motivation: newTask.motivation,
    repeat: newTask.repeat,
    repeatPeriod: newTask.repeat ? newTask.repeatPeriod : null,
    overdue: false,
    createdAt: serverTimestamp(),
  });
};

export const editTask = async (
  userId: string,
  reEval: boolean,
  task: Omit<Task, "overdue">
) => {
  const { title, xp, categories, dueDate, motivation, repeat, repeatPeriod } =
    task;
  const taskDoc = doc(db, "users", userId, "tasks", task.id);

  let newXp = xp;
  if (reEval) {
    const response = await assignTaskProperties(title, motivation);

    if (response) {
      const parsed = JSON.parse(response.text!);
      newXp = parsed.xp;
    }
  }

  await updateDoc(taskDoc, {
    title: title,
    categories: [...categories],
    xp: newXp,
    dueDate: dueDate,
    motivation: motivation,
    repeat: repeat,
    repeatPeriod: repeat ? repeatPeriod : null,
  });
};

export const removeTask = async (userId: string, taskId: string) => {
  const taskDoc = doc(db, "users", userId, "tasks", taskId);
  await deleteDoc(taskDoc);
};

export const addSkill = async (userId: string, skill: Skill) => {
  const skillsCol = collection(db, "users", userId, "skills");
  await addDoc(skillsCol, {
    ...skill,
  });
};

export const addAnimal = async (userId: string, animal: UserAnimal) => {
  const animalCol = collection(db, "users", userId, "animals");
  await addDoc(animalCol, {
    ...animal,
  });
};

export const completeTaskAndAwardXp = async (userId: string, task: Task) => {
  if (task.categories.length === 0) return;

  const userRef = doc(db, "users", userId);
  const taskRef = doc(db, "users", userId, "tasks", task.id);
  const skillsCol = collection(db, "users", userId, "skills");
  const skillsQuery = query(skillsCol, where("name", "in", task.categories));

  await runTransaction(db, async (tx) => {
    // Update user info
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const newXp = userSnap.data().xp + task.xp * task.categories.length;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

    tx.update(userRef, { xp: newXp, level: newLevel });

    const skillsSnap = await getDocs(skillsQuery);
    if (skillsSnap.empty) {
      throw new Error(
        `No skills found for categories: ${task.categories.join(", ")}`
      );
    }

    // bump date of repeatable tasks
    if (task.repeat && task.repeatPeriod) {
      const newTaskDate = bumpTaskDate(task);

      tx.update(taskRef, {
        dueDate: Timestamp.fromDate(newTaskDate),
      });
    } else {
      removeTask(userId, task.id);
    }

    // update every skill affected
    skillsSnap.docs.forEach((d) => {
      const newXp = d.data().currentXP + task.xp;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

      tx.update(d.ref, {
        currentXP: newXp,
        level: newLevel,
      });
    });
  });
};

export const initUserDocument = async (
  user: User,
  userRef: DocumentReference<DocumentData, DocumentData>
) => {
  const batch = writeBatch(db);
  // create user doc
  batch.set(userRef, {
    username: user.displayName,
    email: user.email,
    level: 1,
    xp: 0,
    createdAt: serverTimestamp(),
  });

  // create skills collection
  const skillsCol = collection(userRef, "skills");
  DEFAULT_SKILLS.forEach((skill) => {
    const skillRef = doc(skillsCol);
    batch.set(skillRef, {
      name: skill,
      currentXP: 0,
      level: 1,
    });
  });

  // create animals collection

  await batch.commit();
};

export const subscribeToUserData = (user: User) => {
  setUserInfo({ id: user.uid, username: user.displayName! });

  // subscribe to level/xp
  const userRef = doc(db, "users", user.uid);
  onSnapshot(userRef, (snapshot) => {
    const data = snapshot.data() || {};

    setUserInfo(
      produce((userData) => {
        (userData.xp = data.xp ?? 0), (userData.level = data.level ?? 1);
      })
    );

    console.log(userInfo);
  });

  // subscribe to tasks
  const tasksCol = collection(db, "users", user.uid, "tasks");
  onSnapshot(tasksCol, (snapshot) => {
    const endOfDay = getDay(0);

    const list = snapshot.docs.map((d) => {
      const task = { id: d.id, ...d.data() } as Task;

      const dueDate = (task.dueDate as Timestamp).toDate();
      if (dueDate < endOfDay) task.overdue = true;

      return task;
    });
    setUserInfo("tasks", list);
  });

  // subsribe to skills
  const skillsCol = collection(db, "users", user.uid, "skills");
  onSnapshot(skillsCol, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ ...d.data() } as Skill));
    setUserInfo("skills", list);
  });

  // subscribe to animal collection
  const animalsCol = collection(db, "users", user.uid, "animals");
  onSnapshot(animalsCol, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ ...d.data() } as UserAnimal));
    setUserInfo("animals", list);
  });
};

const bumpTaskDate = (task: Task) => {
  const oldDate = (task.dueDate as Timestamp).toDate();
  const newDate = new Date();
  switch (task.repeatPeriod!.kind) {
    case "days":
      newDate.setDate(oldDate.getDate() + parseInt(task.repeatPeriod!.amount));
      break;
    case "weeks":
      newDate.setDate(
        oldDate.getDate() + 7 * parseInt(task.repeatPeriod!.amount)
      );
      break;
    case "months":
      newDate.setMonth(
        oldDate.getMonth() + parseInt(task.repeatPeriod!.amount)
      );
      break;
    case "years":
      newDate.setFullYear(
        oldDate.getFullYear() + parseInt(task.repeatPeriod!.amount)
      );
      break;
  }

  return newDate;
};
