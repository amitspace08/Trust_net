import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const markNotificationRead = async (id: string) => {
  await updateDoc(doc(db, "notifications", id), {
    read: true,
  });
};
