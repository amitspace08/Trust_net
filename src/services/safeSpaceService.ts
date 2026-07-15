import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { getDistance } from "./guardianService";

// Register Safe Space
export const registerSafeSpace = async (
  name: string,
  type: string,
  lat: number,
  lng: number,
  address: string
) => {
  const ref = await addDoc(collection(db, "safe_spaces"), {
    name,
    type,
    latitude: lat,
    longitude: lng,
    address,
    verified: true, // automatic verification for intern demo
    registeredAt: serverTimestamp(),
  });
  return ref.id;
};

// Get Nearest Safe Space
export const getNearestSafeSpace = async (lat: number, lng: number) => {
  const q = query(collection(db, "safe_spaces"), where("verified", "==", true));
  const snap = await getDocs(q);

  let nearest: any = null;
  let minDistance = Infinity;

  snap.forEach((doc) => {
    const data = doc.data();
    const dist = getDistance(lat, lng, data.latitude, data.longitude); // in meters
    if (dist < minDistance) {
      minDistance = dist;
      nearest = {
        id: doc.id,
        ...data,
        distance: Math.round(dist), // round to nearest meter
      };
    }
  });

  return nearest;
};

// Get Safe Spaces within Radius (in Kilometers)
export const getSafeSpacesWithinRadius = async (lat: number, lng: number, radiusKm = 1) => {
  const q = query(collection(db, "safe_spaces"), where("verified", "==", true));
  const snap = await getDocs(q);

  const list: any[] = [];
  const radiusMeters = radiusKm * 1000;

  snap.forEach((doc) => {
    const data = doc.data();
    const dist = getDistance(lat, lng, data.latitude, data.longitude);
    if (dist <= radiusMeters) {
      list.push({
        id: doc.id,
        ...data,
        distance: Math.round(dist),
      });
    }
  });

  // Sort by distance (closest first)
  list.sort((a, b) => a.distance - b.distance);
  return list;
};
