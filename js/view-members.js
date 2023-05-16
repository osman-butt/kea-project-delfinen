"use strict";

//import modules
import { getMembers, getMembersUpdate, deleteMember } from "./rest-services.js";
import { getAge, membersUI } from "./helpers.js";

async function displayMembers() {
  membersUI();
  const data = await getMembers();
  data.forEach(displayMember);
}

async function displayMembersUpdated() {
  membersUI();
  const data = await getMembersUpdate();
  data.forEach(displayMember);
}

async function displayMember(memberObj) {
  const members = document.querySelector("#member-table");
  memberObj.age = getAge(memberObj.dob);
  memberObj.membershipType = memberObj.age < 18 ? "Junior" : "Senior";
  let activities = Array.isArray(memberObj.activity)
    ? memberObj.activity.sort().join(", ")
    : "N/A";
  const html = /*html*/ `
  <article>
    <tr class="member-table-row">
      <td><img src="${memberObj.profileImage}" alt="" style="object-fit: contain; width:2em; border-radius: 2em"/></td>
      <td class="col1">${memberObj.name}</td>
      <td class="col2">${memberObj.email}</td>
      <td class="col3">${memberObj.dob}</td>
      <td class="col4">${memberObj.age}</td>
      <td class="col5">${memberObj.membershipActive}</td>
      <td class="col6">${activities}</td>
    </tr>
  </article>
  `;
  members.insertAdjacentHTML("beforeend", html);

  // Show dialog
  document
    .querySelector("#member-table tbody:last-child")
    .addEventListener("click", () => showReadMemberDialog(memberObj));
}

function showDeleteDialog(memberObj) {
  document.querySelector(".dialog-delete-member").showModal();
  document
    .querySelector("#open-delete-member-dialog")
    .removeEventListener("click", showDeleteDialog);
  document
    .querySelector("#delete-member")
    .addEventListener("click", deleteMemberClicked);
}

async function deleteMemberClicked() {
  const id = document.querySelector(".dialog-delete-member").getAttribute("id");
  console.log("MEMBER WITH ID=" + id + " IS DELETED");
  await deleteMember(id);
  displayMembersUpdated();
  document.querySelector("#dialog-read-member").close();
}
function showReadMemberDialog(memberObj) {
  document
    .querySelector(".dialog-delete-member")
    .setAttribute("id", memberObj.id);
  document
    .querySelector("#open-delete-member-dialog")
    .addEventListener("click", showDeleteDialog);
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

export { displayMembers };
