"use strict";

//import modules
import {
  getMembers,
  getMembersUpdate,
  getResults,
  getResultsUpdate,
} from "./rest-services.js";

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
  dropdown.addEventListener("change", () => {
    dialog.setAttribute("data-id", dropdown.value);
    document
      .querySelectorAll(".activity-dropdown-option")
      .forEach(row => row.remove());
    activityDropdown();
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

export { openAddResultDialog };
