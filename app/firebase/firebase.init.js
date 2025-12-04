import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCBpxLNKTU5x-9MmZSRf3DXTgg5n0sXwhA",
  authDomain: "agile-project-4600e.firebaseapp.com",
  projectId: "agile-project-4600e",
  storageBucket: "agile-project-4600e.firebasestorage.app",
  messagingSenderId: "604362064635",
  appId: "1:604362064635:web:12cff82c8bb41a5943265e",
  measurementId: "G-RS266LV1C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const storage = getStorage(app);