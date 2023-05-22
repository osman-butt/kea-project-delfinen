"use strict";

import { getMembers, updateMember } from "./rest-services.js";
import { displayMembersUpdated } from "./view-members.js";

function showUpdateDialog() {
  console.log("---showUpdateDialog()---");

  document.querySelector("#dialog-update-member").showModal();
  document
    .querySelector("#open-update-member-dialog")
    .removeEventListener("click", showUpdateDialog);
  document
    .querySelector("#update-member-btn")
    .addEventListener("click", updateMemberClicked);
  displayMemberDate();
}

async function displayMemberDate() {
  const id = document
    .querySelector("#dialog-update-member")
    .getAttribute("data-id");
  const members = await getMembers();
  const member = members.find(row => row.id === id);
  console.log(member);

  document.querySelector("#update-name").value = member.name;
  document.querySelector("#update-dob").value = member.dob;
  document.querySelector("#update-mail").value = member.email;
  document.querySelector("#update-active").value = member.membershipActive;
  document.querySelector("#update-membershipdate").value =
    member.membershipDate;
  document.querySelector("#update-gender").value = member.gender;
  document.querySelector("#update-membershiplevel").value =
    member.membershipLevel;
  // ACTIVITY
  document.querySelector("#activity-breast").checked =
    member.activity.includes("brystsvømning");
  document.querySelector("#activity-butterfly").checked =
    member.activity.includes("butterfly");
  document.querySelector("#activity-crawl").checked =
    member.activity.includes("crawl");
  document.querySelector("#activity-rygcrawl").checked =
    member.activity.includes("rygcrawl");
  document.querySelector("#update-img").value = member.profileImage;
}

async function updateMemberClicked(event) {
  event.preventDefault();
  const id = document
    .querySelector("#dialog-update-member")
    .getAttribute("data-id");
  const activity = [];
  if (document.querySelector("#activity-breast").checked)
    activity.push("brystsvømning");
  if (document.querySelector("#activity-butterfly").checked)
    activity.push("butterfly");
  if (document.querySelector("#activity-crawl").checked) activity.push("crawl");
  if (document.querySelector("#activity-rygcrawl").checked)
    activity.push("rygcrawl");
  const updatedMember = {
    name: document.querySelector("#update-name").value,
    dob: document.querySelector("#update-dob").value,
    email: document.querySelector("#update-mail").value,
    membershipActive: document.querySelector("#update-active").value,
    membershipDate: document.querySelector("#update-membershipdate").value,
    gender: document.querySelector("#update-gender").value,
    membershipLevel: document.querySelector("#update-membershiplevel").value,
    profileImage: document.querySelector("#update-img").value,
    activity: activity,
  };
  console.log(updatedMember);
  await updateMember(id, updatedMember);
  document.querySelector("#dialog-update-member").close();
  document.querySelector("#dialog-read-member").close();
  displayMembersUpdated();
}

export { showUpdateDialog };
