// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHai6shnkLaXKVygmhPDYoD1hsIOJ-ePI",
  authDomain: "mutual-link-d70e6.firebaseapp.com",
  databaseURL:
    "https://mutual-link-d70e6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mutual-link-d70e6",
  storageBucket: "mutual-link-d70e6.firebasestorage.app",
  messagingSenderId: "719171955777",
  appId: "1:719171955777:web:6b87f16598d336bb116ac0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
