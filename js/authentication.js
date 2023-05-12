"use strict";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  update,
  set,
  ref,
  signOut,
  initializeApp,
  firebaseConfig,
  getAuth,
  getDatabase,
} from "./firebase-sdk.js";

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

async function signInUser(event) {
  console.log("---signIn()---");
  event.preventDefault();
  // Get form data
  const form = event.target;
  const email = form.loginUsername.value;
  const password = form.loginPassword.value;
  const now = new Date(Date.now()).toISOString();

  console.log("---signInWithEmailAndPassword---");
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      const user_data = {
        lastLogin: now,
      };
      update(ref(database, "users/" + user.uid), user_data);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("ERROR IN SIGN IN");
      // console.log(`Error code = ${errorCode}, error msg = ${errorMessage}`);
      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/invalid-email"
      ) {
        document.querySelector("#error-response").textContent =
          "Wrong username or password!";
      } else if (errorCode == "auth/user-disabled") {
        document.querySelector("#error-response").textContent =
          "User is disabled - contact admin";
      } else {
        document.querySelector("#error-response").textContent =
          "Internal server error";
      }
    });
}

async function updateLastLogin(user) {
  const now = new Date(Date.now()).toISOString();
  const obj = {
    lastLogin: now,
  };
  const endpoint =
    "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app/users/";
  const res = await fetch(endpoint + user + ".json", {
    method: "PUT",
    body: JSON.stringify(obj),
  });
}

function signOutUser() {
  signOut(auth)
    .then(() => {
      console.log("USER LOGGED OUT, auth = " + auth.currentUser);
      // Sign-out successful.
    })
    .catch(error => {
      console.log("USER DID NOT LOG OUT, auth = " + auth.currentUser);
      // An error happened.
    });
  alert("You signed out!");
}

export { auth, signInUser, signOutUser };
