"use strict";
//import modules
import { initViews, setDefaultView } from "./view-controller.js";
import { getMembers, createMember } from "./rest-services.js";
import { auth } from "./authentication.js";

//form references
const memberForm = document.querySelector("#member-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const dobInput = document.querySelector("#dob");
const ageInput = document.querySelector("#age");
const activitiesSelect = document.querySelector("#activities");

function displaySignedInUserPage() {
  console.log("---displaySignedInUserPage()---");
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

  //Eventlistener for form
  memberForm.addEventListener("submit", formSubmitHandler);
}

async function formSubmitHandler(event) {
  event.preventDefault();

  // Get form data
  const name = nameInput.value;
  const email = emailInput.value;
  const dob = dobInput.value;
  const age = ageInput.value;
  const activities = Array.from(activitiesSelect.selectedOptions).map(
    option => option.value
  );

  // Call function to handle the form data
  const newMember = await createMember(name, email, dob, age, activities);

  // Check if member was created successfully
  if (newMember.name) {
    console.log(`New Member Created: ${JSON.stringify(newMember)}`);
    alert("Bruger er oprettet");

    // Close the form
    memberForm.classList.add("hidden");

    // Update the member display
    displayMembers();
  } else {
    console.log("Error creating new member.");
  }
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
  // console.log(`Fetched members: ${JSON.stringify(data)}`);
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
      <td class="col6">${
        listOfMembers.activities
          ? listOfMembers.activities.sort().join(", ")
          : ""
      }</td>
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

function openMemberForm() {
  console.log("openMemberForm was called");
  let memberFormModal = document.querySelector("#member-form-modal");
  let memberForm = document.querySelector("#member-form");
  nameInput.value = "";
  emailInput.value = "";
  dobInput.value = "";
  ageInput.value = "";
  activitiesSelect.selectedIndex = -1; //deselect all options
  //Show form
  memberFormModal.style.display = "block";
}

//Handle click event 'Opret Medlem'
document.addEventListener("DOMContentLoaded", function () {
  //Eventlistener for 'Opret medlem'
  document
    .querySelector("#opret-medlem")
    .addEventListener("click", openMemberForm);

  //Event listener for close button
  document.querySelector("#close-form").addEventListener("click", function () {
    document.querySelector("#member-form-modal").style.display = "none";
  });
});

export { displaySignedInUserPage, displaySignedOutPage };
