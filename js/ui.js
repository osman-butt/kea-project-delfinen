"use strict";

function loadUI() {
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

  // For logout button
  document.querySelector(".button").addEventListener("click", function (event) {
    event.preventDefault();
    loginContainer.style.display = "block";
    mainContainer.style.display = "none";
  });

  // To show UI and hide login form initially
  loginContainer.style.display = "none";
  mainContainer.style.display = "block";
}

export { loadUI };
