import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "real-time-chat-app-27264.firebaseapp.com",
  projectId: "real-time-chat-app-27264",
  storageBucket: "real-time-chat-app-27264.firebasestorage.app",
  messagingSenderId: "1024031441748",
  appId: "1:1024031441748:web:c2a8997789dce08610bec1",
  measurementId: "G-05YTJLTVJ5",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
