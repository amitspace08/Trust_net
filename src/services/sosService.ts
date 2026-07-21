import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { findGuardianAngels, getLayer1Contacts } from "./trustService";
import { updateGuardianRating } from "./userService";
import { db } from "../firebase/firebase";
import { getLayer2Candidates, rankLayer2Candidates } from "./trustService";
/*
Collection

sos_sessions

Fields

sessionId
triggeredBy
status
layerActive
startTime
endTime
layer1Alerted
layer1Acknowledged
*/

// ==============================
// Trigger SOS
// ==============================

export async function triggerSOS(uid: string, arg2?: number | string[], arg3?: number) {
  try {
    let lat: number | undefined;
    let lng: number | undefined;
    let layer1Contacts: string[] = [];

    if (typeof arg2 === "number" && typeof arg3 === "number") {
      // Called as: triggerSOS(uid, lat, lng)
      lat = arg2;
      lng = arg3;
      // Fetch layer 1 contacts automatically
      const l1Docs = await getLayer1Contacts(uid);
      layer1Contacts = l1Docs.map((c: any) => (c.userA === uid ? c.userB : c.userA));
    } else if (Array.isArray(arg2)) {
      // Called as: triggerSOS(uid, layer1Contacts)
      layer1Contacts = arg2;
      // Retrieve location from user_locations if possible
      try {
        const userLocRef = doc(db, "user_locations", uid);
        const userLocSnap = await getDoc(userLocRef);
        if (userLocSnap.exists()) {
          const locData = userLocSnap.data();
          if (locData.geopoint) {
            lat = locData.geopoint.latitude;
            lng = locData.geopoint.longitude;
          } else if (typeof locData.latitude === "number") {
            lat = locData.latitude;
            lng = locData.longitude;
          }
        }
      } catch (e) {
        console.error("Could not fetch user location for SOS session:", e);
      }
    }

    const docRef = await addDoc(collection(db, "sos_sessions"), {
      triggeredBy: uid,
      status: "active",
      active: true, // backward compatibility
      layerActive: 1,
      startTime: serverTimestamp(),
      timestamp: serverTimestamp(), // backward compatibility
      endTime: null,
      layer1Alerted: layer1Contacts,
      layer1Acknowledged: null,
      latitude: lat ?? 28.6139,
      longitude: lng ?? 77.209,
      geopoint: lat !== undefined && lng !== undefined ? new GeoPoint(lat, lng) : null,
    });

    await updateDoc(doc(db, "sos_sessions", docRef.id), {
      sessionId: docRef.id,
    });

    return docRef.id;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ==============================
// Cancel SOS
// ==============================

export async function cancelSOS(sessionId: string) {
  try {
    await updateDoc(doc(db, "sos_sessions", sessionId), {
      status: "cancelled",
      active: false, // backward compatibility
      endTime: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ==============================
// Acknowledge SOS
// ==============================

export async function acknowledgeSOS(
  sessionId: string,

  responderUID: string,
) {
  try {
    await updateDoc(
      doc(db, "sos_sessions", sessionId),

      {
        layer1Acknowledged: responderUID,

        status: "resolved",
      },
    );
  } catch (err) {
    console.error(err);

    throw err;
  }
}

// ==============================
// End SOS
// ==============================

export async function endSOS(sessionId: string) {
  try {
    await updateDoc(
      doc(db, "sos_sessions", sessionId),

      {
        status: "resolved",
        active: false, // backward compatibility

        endTime: serverTimestamp(),
      },
    );
  } catch (err) {
    console.error(err);

    throw err;
  }
}

// ==============================
// Archive SOS
// ==============================

export async function archiveSOS(sessionId: string) {
  const source = doc(
    db,

    "sos_sessions",

    sessionId,
  );

  const snap = await getDoc(source);

  if (!snap.exists()) return;

  await setDoc(
    doc(db, "sos_history", sessionId),

    snap.data(),
  );

  await deleteDoc(source);
}

// =======================================
// Add Responder
// =======================================

export async function addResponder(
  sessionId: string,
  uid: string,
  name: string,
  lat: number,
  lng: number,
) {
  try {
    await setDoc(doc(db, "sos_sessions", sessionId, "responders", uid), {
      uid,
      name,
      respondedAt: serverTimestamp(),
      currentLocation: new GeoPoint(lat, lng),
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Update Responder Location
// =======================================

export async function updateResponderLocation(
  sessionId: string,
  uid: string,
  lat: number,
  lng: number,
) {
  try {
    await updateDoc(doc(db, "sos_sessions", sessionId, "responders", uid), {
      currentLocation: new GeoPoint(lat, lng),
      respondedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Listen SOS Session
// =======================================

export function listenSOS(sessionId: string, callback: (data: any) => void) {
  return onSnapshot(doc(db, "sos_sessions", sessionId), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}

// =======================================
// Get SOS Session
// =======================================

export async function getSOSSession(sessionId: string) {
  try {
    const snap = await getDoc(doc(db, "sos_sessions", sessionId));

    if (!snap.exists()) {
      return null;
    }

    return {
      id: snap.id,
      ...(snap.data() as any),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Trigger Layer 2
// =======================================

export async function triggerLayer2(sessionId: string, distressedLocation: GeoPoint) {
  try {
    const session = await getSOSSession(sessionId);

    if (!session) {
      throw new Error("SOS session not found.");
    }

    const candidates = await getLayer2Candidates(session.triggeredBy);

    const ranked = await rankLayer2Candidates(candidates, distressedLocation);

    await updateDoc(doc(db, "sos_sessions", sessionId), {
      layerActive: 2,
      layer2Alerted: ranked.map((c) => c.uid),
      layer2Acknowledged: null,
      layer2TriggerTime: serverTimestamp(),
      declinedCandidates: [],
    });

    return ranked;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Acknowledge Layer 2
// =======================================

export async function acknowledgeLayer2(sessionId: string, responderUID: string) {
  try {
    await updateDoc(doc(db, "sos_sessions", sessionId), {
      layer2Acknowledged: responderUID,
      status: "resolved",
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Decline Layer 2
// =======================================

export async function declineLayer2(sessionId: string, responderUID: string) {
  try {
    const ref = doc(db, "sos_sessions", sessionId);

    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    const declined = data.declinedCandidates || [];

    if (!declined.includes(responderUID)) {
      declined.push(responderUID);
    }

    await updateDoc(ref, {
      declinedCandidates: declined,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Start Layer 2 Timeout
// =======================================

export function startLayer2Timeout(sessionId: string) {
  setTimeout(async () => {
    const ref = doc(db, "sos_sessions", sessionId);

    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.layer2Acknowledged) return;

    await updateDoc(ref, {
      layerActive: 3,
      layer2Timeout: true,
    });
  }, 120000);
}

// =======================================
// Delete Layer 2 Alerts
// =======================================

export async function deleteLayer2Alerts(sessionId: string) {
  const q = query(collection(db, "active_layer2_alerts"), where("sessionId", "==", sessionId));

  const snapshot = await getDocs(q);

  for (const document of snapshot.docs) {
    await deleteDoc(document.ref);
  }
}

// =======================================
// Trigger Layer 3
// =======================================

export async function triggerLayer3(sessionId: string, distressedLocation: GeoPoint) {
  try {
    const guardians = await findGuardianAngels(distressedLocation);

    await updateDoc(doc(db, "sos_sessions", sessionId), {
      layerActive: 3,
      layer3Alerted: guardians.map((g) => g.uid),
      layer3Acknowledged: null,
      layer3TriggerTime: serverTimestamp(),
    });

    return guardians;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================================
// Acknowledge Layer 3
// =======================================

export async function acknowledgeLayer3(sessionId: string, guardianUID: string) {
  try {
    await updateDoc(doc(db, "sos_sessions", sessionId), {
      layer3Acknowledged: guardianUID,
      status: "resolved",
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
} // =======================================
// Decline Layer 3
// =======================================

export async function declineLayer3(sessionId: string, guardianUID: string) {
  try {
    const ref = doc(db, "sos_sessions", sessionId);

    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    const declined = data.declinedGuardians || [];

    if (!declined.includes(guardianUID)) {
      declined.push(guardianUID);
    }

    await updateDoc(ref, {
      declinedGuardians: declined,
    });
  } catch (err) {
    console.error(err);

    throw err;
  }
}

// Backward compatibility for Map UI
export function subscribeToSOS(callback: (sessions: any[]) => void) {
  const q = query(collection(db, "sos_sessions"), where("active", "==", true));

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(sessions);
  });
}
