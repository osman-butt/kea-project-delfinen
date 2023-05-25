"use strict";

// Import modules
import {
  getMembers,
  fetchCreatedInvoices,
  createPayment,
  setCreatedInvoice,
} from "./rest-services.js";
import { getAge, getPrice } from "./helpers.js";

// Each year on 1. january, invoices are created.
// The function checks if the invoices has already been created.
// If they are not created the function creates invoices, and sets
// createdInvoice year to true.
async function createAutomaticInvoice() {
  const createdInvoices = await fetchCreatedInvoices();
  const today = new Date(Date.now());
  const todayFormatted =
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  const isInvoiceCreated = createdInvoices[today.getFullYear()];
  if (todayFormatted === "01-01" && !isInvoiceCreated) {
    const members = await getMembers();
    const todayDate = today.getUTCFullYear() + "-01-01";
    members.forEach(member => (member.age = getAge(member.dob)));
    members.forEach(getPrice);
    members.forEach(async function (member) {
      await createPayment(member.id, todayDate, member.price);
    });

    console.log(todayDate);
    await setCreatedInvoice(today.getFullYear().toString());
    // await createPayment(members[0].id, todayDate, members[0].price);
  }
}

export { createAutomaticInvoice };
