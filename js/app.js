"use strict";
// import modules
import { auth, signInUser, signOutUser } from "./authentication.js";
import { onAuthStateChanged } from "./firebase-sdk.js";
import { displaySignedInUserPage, displaySignedOutPage } from "./view.js";

window.addEventListener("load", initApp);

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  document.querySelector(".login-form").addEventListener("submit", signInUser);
  document.querySelector("#signout-btn").addEventListener("click", signOutUser);
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log(user);
      console.log("USER IS LOGGED IN");
      displaySignedInUserPage();
    } else {
      console.log("USER IS NOT LOGGED IN");
      displaySignedOutPage();
    }
  });
}
