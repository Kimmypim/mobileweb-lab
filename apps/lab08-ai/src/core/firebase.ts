import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFGRwfMkJvWXkYS7QgmGS7pVJbvphIf50",
  authDomain: "ai-68525.firebaseapp.com",
  projectId: "ai-68525"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

