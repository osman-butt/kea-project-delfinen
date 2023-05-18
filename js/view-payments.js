"use strict";

//import modules
import {
  getPayments,
  getMembers,
  createPayment,
  getPaymentsUpdate,
} from "./rest-services.js";
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
  console.log(
    "SUM OF ALL " +
      mergedList.reduce((partialSum, obj) => partialSum + obj.sum, 0)
  );
}

async function displayPaymentsUpdated() {
  paymentsUI();
  const payments = await getPaymentsUpdate();
  const members = await getMembers();
  const mergedList = calcSum(mergeArrays(payments, members));
  mergedList.sort((a, b) => b.sum - a.sum);
  console.log("MERGED LIST");
  console.log(mergedList);
  mergedList.forEach(displayPayment);
  console.log(
    "SUM OF ALL " +
      mergedList.reduce((partialSum, obj) => partialSum + obj.sum, 0)
  );
}

async function displayPayment(paymentObj) {
  const members = document.querySelector("#payments-table");
  const html = /*html*/ `
  <article>
    <tr class="payment-table-row">
      <td><img src="${paymentObj.member.profileImage}" alt="" style="object-fit: contain; width:2em; border-radius: 2em"/></td>
      <td class="col1">${paymentObj.member.name}</td>
      <td class="col3">${paymentObj.member.membershipActive}</td>
      <td class="col3">${paymentObj.member.membershipDate}</td>
      <td class="col2 currency-format">${paymentObj.sum}</td>
    </tr>
  </article>
  `;
  members.insertAdjacentHTML("beforeend", html);

  // Show dialog
  document
    .querySelector("#payments-table tbody:last-child")
    .addEventListener("click", () => showReadPaymentDialog(paymentObj));
}

function showReadPaymentDialog(paymentObj) {
  // Set uid attribute
  // Add payment
  document
    .querySelector("#add-payment-btn")
    .addEventListener("click", addPayment);
  console.log("Show read payments");
  document.querySelector("#dialog-read-payment-img").src =
    paymentObj.member.profileImage;
  document.querySelector("#dialog-read-payment-name").textContent =
    paymentObj.member.name;
  document.querySelector("#dialog-read-payment-membershipActive").textContent =
    paymentObj.member.membershipActive;
  document.querySelector("#dialog-read-payment-membershipDate").textContent =
    paymentObj.member.membershipDate;
  displayPaymentMovements(paymentObj);
  document.querySelector("#dialog-read-payment").showModal();
  document
    .querySelector("#dialog-read-payment")
    .setAttribute("data-id", paymentObj.id);
  document
    .querySelector("#dialog-read-payment")
    .setAttribute("data-sum", paymentObj.sum);
}

function addPayment() {
  document
    .querySelector("#add-payment-btn")
    .removeEventListener("click", addPayment);
  const table = document.querySelector("#payment-movement-table");
  document.querySelector("#payment-movement-table tbody:last-child").remove();
  const now = new Date(Date.now());
  const dateFormated = now.toISOString().substring(0, 10);
  const addNewRow = /*html*/ `
      <tr class="newRow">
      <td><input type="date"
      id="inputDate"/></td>
      <td>
        <select name="payment-type" id="payment-type">
          <option value="Betaling">Betaling</option>
          <option value="Regning">Regning</option>
        </select>
      </td>
      <td class="col2 currency-format" style="font-weight: bold;"><input type="number"
      id="inputAmount" placeholder="Indtast beløb" /></td>
    </tr>
  `;
  table.insertAdjacentHTML("beforeend", addNewRow);
  console.log("ONE ROW ADDED");
  document
    .querySelector("#inputAmount")
    .addEventListener("keypress", addPaymentClicked);
}

async function addPaymentClicked(event) {
  const id = document
    .querySelector("#dialog-read-payment")
    .getAttribute("data-id");
  if (event.key === "Enter") {
    const amount =
      document.querySelector("#payment-type").value === "Regning"
        ? document.querySelector("#inputAmount").value
        : "-" + document.querySelector("#inputAmount").value;
    const date = document.querySelector("#inputDate").value;
    await createPayment(id, date, amount);
    console.log("CREATED PAYMENT");
    document
      .querySelector("#add-payment-btn")
      .addEventListener("click", addPayment);
    closeInputPayment(date, amount);
  }
}

function closeInputPayment(date, amount) {
  const table = document.querySelector("#payment-movement-table");
  const row = /*html*/ `
    <tr>
      <td>${date}</td>
      <td>${amount >= 0 ? "Regning" : "Betaling"}</td>
      <td class="col2 currency-format">${amount}</td>
    </tr>
    `;
  // Remove input row
  document.querySelector("#payment-movement-table tbody:last-child").remove();
  table.insertAdjacentHTML("beforeend", row);
  // Add sum row
  const sumBefore = document
    .querySelector("#dialog-read-payment")
    .getAttribute("data-sum");
  const newSum = Number(sumBefore) + Number(amount);
  const sumRow = /*html*/ `
    <tr id="sumRow">
      <td></td>
      <td style="font-weight: bold;">Saldo</td>
      <td class="col2 currency-format" style="font-weight: bold;">${newSum}</td>
    </tr>
  `;
  table.insertAdjacentHTML("beforeend", sumRow);
  document
    .querySelector("#dialog-read-payment")
    .setAttribute("data-sum", newSum);
  document
    .querySelector("#dialog-read-payment")
    .addEventListener("close", displayPaymentsUpdated);
}

function displayPaymentMovements(paymentObj) {
  const table = document.querySelector("#payment-movement-table");
  table.textContent = "";
  const tableHeader = /*html*/ `
   <tr>
    <th>Dato</th>
    <th>Type</th>
    <th class="col-right">Beløb</th>
  </tr>`;
  table.insertAdjacentHTML("beforeend", tableHeader);

  for (const key in paymentObj.payments) {
    if (key !== "2000-01-01") {
      const row = /*html*/ `
    <tr>
      <td>${key.substring(0, 10)}</td>
      <td>${paymentObj.payments[key] >= 0 ? "Regning" : "Betaling"}</td>
      <td class="col2 currency-format">${paymentObj.payments[key]}</td>
    </tr>
  `;
      table.insertAdjacentHTML("beforeend", row);
    }
  }
  const sumRow = /*html*/ `
    <tr id="sumRow">
      <td></td>
      <td style="font-weight: bold;">Saldo</td>
      <td class="col2 currency-format" style="font-weight: bold;">${paymentObj.sum}</td>
    </tr>
  `;
  table.insertAdjacentHTML("beforeend", sumRow);
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
