import { addDoc, collection, GeoPoint, getDocs, query, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/firebase";

// =======================================
// Register Safe Space
// =======================================

export async function registerSafeSpace(
  name: string,
  type: string,
  latitude: number,
  longitude: number,
  address: string,
) {
  try {
    const docRef = await addDoc(collection(db, "safe_spaces"), {
      name,

      type,

      geopoint: new GeoPoint(latitude, longitude),

      address,

      verified: true,

      registeredAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error(err);

    throw err;
  }
}

// =======================================
// Calculate Distance
// =======================================

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;

  const toRadians = (x: number) => (x * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);

  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// =======================================
// Nearest Safe Space
// =======================================

export async function getNearestSafeSpace(latitude: number, longitude: number) {
  const snapshot = await getDocs(query(collection(db, "safe_spaces")));

  let nearest = null;

  let bestDistance = Number.MAX_VALUE;

  snapshot.forEach((doc) => {
    const data = doc.data();

    const distance = calculateDistance(
      latitude,

      longitude,

      data.geopoint.latitude,

      data.geopoint.longitude,
    );

    if (distance < bestDistance) {
      bestDistance = distance;

      nearest = {
        id: doc.id,

        distance,

        ...data,
      };
    }
  });

  return nearest;
}

// =======================================
// Safe Spaces Within Radius
// =======================================

export async function getSafeSpacesWithinRadius(
  latitude: number,
  longitude: number,
  radius: number,
) {
  const snapshot = await getDocs(query(collection(db, "safe_spaces")));

  const spaces: any[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    const distance = calculateDistance(
      latitude,

      longitude,

      data.geopoint.latitude,

      data.geopoint.longitude,
    );

    if (distance <= radius) {
      spaces.push({
        id: doc.id,

        distance,

        ...data,
      });
    }
  });

  return spaces.sort((a, b) => a.distance - b.distance);
}
