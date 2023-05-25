"use strict";

//import modules
import {
  getPayments,
  getMembers,
  createPayment,
  getPaymentsUpdate,
  getUser,
} from "./rest-services.js";
import { paymentsUI } from "./helpers.js";
import { getSearchPaymentsList } from "./search-payments.js";

let userRole = "";

async function displayPayments() {
  const user = await getUser();
  userRole = user.role;
  paymentsUI();
  const payments = await getPayments();
  const members = await getMembers();
  const mergedList = calcSum(mergeArrays(payments, members));
  mergedList.sort((a, b) => b.sum - a.sum);
  mergedList.forEach(displayPayment);
  const sum = /*html*/ `
    <tr class="payment-table-sum" style="font-weight: bold;">
      <td></td>
      <td class="col1"></td>
      <td class="col3"></td>
      <td class="col3">SUM</td>
      <td class="currency-format">${mergedList.reduce(
        (partialSum, obj) => partialSum + obj.sum,
        0
      )}</td>
    </tr>
    `;
  document
    .querySelector("#payments-table")
    .insertAdjacentHTML("beforeend", sum);
  document.querySelector("#arrears-total").textContent = mergedList.reduce(
    (partialSum, obj) => partialSum + obj.sum,
    0
  );
  document
    .querySelector("#search-members-payments-btn")
    .addEventListener("click", searchPayments);
}

async function searchPayments() {
  paymentsUI();
  const mergedList = await getSearchPaymentsList();
  mergedList.forEach(displayPayment);
  const sum = /*html*/ `
    <tr class="payment-table-sum" style="font-weight: bold;">
      <td></td>
      <td class="col1"></td>
      <td class="col3"></td>
      <td class="col3">SUM</td>
      <td class="currency-format">${mergedList.reduce(
        (partialSum, obj) => partialSum + obj.sum,
        0
      )}</td>
    </tr>
    `;
  document
    .querySelector("#payments-table")
    .insertAdjacentHTML("beforeend", sum);
  document.querySelector("#arrears-total").textContent = mergedList.reduce(
    (partialSum, obj) => partialSum + obj.sum,
    0
  );
}

async function displayPaymentsUpdated() {
  paymentsUI();
  const payments = await getPaymentsUpdate();
  const members = await getMembers();
  const mergedList = calcSum(mergeArrays(payments, members));
  mergedList.sort((a, b) => b.sum - a.sum);

  mergedList.forEach(displayPayment);

  const sum = /*html*/ `
    <tr class="payment-table-sum" style="font-weight: bold;">
      <td></td>
      <td class="col1"></td>
      <td class="col3"></td>
      <td class="col3">SUM</td>
      <td class="currency-format">${mergedList.reduce(
        (partialSum, obj) => partialSum + obj.sum,
        0
      )}</td>
    </tr>
    `;
  document
    .querySelector("#payments-table")
    .insertAdjacentHTML("beforeend", sum);
  document.querySelector("#arrears-total").textContent = mergedList.reduce(
    (partialSum, obj) => partialSum + obj.sum,
    0
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
      <td class="currency-format">${paymentObj.sum}</td>
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
  if (userRole === "cashier" || userRole === "admin") {
    document.querySelector("#add-payment-btn").offsetHeight;
    document.querySelector("#add-payment-btn").classList.add("dialog-btn");
    document.querySelector("#add-payment-btn").classList.remove("hidden");
    document
      .querySelector("#add-payment-btn")
      .addEventListener("click", addPayment);
  } else {
    document.querySelector("#add-payment-btn").offsetHeight;
    document.querySelector("#add-payment-btn").classList.remove("dialog-btn");
    document.querySelector("#add-payment-btn").classList.add("hidden");
  }

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
  const addNewRow = /*html*/ `
      <tr class="newRow">
      <td><input type="date"
      id="inputDate" required/></td>
      <td>
        <select name="payment-type" id="payment-type">
          <option value="Betaling">Betaling</option>
          <option value="Regning">Regning</option>
        </select>
      </td>
      <td class="currency-format" style="font-weight: bold;"><input type="number"
      id="inputAmount" placeholder="Indtast beløb" required/></td>
    </tr>
  `;
  table.insertAdjacentHTML("beforeend", addNewRow);

  document
    .querySelector("#inputAmount")
    .addEventListener("keypress", addPaymentClicked);
}

async function addPaymentClicked(event) {
  const id = document
    .querySelector("#dialog-read-payment")
    .getAttribute("data-id");

  const inputAmount = document.querySelector("#inputAmount");
  const inputDate = document.querySelector("#inputDate");
  const check =
    inputDate.value !== "" &&
    inputAmount.value !== "" &&
    Number(inputAmount.value) > 0;
  if (event.key === "Enter" && check) {
    const amount =
      document.querySelector("#payment-type").value === "Regning"
        ? inputAmount.value
        : "-" + inputAmount.value;
    const date = inputDate.value;
    await createPayment(id, date, amount);

    document
      .querySelector("#add-payment-btn")
      .addEventListener("click", addPayment);
    closeInputPayment(date, amount);
  } else if (event.key === "Enter") {
    const table = document.querySelector("#payment-movement-table");
    document.querySelector("#payment-movement-table tbody:last-child").remove();
    const sum = document
      .querySelector("#dialog-read-payment")
      .getAttribute("data-sum");
    const sumRow = /*html*/ `
    <tr id="sumRow">
      <td></td>
      <td style="font-weight: bold;">Saldo</td>
      <td class="currency-format" style="font-weight: bold;">${sum}</td>
    </tr>
  `;
    table.insertAdjacentHTML("beforeend", sumRow);
    document
      .querySelector("#add-payment-btn")
      .addEventListener("click", addPayment);
  }
}

function closeInputPayment(date, amount) {
  const table = document.querySelector("#payment-movement-table");
  const row = /*html*/ `
    <tr>
      <td>${date}</td>
      <td>${amount >= 0 ? "Regning" : "Betaling"}</td>
      <td class="currency-format">${amount}</td>
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
      <td class="currency-format" style="font-weight: bold;">${newSum}</td>
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
      <td class="currency-format">${paymentObj.payments[key]}</td>
    </tr>
  `;
      table.insertAdjacentHTML("beforeend", row);
    }
  }
  const sumRow = /*html*/ `
    <tr id="sumRow">
      <td></td>
      <td style="font-weight: bold;">Saldo</td>
      <td class="currency-format" style="font-weight: bold;">${paymentObj.sum}</td>
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
