import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyComlFUf2tJzQstUVzJzJYb40IuPvwBrdc",
  authDomain: "trustnet-1ec23.firebaseapp.com",
  projectId: "trustnet-1ec23",
  storageBucket: "trustnet-1ec23.firebasestorage.app",
  messagingSenderId: "185380240068",
  appId: "1:185380240068:web:bc532f8873c832e14aa791",
  measurementId: "G-6Z8L8J4VZM",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);