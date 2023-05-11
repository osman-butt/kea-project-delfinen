"use strict";

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
  loadSignedInUI();
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

function loadSignedInUI() {
  const navLinks = document.querySelectorAll(".nav-link");
  const contentDiv = document.getElementById("content");
  const loginContainer = document.querySelector(".login-container");
  const mainContainer = document.querySelector(".main-container");

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      loadContent(event.target);
    });
  });

  function loadContent(target) {
    if (target.innerHTML.includes("Medlemsregistrering")) {
      contentDiv.innerHTML = "<h1>Velkommen til medlemsregistrering</h1>";
    } else if (target.innerHTML.includes("Kontingentstyring")) {
      contentDiv.innerHTML = "<h1>Velkommen til kontingentstyring</h1>";
    } else if (target.innerHTML.includes("Svømmeresultater")) {
      contentDiv.innerHTML = "<h1>Velkommen til svømmeresultater</h1>";
    }
  }
}

export { displaySignedInUserPage, displaySignedOutPage };
