import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc9ngpaHNcMJy7A8ajNIvbYtEPyt9YhfI",
  authDomain: "trustnet-c6a94.firebaseapp.com",
  projectId: "trustnet-c6a94",
  storageBucket: "trustnet-c6a94.firebasestorage.app",
  messagingSenderId: "947759878994",
  appId: "1:947759878994:web:899dac1eb729557243e08b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MOCK_USERS = [
  { uid: "mock_user_1", displayName: "Aarav Mehta", email: "aarav@trustnet.com", phone: "+919876543210" },
  { uid: "mock_user_2", displayName: "Diya Patel", email: "diya@trustnet.com", phone: "+919876543211" },
  { uid: "mock_user_3", displayName: "Kabir Singh", email: "kabir@trustnet.com", phone: "+919876543212" },
  { uid: "mock_user_4", displayName: "Isha Sharma", email: "isha@trustnet.com", phone: "+919876543213" },
  { uid: "mock_user_5", displayName: "Reyansh Gupta", email: "reyansh@trustnet.com", phone: "+919876543214" }
];

async function seed() {
  console.log("Seeding 5 mock client accounts...");
  for (const user of MOCK_USERS) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email_id: user.email,
      phone_no: user.phone,
      profile_photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`,
      verification_status: true,
      online: true,
      createdAt: serverTimestamp(),
    });
    
    // Seed initial locations
    const locRef = doc(db, "user_locations", user.uid);
    await setDoc(locRef, {
      uid: user.uid,
      latitude: 28.6139 + (Math.random() - 0.5) * 0.01,
      longitude: 77.209 + (Math.random() - 0.5) * 0.01,
      sharingEnabled: true,
      timestamp: serverTimestamp(),
    });
  }
  
  console.log("Creating relationships...");
  // Aarav (mock_user_1) is friends with Diya, Kabir, and Isha
  const rels = [
    { id: "rel_1_2", userA: "mock_user_1", userB: "mock_user_2", status: "accepted", relation: "Family" },
    { id: "rel_1_3", userA: "mock_user_1", userB: "mock_user_3", status: "accepted", relation: "Friend" },
    { id: "rel_1_4", userA: "mock_user_1", userB: "mock_user_4", status: "accepted", relation: "Friend" },
    { id: "rel_2_3", userA: "mock_user_2", userB: "mock_user_3", status: "accepted", relation: "Friend" },
    { id: "rel_2_5", userA: "mock_user_2", userB: "mock_user_5", status: "pending", relation: "Family" }
  ];

  for (const rel of rels) {
    const relRef = doc(db, "trust_relationships", rel.id);
    await setDoc(relRef, {
      userA: rel.userA,
      userB: rel.userB,
      status: rel.status,
      relation: rel.relation,
      createdAt: serverTimestamp(),
    });
  }

  console.log("Seeding complete successfully!");
}

seed().catch(console.error);
