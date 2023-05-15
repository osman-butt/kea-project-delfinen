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

async function displayMember(memberObj) {
  const members = document.querySelector("#member-table");
  memberObj.age = getAge(memberObj.dob);
  memberObj.membershipType = memberObj.age < 18 ? "Junior" : "Senior";
  const html = /*html*/ `
  <article>
    <tr class="member-table-row">
      <td><img src="${
        memberObj.profileImage
      }" alt="" style="object-fit: contain; width:2em; border-radius: 2em"/></td>
      <td class="col1">${memberObj.name}</td>
      <td class="col2">${memberObj.email}</td>
      <td class="col3">${memberObj.dob}</td>
      <td class="col4">${memberObj.age}</td>
      <td class="col5">${memberObj.membershipActive}</td>
      <td class="col6">${memberObj.activity.sort().join(", ")}</td>
    </tr>
  </article>
  `;
  members.insertAdjacentHTML("beforeend", html);

  // Show dialog
  document
    .querySelector("#member-table tbody:last-child")
    .addEventListener("click", () => showReadMemberDialog(memberObj));
}

function showReadMemberDialog(memberObj) {
  document.querySelector("#dialog-read-member-img").src =
    memberObj.profileImage;
  document.querySelector("#dialog-read-member-name").textContent =
    memberObj.name;
  document.querySelector("#dialog-read-member-dob").textContent = memberObj.dob;
  document.querySelector("#dialog-read-member-age").textContent = memberObj.age;
  document.querySelector("#dialog-read-member-gender").textContent =
    memberObj.gender;
  document.querySelector("#dialog-read-member-email").textContent =
    memberObj.email;
  document.querySelector("#dialog-read-member-membershipActive").textContent =
    memberObj.membershipActive;
  document.querySelector("#dialog-read-member-membershipDate").textContent =
    memberObj.membershipDate;
  document.querySelector("#dialog-read-member-activity").textContent =
    memberObj.activity.join(", ");
  document.querySelector("#dialog-read-member-membershipType").textContent =
    memberObj.membershipType;
  document.querySelector("#dialog-read-member-membershipLevel").textContent =
    memberObj.membershipLevel;
  document.querySelector("#dialog-read-member").showModal();
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
