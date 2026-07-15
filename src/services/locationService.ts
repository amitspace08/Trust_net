import { db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export const getCurrentLocation = () => {
  return new Promise<GeolocationPosition>(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject
      );
    }
  );
};

export const updateMyLocation = async (
  uid: string,
  lat: number,
  lng: number,
  sharingEnabled = true
) => {
  await setDoc(
    doc(db, "user_locations", uid),
    {
      uid,
      latitude: lat,
      longitude: lng,
      sharingEnabled,
      timestamp: serverTimestamp(),
    }
  );
}; 