import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJsanc6AoJsVmtKNFTqEdq3kduW8e7b6I",
  authDomain: "mobileapp-fe3bc.firebaseapp.com",
  projectId: "mobileapp-fe3bc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

