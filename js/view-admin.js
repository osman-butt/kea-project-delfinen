"use strict";
import { auth } from "./authentication.js";
import { getUser, getMembers, getPayments } from "./rest-services.js";
import { getAge, getPrice } from "./helpers.js";
const endpoint =
  "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app/";

async function displayAdminPage() {
  resetUI();
  console.log("displayContent()");
  const uid = await auth.uid;
  const userInfo = await getUser();
  const lastLogin = new Date(userInfo.lastLogin);
  buildUserUI(
    userInfo.profileImage,
    userInfo.name,
    userInfo.email,
    userInfo.role,
    lastLogin.toLocaleDateString() + " kl." + lastLogin.toLocaleTimeString()
  );
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;
  const lastYear = today.getFullYear() - 1;
  const lastMonth = today.getMonth();
  const members = await getMembers();
  members.forEach(row => (row.age = getAge(row.dob).toString()));
  members.forEach(getPrice);
  if (userInfo.role === "chairman" || userInfo.role === "admin") {
    const membersThisYear = members.filter(
      row => row.membershipDate.substring(0, 4) === thisYear.toString()
    );
    const membersThisMonth = membersThisYear.filter(
      row =>
        row.membershipDate.substring(5, 7) ===
        thisMonth.toString().padStart(2, "0")
    );
    const membersLastYear = members.filter(
      row => row.membershipDate.substring(0, 4) === lastYear.toString()
    );
    const membersLastMonth = membersThisYear.filter(
      row =>
        row.membershipDate.substring(5, 7) ===
        lastMonth.toString().padStart(2, "0")
    );

    buildAdminUserUI(
      membersThisMonth.length,
      membersLastMonth.length,
      membersThisYear.length,
      membersLastYear.length
    );
  } else if (userInfo.role === "trainer") {
    const team = userInfo.team;
    if (team === "junior") {
      const teamMembers = members.filter(
        row => row.age < 18 && row.membershipLevel === "Konkurrence"
      );
      const teamMembersThisMonth = teamMembers.filter(
        row =>
          row.membershipDate.substring(5, 7) ===
          thisMonth.toString().padStart(2, "0")
      );
      buildTrainerUserUI(team, teamMembers.length, teamMembersThisMonth.length);
    } else {
      const teamMembers = members.filter(
        row => row.age >= 18 && row.membershipLevel === "Konkurrence"
      );
      const teamMembersThisMonth = teamMembers.filter(
        row =>
          row.membershipDate.substring(5, 7) ===
          thisMonth.toString().padStart(2, "0")
      );
      buildTrainerUserUI(team, teamMembers.length, teamMembersThisMonth.length);
    }
  } else if (userInfo.role === "cashier") {
    const expIncome = members.reduce(
      (partialSum, obj) => partialSum + obj.price,
      0
    );
    const payments = await getPayments();
    const mergedList = calcSum(mergeArrays(payments, members));
    const total = mergedList.reduce(
      (partialSum, obj) => partialSum + obj.sum,
      0
    );
    buildCashierUserUI(expIncome + " kr.", total + " kr.");
  }
}
function buildUserUI(img, name, mail, role, lastLogin) {
  console.log("buildUserUI()");
  const home = document.querySelector("#home");
  const user = /*html*/ `
        <div id="admin-info-container">
          <div style=" padding: 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <img id="admin-image" src="${img}" alt="" style="width: 3em; height: 3em; border-radius: 3em;">
            <p id="admin-name" style="font-size: 18px; font-weight: bold;">${name}</p>
          </div>
          <div style="padding: 1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>E-mail:</p>
            <p id="admin-mail">${mail}</p>
          </div>
          <div style="padding: 0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Bruger type:</p>
            <p id="admin-role">${role}</p>
          </div>
          <div style="padding: 0 1em 1em 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Sidst logget ind:</p>
            <p id="admin-lastlogin">${lastLogin}</p>
          </div>
        </div>
    `;
  home.insertAdjacentHTML("beforeend", user);
}

function buildAdminUserUI(thisMonth, lastMonth, thisYear, lastYear) {
  console.log("buildAdminUserUI()");
  const home = document.querySelector("#home");
  const admin = /*html*/ `
        <div id="user-content" style="margin: 1em; border-radius: 1em;">
          <div style="padding:1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang denne måned: </p>
            <p id="admin-member-month">${thisMonth}</p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang sidste måned: </p>
            <p id="admin-member-lastmonth">${lastMonth}</p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang i år: </p>
            <p id="admin-member-year">${thisYear}</p>
          </div>
          <div style="padding:0 1em 1em 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang sidste år: </p>
            <p id="admin-member-lastyear">${lastYear}</p>
          </div>
        </div>
    `;
  home.insertAdjacentHTML("beforeend", admin);
}

function buildTrainerUserUI(team, members, addedMembers) {
  console.log("buildTrainerUserUI()");
  const home = document.querySelector("#home");
  const trainer = /*html*/ `
        <div id="user-content" style="margin: 1em; border-radius: 1em;">
          <div style="padding:1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Team: </p>
            <p id="trainer-team">${team}</p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlemmer i teamet: </p>
            <p id="trainer-members">${members}</p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Tilføjet til team denne måned: </p>
            <p id="trainer-members-month">${addedMembers}</p>
          </div>
        </div>
    `;
  home.insertAdjacentHTML("beforeend", trainer);
}

function buildCashierUserUI(expIncome, unpaid) {
  console.log("buildCashierUserUI()");
  const home = document.querySelector("#home");
  const cashier = /*html*/ `
        <div id="user-content" style="margin: 1em; border-radius: 1em;">
          <div style="padding:1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Forventet kontingent i år: </p>
            <p id="cashier-income">${expIncome}</p>
          </div>
          <div style="padding:0 1em 1em 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Restancer i alt: </p>
            <p id="cashier-total">${unpaid}</p>
          </div>
        </div>
    `;
  home.insertAdjacentHTML("beforeend", cashier);
}

async function cashierExpectedIncome(members) {
  const payments = await getPayments();
  const mergedList = calcSum(mergeArrays(payments, members));
  const total = mergedList.reduce((partialSum, obj) => partialSum + obj.sum, 0);
}

function calcSum(list) {
  for (const obj of list) {
    obj.sum = Object.values(obj.payments).reduce(
      (sum, entry) => sum + entry,
      0
    );
  }
  return list;
}

function resetUI() {
  console.log("resetUI()");
  document.querySelector("#home").textContent = "";
  if (document.querySelector("#user-content")) {
    document.querySelector("#user-content").textContent = "";
  }
}

function mergeArrays(arr1, arr2) {
  let res = [];
  res = arr1.map(obj => {
    const index = arr2.findIndex(el => el["id"] == obj["id"]);
    const { profileImage } = index !== -1 ? arr2[index] : {};
    const { name } = index !== -1 ? arr2[index] : {};
    const { email } = index !== -1 ? arr2[index] : {};
    const { membershipActive } = index !== -1 ? arr2[index] : {};
    const { membershipDate } = index !== -1 ? arr2[index] : {};
    const { membershipLevel } = index !== -1 ? arr2[index] : {};
    return {
      ...obj,
      member: {
        profileImage,
        name,
        email,
        membershipActive,
        membershipDate,
        membershipLevel,
      },
    };
  });
  return res;
}

export { displayAdminPage };
