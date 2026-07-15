import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const sendSOSNotification = async (
  sender: string,
  receiver: string
) => {
  await addDoc(collection(db, "notifications"), {
    sender,
    receiver,
    message: `${sender} has triggered an SOS`,
    read: false,
    timestamp: serverTimestamp(),
  });

  console.log("Notification sent to", receiver);
};