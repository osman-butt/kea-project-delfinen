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
    <th class="col1">Navn</th>
    <th class="col2">Email</th>
    <th class="col3">Fødselsdato</th>
    <th class="col4">Alder</th>
    <th class="col5">Aktivt medlem</th>
    <th class="col6">Aktiviteter</th>
  </tr>`;
  table.insertAdjacentHTML("beforeend", tableHeader);
  const data = await getMembers(auth);
  console.log(data);
  data.forEach(displayMember);
}

function getAge(dateString) {
  const today = new Date();
  const dob = new Date(dateString);
  let age = today.getFullYear() - dob.getFullYear();
  if (today.getMonth() - dob.getMonth() < 0) {
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
      <td class="col1">${listOfMembers.name}</td>
      <td class="col2">${listOfMembers.email}</td>
      <td class="col3">${listOfMembers.dob}</td>
      <td class="col4">${listOfMembers.age}</td>
      <td class="col5">${listOfMembers.membershipActive ? "Ja" : "Nej"}</td>
      <td class="col6">${listOfMembers.activity.sort().join(", ")}</td>
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
