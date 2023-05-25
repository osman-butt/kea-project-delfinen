"use strict";

// Import modules
import {
  getMembers,
  fetchCreatedInvoices,
  createPayment,
  setCreatedInvoice,
} from "./rest-services.js";
import { getAge, getPrice } from "./helpers.js";

async function displayPaymentOverview() {
  const members = await getMembers();
  members.forEach(member => (member.age = getAge(member.dob)));
  members.forEach(getPrice);
  const inactive = members.filter(row => row.membershipActive === "Nej");
  const ungdom = members.filter(
    row => row.membershipActive === "Ja" && row.age < 18
  );
  const senior = members.filter(
    row => row.membershipActive === "Ja" && row.age >= 18 && row.age <= 60
  );
  const old = members.filter(
    row => row.membershipActive === "Ja" && row.age > 60
  );
  const inactiveNumber = inactive.length;
  const inactiveAmount = inactive.reduce(
    (partialSum, obj) => partialSum + obj.price,
    0
  );
  const ungdomNumber = ungdom.length;
  const ungdomAmount = ungdom.reduce(
    (partialSum, obj) => partialSum + obj.price,
    0
  );
  const seniorNumber = senior.length;
  const seniorAmount = senior.reduce(
    (partialSum, obj) => partialSum + obj.price,
    0
  );
  const oldNumber = old.length;
  const oldAmount = old.reduce((partialSum, obj) => partialSum + obj.price, 0);
  const allNumber = members.length;
  const allAmount = members.reduce(
    (partialSum, obj) => partialSum + obj.price,
    0
  );

  // add to DOM
  document.querySelector("#inactive-number").textContent = inactiveNumber;
  document.querySelector("#inactive-amount").textContent = inactiveAmount;
  document.querySelector("#ungdom-number").textContent = ungdomNumber;
  document.querySelector("#ungdom-amount").textContent = ungdomAmount;
  document.querySelector("#senior-number").textContent = seniorNumber;
  document.querySelector("#senior-amount").textContent = seniorAmount;
  document.querySelector("#old-number").textContent = oldNumber;
  document.querySelector("#old-amount").textContent = oldAmount;
  document.querySelector("#all-number").textContent = allNumber;
  document.querySelector("#all-amount").textContent = allAmount;
}

export { displayPaymentOverview };
