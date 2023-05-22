"use strict";

import { createMember, createPayment } from "./rest-services.js";
import { displayMembersUpdated } from "./view-members.js";
import { getAge, getPrice } from "./helpers.js";

function openCreateMemberDialog() {
  console.log("---openCreateMemberDialog()---");
  document.querySelector("#dialog-create-member").showModal();
  document
    .querySelector("#create-member-btn")
    .addEventListener("click", createMemberClicked);
}

async function createMemberClicked(event) {
  event.preventDefault();
  // Get activity
  const activity = [];
  if (document.querySelector("#create-activity-breast").checked)
    activity.push("brystsvømning");
  if (document.querySelector("#create-activity-butterfly").checked)
    activity.push("butterfly");
  if (document.querySelector("#create-activity-crawl").checked)
    activity.push("crawl");
  if (document.querySelector("#create-activity-rygcrawl").checked)
    activity.push("rygcrawl");
  console.log(activity);
  const newMember = {
    name: document.querySelector("#create-name").value,
    dob: document.querySelector("#create-dob").value,
    email: document.querySelector("#create-mail").value,
    membershipActive: document.querySelector("#create-active").value,
    membershipDate: document.querySelector("#create-membershipdate").value,
    gender: document.querySelector("#create-gender").value,
    membershipLevel: document.querySelector("#create-membershiplevel").value,
    profileImage:
      document.querySelector("#create-img").value === ""
        ? "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
        : document.querySelector("#create-img").value,
    activity: activity,
  };
  const uid = await createMember(newMember);
  // Calculate payment for rest of year
  const startYear = new Date(
    document
      .querySelector("#create-membershipdate")
      .valueAsDate.getFullYear()
      .toString() + "-01-01"
  );
  const endYear = new Date(
    document
      .querySelector("#create-membershipdate")
      .valueAsDate.getFullYear()
      .toString() + "-12-31"
  );
  const memberDate = document.querySelector(
    "#create-membershipdate"
  ).valueAsDate;
  const paymentFraction = (endYear - memberDate) / (endYear - startYear);
  newMember.age = getAge(newMember.dob);
  getPrice(newMember);

  const payment = Math.ceil(newMember.price * paymentFraction);
  const memberDateString = memberDate.toISOString().substring(0, 10);
  await createPayment(uid, memberDateString, payment);

  document.querySelector("#dialog-create-member").close();
  document.querySelector("#create-form").reset();
  displayMembersUpdated();
}

export { openCreateMemberDialog };
