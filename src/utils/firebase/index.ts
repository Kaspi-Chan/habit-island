import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { setUserInfo } from "../../components/store/userStore";

export const getUserData = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userSnap = await getDoc(userDocRef);
  const data = userSnap.data();

  return data;
};
