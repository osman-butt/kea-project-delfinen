"use strict";

//import modules
import { getPayments, getMembers } from "./rest-services.js";
import { paymentsUI } from "./helpers.js";

async function displayPayments() {
  paymentsUI();
  const payments = await getPayments();
  const members = await getMembers();
  const mergedList = calcSum(mergeArrays(payments, members));
  mergedList.sort((a, b) => b.sum - a.sum);
  console.log("MERGED LIST");
  console.log(mergedList);
  mergedList.forEach(displayPayment);
}

async function displayPayment(paymentObj) {
  const members = document.querySelector("#payments-table");
  const html = /*html*/ `
  <article>
    <tr class="payment-table-row">
      <td><img src="${paymentObj.member.profileImage}" alt="" style="object-fit: contain; width:2em; border-radius: 2em"/></td>
      <td class="col1">${paymentObj.member.name}</td>
      <td class="col3">${paymentObj.member.membershipActive}</td>
      <td class="col2">${paymentObj.sum}</td>
    </tr>
  </article>
  `;
  members.insertAdjacentHTML("beforeend", html);
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

export { displayPayments };
