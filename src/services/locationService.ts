import {
  collection,
  doc,
  GeoPoint,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/**
 * Collection
 *
 * user_locations
 *
 * uid
 * geopoint
 * timestamp
 * sharingEnabled
 * available
 */

// ===============================
// Update My Location
// ===============================

export async function updateMyLocation(
  uid: string,
  lat: number,
  lng: number
) {
  try {
    await setDoc(
      doc(db, "user_locations", uid),
      {
        uid: uid,
        geopoint: new GeoPoint(lat, lng),
        latitude: lat,                 // compatibility field
        longitude: lng,                // compatibility field
        timestamp: serverTimestamp(),
        sharingEnabled: true,
        available: true,
      },
      { merge: true }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ===============================
// Stop Sharing
// ===============================

export async function stopSharing(uid: string) {
  try {
    await setDoc(
      doc(db, "user_locations", uid),
      {
        sharingEnabled: false,
        available: false,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ===============================
// Fetch Contact Locations
// ===============================

export async function getContactLocations(
  uidList: string[]
) {
  try {
    if (uidList.length === 0) return [];

    const q = query(
      collection(db, "user_locations"),
      where("uid", "in", uidList)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
}