"use strict";
import { auth } from "./authentication.js";
import { getUser, getMembers, getPayments } from "./rest-services.js";
import { getAge, getPrice } from "./helpers.js";
const endpoint =
  "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app/";

async function displayAdminPage() {
  //   resetUI();
  buildUserUI();
  const uid = auth.uid;
  const userInfo = await getUser();
  const lastLogin = new Date(userInfo.lastLogin);
  document.querySelector("#admin-image").src = userInfo.profileImage;
  document.querySelector("#admin-name").textContent = userInfo.name;
  document.querySelector("#admin-mail").textContent = userInfo.email;
  document.querySelector("#admin-role").textContent = userInfo.role;
  document.querySelector("#admin-lastlogin").textContent =
    lastLogin.toLocaleDateString() + " kl." + lastLogin.toLocaleTimeString();

  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;
  const lastYear = today.getFullYear() - 1;
  const lastMonth = today.getMonth();
  const members = await getMembers();
  members.forEach(row => (row.age = getAge(row.dob).toString()));
  members.forEach(getPrice);
  if (userInfo.role === "chairman" || userInfo.role === "admin") {
    buildAdminUserUI();
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

    document.querySelector("#admin-member-month").textContent =
      membersThisMonth.length;
    document.querySelector("#admin-member-year").textContent =
      membersThisYear.length;
    document.querySelector("#admin-member-lastmonth").textContent =
      membersLastMonth.length;
    document.querySelector("#admin-member-lastyear").textContent =
      membersLastYear.length;
  } else if (userInfo.role === "trainer") {
    buildTrainerUserUI();
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
      document.querySelector("#trainer-team").textContent = team;
      document.querySelector("#trainer-members").textContent =
        teamMembers.length;
      document.querySelector("#trainer-members-month").textContent =
        teamMembersThisMonth.length;
    } else {
      const teamMembers = members.filter(
        row => row.age >= 18 && row.membershipLevel === "Konkurrence"
      );
      const teamMembersThisMonth = teamMembers.filter(
        row =>
          row.membershipDate.substring(5, 7) ===
          thisMonth.toString().padStart(2, "0")
      );
      document.querySelector("#trainer-team").textContent = team;
      document.querySelector("#trainer-members").textContent =
        teamMembers.length;
      document.querySelector("#trainer-members-month").textContent =
        teamMembersThisMonth.length;
    }
  } else if (userInfo.role === "cashier") {
    buildCashierUserUI();
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
    document.querySelector("#cashier-income").textContent = expIncome + " kr.";
    document.querySelector("#cashier-total").textContent = total + " kr.";
  }
}
function buildUserUI() {
  const home = document.querySelector("#home");
  home.textContent = "";
  const user = /*html*/ `
        <div id="admin-info-container">
          <div style=" padding: 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <img id="admin-image" src="" alt="" style="width: 3em; height: 3em; border-radius: 3em;">
            <p id="admin-name" style="font-size: 18px; font-weight: bold;">USER NAME</p>
          </div>
          <div style="padding: 1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>E-mail:</p>
            <p id="admin-mail"></p>
          </div>
          <div style="padding: 0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Bruger type:</p>
            <p id="admin-role"></p>
          </div>
          <div style="padding: 0 1em 1em 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Sidst logget ind:</p>
            <p id="admin-lastlogin"></p>
          </div>
        </div>
    `;
  home.insertAdjacentHTML("beforeend", user);
}

function buildAdminUserUI() {
  const home = document.querySelector("#home");
  const admin = /*html*/ `
        <div style="margin: 1em; border-radius: 1em;">
          <div style="padding:1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang denne måned: </p>
            <p id="admin-member-month"></p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang sidste måned: </p>
            <p id="admin-member-lastmonth"></p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang i år: </p>
            <p id="admin-member-year"></p>
          </div>
          <div style="padding:0 1em 1em 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlems tilgang sidste år: </p>
            <p id="admin-member-lastyear"></p>
          </div>
        </div>
    `;
  home.insertAdjacentHTML("beforeend", admin);
}

function buildTrainerUserUI() {
  const home = document.querySelector("#home");
  const trainer = /*html*/ `
        <div style="margin: 1em; border-radius: 1em;">
          <div style="padding:1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Team: </p>
            <p id="trainer-team"></p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Medlemmer i teamet: </p>
            <p id="trainer-members"></p>
          </div>
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Tilføjet til team denne måned: </p>
            <p id="trainer-members-month"></p>
          </div>
        </div>
    `;
  home.insertAdjacentHTML("beforeend", trainer);
}

function buildCashierUserUI() {
  const home = document.querySelector("#home");
  const cashier = /*html*/ `
        <div style="margin: 1em; border-radius: 1em;">
          <div style="padding:1em 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Forventet kontingent i år: </p>
            <p id="cashier-income"></p>
          </div>
          <!-- 
          <div style="padding:0 1em 0 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Restancer i år: </p>
            <p id="cashier-total-thisyear"></p>
          </div>
          -->
          <div style="padding:0 1em 1em 1em; display: flex; justify-content:center; column-gap: 1em; background-color: #051e34; color: white; width: 350px; margin: auto;">
            <p>Restancer i alt: </p>
            <p id="cashier-total"></p>
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
// function resetUI() {
//   document.querySelector("#admin-image").src;
//   document.querySelector("#admin-name").textContent = "";
//   document.querySelector("#admin-mail").textContent = "";
//   document.querySelector("#admin-role").textContent = "";
//   document.querySelector("#admin-lastlogin").textContent = "";
//   document.querySelector("#admin-member-month").textContent = "";
//   document.querySelector("#admin-member-year").textContent = "";
//   document.querySelector("#admin-member-lastmonth").textContent = "";
//   document.querySelector("#admin-member-lastyear").textContent = "";
// }

function calcSum(list) {
  for (const obj of list) {
    obj.sum = Object.values(obj.payments).reduce(
      (sum, entry) => sum + entry,
      0
    );
  }
  return list;
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
