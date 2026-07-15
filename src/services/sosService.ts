import { db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

// Trigger SOS
export const triggerSOS = async (
  uid: string,
  lat: number,
  lng: number
) => {
  await setDoc(doc(db, "sos_sessions", uid), {
    uid,
    latitude: lat,
    longitude: lng,
    active: true,
    timestamp: serverTimestamp(),
  });
};

// Cancel SOS
export const cancelSOS = async (uid: string) => {
  await updateDoc(doc(db, "sos_sessions", uid), {
    active: false,
  });
};

// Listen for active SOS sessions
export const subscribeToSOS = (callback: any) => {
  const q = query(
    collection(db, "sos_sessions"),
    where("active", "==", true)
  );

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(sessions);
  });
};