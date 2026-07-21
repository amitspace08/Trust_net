import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { getMutualConnection } from "./trustService";
/*
notifications

receiverUID
senderUID
title
message
type
createdAt
read
*/

// =======================================
// Send Notification
// =======================================

export async function sendNotification(
  receiverUID: string,
  senderUID: string,
  title: string,
  message: string,
  type: string
) {
  try {
    await addDoc(
      collection(db, "notifications"),
      {
        receiverUID,
        senderUID,
        receiver: receiverUID, // backward compatibility
        sender: senderUID,     // backward compatibility
        title,
        message,
        type,
        createdAt: serverTimestamp(),
        timestamp: serverTimestamp(), // backward compatibility
        read: false,
      }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Backward compatibility export for guardianService and frontend UI
export async function sendSOSNotification(
  sender: string,
  receiver: string
) {
  await sendNotification(
    receiver,
    sender,
    "SOS Alert",
    `${sender} has triggered an SOS`,
    "SOS"
  );
}

// =======================================
// Notify Layer 1 Contacts
// =======================================

export async function notifyLayer1(
  sessionId: string
) {
  try {
    const snap = await getDoc(
      doc(db, "sos_sessions", sessionId)
    );

    if (!snap.exists()) return;

    const data = snap.data();

    const contacts = data.layer1Alerted || [];

    for (const uid of contacts) {
      await sendNotification(
        uid,
        data.triggeredBy,
        "SOS Alert",
        "Emergency assistance required.",
        "SOS"
      );
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Notify Responders
// =======================================

export async function notifyResponders(
  sessionId: string
) {
  try {
    const responders = await getDocs(
      collection(
        db,
        "sos_sessions",
        sessionId,
        "responders"
      )
    );

    const sos = await getDoc(
      doc(db, "sos_sessions", sessionId)
    );

    if (!sos.exists()) return;

    const owner = sos.data().triggeredBy;

    responders.forEach(async (r) => {
      await sendNotification(
        r.id,
        owner,
        "SOS Ended",
        "Emergency has ended.",
        "END_SOS"
      );
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Get Notifications
// =======================================

export async function getNotifications(
  uid: string
) {
  const q = query(
    collection(db, "notifications"),
    where("receiverUID", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }));
}

// =======================================
// Notify Layer 2 Candidates
// =======================================

export async function notifyLayer2(
  sessionId: string,
  candidateUIDs: string[],
  distressedUID: string
) {
  try {

    for (const uid of candidateUIDs) {

      const mutual = await getMutualConnection(
        distressedUID,
        uid
      );

      const message = mutual
        ? `${mutual.displayName}'s trusted friend needs emergency assistance nearby.`
        : "A nearby user needs emergency assistance.";

      await sendNotification(
        uid,
        distressedUID,
        "Layer 2 SOS Alert",
        message,
        "LAYER2_SOS"
      );
    }

  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Notify Next Layer 2 Candidate
// =======================================

export async function notifyNextCandidate(
  sessionId: string,
  nextCandidateUID: string,
  distressedUID: string
) {
  try {

    const mutual = await getMutualConnection(
      distressedUID,
      nextCandidateUID
    );

    const message = mutual
      ? `${mutual.displayName}'s trusted friend still needs emergency help.`
      : "Emergency assistance is still required nearby.";

    await sendNotification(
      nextCandidateUID,
      distressedUID,
      "Layer 2 SOS Retry",
      message,
      "LAYER2_RETRY"
    );

  } catch (err) {
    console.error(err);
    throw err;
  }
}