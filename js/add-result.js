"use strict";

//import modules
import {
  getMembers,
  createResult,
  getMembersUpdate,
  getResults,
  getResultsUpdate,
} from "./rest-services.js";
import { updateDisplayResults } from "./view-results.js";
import { getAge } from "./helpers.js";

function openAddResultDialog() {
  document
    .querySelector("#submit-result")
    .addEventListener("click", saveResultClicked);
  document.querySelector("#add-result-form").reset();
  const dropdown = document.querySelector("#choose-member");
  const dialog = document.querySelector("#add-result-dialog");
  const type = document.querySelector("#choose-type");

  document
    .querySelectorAll(".competition-result")
    .forEach(el => el.setAttribute("readonly", ""));

  document
    .querySelectorAll(".member-dropdown-option")
    .forEach(row => row.remove());

  document
    .querySelectorAll(".activity-dropdown-option")
    .forEach(row => row.remove());
  document
    .querySelectorAll(".team-dropdown-option")
    .forEach(row => row.remove());

  dropdown.addEventListener("change", () => {
    dialog.setAttribute("data-id", dropdown.value);
    document
      .querySelectorAll(".activity-dropdown-option")
      .forEach(row => row.remove());
    document
      .querySelectorAll(".team-dropdown-option")
      .forEach(row => row.remove());
    activityDropdown();
    teamDropdown();
  });

  type.addEventListener("change", () => {
    if (type.value === "Ja") {
      document
        .querySelectorAll(".competition-result")
        .forEach(el => el.removeAttribute("readonly"));
    } else {
      document.querySelectorAll(".competition-result").forEach(el => {
        el.setAttribute("readonly", "");
        el.value = "";
      });
    }
  });

  dialog.showModal();
  membersDropdown();
}

async function membersDropdown() {
  console.log("---membersDropdown()---");
  const allMembers = await getMembers();
  const competitionMembers = allMembers.filter(
    row => row.membershipLevel === "Konkurrence"
  );
  competitionMembers.forEach(memberDropdownOption);
}

function memberDropdownOption(memberObj) {
  const dropdown = document.querySelector("#choose-member");
  const option = /*html*/ `
    <option class="member-dropdown-option" value="${memberObj.id}">${memberObj.name}</option>
  `;
  dropdown.insertAdjacentHTML("beforeend", option);
}

async function activityDropdown() {
  console.log("---activityDropdown()---");
  const dialog = document.querySelector("#add-result-dialog");
  const allMembers = await getMembers();
  const id = dialog.getAttribute("data-id");
  const memberActivities = allMembers.filter(row => row.id === id);
  memberActivities[0].activity.forEach(activityDropdownOption);
}

function activityDropdownOption(activity) {
  const dropdown = document.querySelector("#choose-activity");
  const option = /*html*/ `
    <option class="activity-dropdown-option" value="${activity}">${activity}</option>
  `;
  dropdown.insertAdjacentHTML("beforeend", option);
}

async function teamDropdown() {
  console.log("---teamDropdown()---");
  const dialog = document.querySelector("#add-result-dialog");
  const dropdown = document.querySelector("#choose-team");
  const allMembers = await getMembers();
  const id = dialog.getAttribute("data-id");
  const memberActivities = allMembers.filter(row => row.id === id);
  memberActivities[0].team =
    getAge(memberActivities[0].dob) < 18 ? "junior" : "senior";
  const option = /*html*/ `
    <option class="team-dropdown-option" value="${memberActivities[0].team}">${memberActivities[0].team}</option>
  `;
  dropdown.insertAdjacentHTML("beforeend", option);
}

async function saveResultClicked(event) {
  event.preventDefault();
  const resultType = document.querySelector("#choose-type").value;
  const resultObj = {
    memberId: document
      .querySelector("#add-result-dialog")
      .getAttribute("data-id"),
    activity: document.querySelector("#choose-activity").value,
    time: document.querySelector("#time-result").value,
    date: document.querySelector("#date-result").value,
    distance: document.querySelector("#choose-distance").value,
    meet:
      resultType === "Ja"
        ? document.querySelector("#competition-name").value
        : "Træning",
    location:
      resultType === "Ja"
        ? document.querySelector("#competition-venue").value
        : "",
    placement:
      resultType === "Ja"
        ? document.querySelector("#competition-placement").value
        : "",
  };
  await createResult(resultObj);
  document.querySelector("#add-result-dialog").close();
  updateDisplayResults();
}
export { openAddResultDialog };
