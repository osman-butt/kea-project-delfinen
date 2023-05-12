"use strict";
//import modules
import { initViews, setDefaultView } from "./view-controller.js";

function displaySignedInUserPage() {
  const loginPage = document.querySelector("#login-page");
  const adminPage = document.querySelector("#admin-page");
  loginPage.offsetHeight;
  adminPage.offsetHeight;
  loginPage.classList.add("hidden");
  adminPage.classList.remove("hidden");
  const loginForm = document.querySelector("#loginUsername");
  const passwordForm = document.querySelector("#loginPassword");
  loginForm.value = "";
  passwordForm.value = "";
  setDefaultView();
  initViews();
}
function displaySignedOutPage() {
  const loginPage = document.querySelector("#login-page");
  const adminPage = document.querySelector("#admin-page");
  loginPage.offsetHeight;
  adminPage.offsetHeight;
  loginPage.classList.remove("hidden");
  adminPage.classList.add("hidden");
  const loginForm = document.querySelector("#loginUsername");
  const passwordForm = document.querySelector("#loginPassword");
  loginForm.value = "";
  passwordForm.value = "";
}

export { displaySignedInUserPage, displaySignedOutPage };
