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
  apiKey: "AIzaSyD5UOGy34tOzBc7HoKaodJGuiUqh_3lCl0",
  authDomain: "kea-delfinen.firebaseapp.com",
  databaseURL:
    "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kea-delfinen",
  storageBucket: "kea-delfinen.appspot.com",
  messagingSenderId: "138460549393",
  appId: "1:138460549393:web:44eadb7f646fe37d35fcb0",
};

export {
  signInWithEmailAndPassword,
  update,
  ref,
  createUserWithEmailAndPassword,
  set,
  signOut,
  onAuthStateChanged,
  initializeApp,
  firebaseConfig,
  getAuth,
  getDatabase,
};
