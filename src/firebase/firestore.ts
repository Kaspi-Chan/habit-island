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
import {
  setUserInfo,
  Skills,
  Task,
  userInfo,
} from "../components/store/userStore";
import { User } from "firebase/auth";
import { DEFAULT_SKILLS, XP_PER_LEVEL } from "../config";
import { produce } from "solid-js/store";
import { assignTaskProperties } from "../gemini";

export const addTask = async (
  userId: string,
  newTask: { title: string; date: Date }
) => {
  // prompt gemini
  const response = await assignTaskProperties(newTask.title);

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
    dueDate: Timestamp.fromDate(newTask.date),
    createdAt: serverTimestamp(),
  });
};

export const removeTask = async (userId: string, taskId: string) => {
  await deleteDoc(doc(db, "users", userId, "tasks", taskId));
};

export const completeTaskAndAwardXp = async (
  userId: string,
  categories: string[],
  xpAward: number
) => {
  if (categories.length === 0) return;

  console.log(xpAward);
  const userRef = doc(db, "users", userId);
  const skillsCol = collection(db, "users", userId, "skills");
  const skillsQuery = query(skillsCol, where("name", "in", categories));

  await runTransaction(db, async (tx) => {
    // Update user info
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const newXp = userSnap.data().xp + xpAward * categories.length;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

    tx.update(userRef, { xp: newXp, level: newLevel });

    const skillsSnap = await getDocs(skillsQuery);
    if (skillsSnap.empty) {
      throw new Error(
        `No skills found for categories: ${categories.join(", ")}`
      );
    }

    // update every skill affected
    skillsSnap.docs.forEach((d) => {
      const newXp = d.data().currentXP + xpAward;
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
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
    setUserInfo("tasks", list);
  });

  // subsribe to skills
  const skillsCol = collection(db, "users", user.uid, "skills");
  onSnapshot(skillsCol, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ ...d.data() } as Skills));
    setUserInfo("skills", list);
  });

  console.log(userInfo);
};
