"use strict";
//import modules
import { auth } from "./authentication.js";
import { initViews, setDefaultView } from "./view-controller.js";
import { getMembers } from "./rest-services.js";

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
  document.querySelector("#error-response").textContent = "";
  setDefaultView();
  initViews();
  displayMembers();
}

async function displayMembers() {
  const table = document.querySelector("#member-table");
  table.textContent = "";
  const tableHeader = /*html*/ `
   <tr>
    <th></th>
    <th>Navn</th>
    <th>Email</th>
    <th>Fødselsdato</th>
    <th>Alder</th>
    <th>Aktivt medlem</th>
    <th>Aktiviteter</th>
  </tr>`;
  table.insertAdjacentHTML("beforeend", tableHeader);
  const data = await getMembers(auth);
  console.log(data);
  data.forEach(displayMember);
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function displayMember(listOfMembers) {
  const members = document.querySelector("#member-table");
  listOfMembers.age = getAge(listOfMembers.dob);
  const html = /*html*/ `
    <tr>
      <td><img src="${
        listOfMembers.profileImage
      }" alt="" style="object-fit: contain; width:2em; border-radius: 2em"/></td>
      <td>${listOfMembers.name}</td>
      <td>${listOfMembers.email}</td>
      <td>${listOfMembers.dob}</td>
      <td>${listOfMembers.age}</td>
      <td>${listOfMembers.membershipActive ? "Ja" : "Nej"}</td>
      <td>${listOfMembers.activity.sort().join(", ")}</td>
    </tr>
  `;
  members.insertAdjacentHTML("beforeend", html);
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
