import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHg3UpmOWp4IV22dIgvWbv-ta8qg4-c-E",
  authDomain: "family-chat-54406.firebaseapp.com",
  projectId: "family-chat-54406",
  storageBucket: "family-chat-54406.firebasestorage.app",
  messagingSenderId: "14179860934",
  appId: "1:14179860934:web:67f3fe0fc6dc95bc7632c7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)
