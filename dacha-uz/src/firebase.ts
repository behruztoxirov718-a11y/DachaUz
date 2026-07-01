import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjVkWRyhS32P_1YXTm7u0t5K1wmS6P7CQ",
  authDomain: "dachauz-8c4c0.firebaseapp.com",
  projectId: "dachauz-8c4c0",
  storageBucket: "dachauz-8c4c0.firebasestorage.app",
  messagingSenderId: "260819280631",
  appId: "1:260819280631:web:ffad75cf1171cd720ee9f2",
  measurementId: "G-VP1PHTVNWM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);