// Import the functions you need from the SDKs you need
// App
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
// AUTH
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
// Realtime database
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfVIy_ovBUPkWskqSrzaT2Adh-sbi2nOs",
  authDomain: "auth-intro-app.firebaseapp.com",
  databaseURL:
    "https://auth-intro-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "auth-intro-app",
  storageBucket: "auth-intro-app.appspot.com",
  messagingSenderId: "794671497194",
  appId: "1:794671497194:web:d2852f243c080191f53c93",
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

export { app, auth, database };
