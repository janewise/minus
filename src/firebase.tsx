import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Import the Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAGheGEkRR1InWrWoPEpoE6OuqpuPAnHYQ",
  authDomain: "datatest-b00d2.firebaseapp.com",
  databaseURL: "https://datatest-b00d2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datatest-b00d2",
  storageBucket: "datatest-b00d2.appspot.com",
  messagingSenderId: "82840275251",
  appId: "1:82840275251:web:a56133f57226c3032d5646",
  measurementId: "G-LPXJCPC29E"
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp); // Pass the initialized app to getAnalytics

// Initialize Realtime Database
const db = getDatabase(firebaseApp); // Initialize the Realtime Database

export { db };
