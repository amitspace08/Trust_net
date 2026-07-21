import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

// =======================================
// Register as Guardian Angel
// =======================================

export async function registerAsGuardianAngel(uid: string) {
  try {
    await updateDoc(doc(db, "users", uid), {
      isGuardianAngel: true,
      guardianVerified: true,
      guardianRating: 0,
      guardianResponseCount: 0,
      guardianAvailable: true,
      guardianRegisteredAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);

    throw err;
  }
}

// =======================================
// Set Availability
// =======================================

export async function setGuardianAvailability(uid: string, available: boolean) {
  try {
    await updateDoc(doc(db, "users", uid), {
      guardianAvailable: available,
    });
  } catch (err) {
    console.error(err);

    throw err;
  }
}

// =======================================
// Get Guardian Profile
// =======================================

export async function getGuardianProfile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as any),
  };
}

// ======================================
// Update Guardian Rating
// ======================================

export async function updateGuardianRating(guardianUID: string, rating: number) {
  const ref = doc(db, "users", guardianUID);

  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  const oldRating = data.guardianRating || 0;

  const count = data.guardianResponseCount || 0;

  const newRating = (oldRating * count + rating) / (count + 1);

  await updateDoc(ref, {
    guardianRating: newRating,
    guardianResponseCount: count + 1,
  });
}
