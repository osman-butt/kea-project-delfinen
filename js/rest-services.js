"use strict";

import { auth } from "./authentication.js";
const endpoint =
  "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app/";

let lastMemberFetch = 0;
let listOfMembers = [];
let lastPaymentFetch = 0;
let listOfPayments = [];

// Caching data - fetch can be performed every 10sec
async function getMembers() {
  const now = Date.now();

  if (now - lastMemberFetch > 10_000 || listOfMembers.length === 0) {
    await fetchMembers(auth);
    console.log("FETCHED Members data");
  }
  console.log(listOfMembers);
  return listOfMembers;
}

async function getMembersUpdate() {
  const now = Date.now();

  if (now - lastMemberFetch > 1 || listOfMembers.length === 0) {
    await fetchMembers(auth);
    console.log("FETCHED Members data");
  }
  console.log(listOfMembers);
  return listOfMembers;
}

// Caching data - fetch can be performed every 10sec
async function getPayments() {
  const now = Date.now();

  if (now - lastPaymentFetch > 10_000 || listOfPayments.length === 0) {
    await fetchPayments(auth);
    console.log("FETCHED Payments data");
  }
  console.log(listOfPayments);
  return listOfPayments;
}

async function getPaymentsUpdate() {
  const now = Date.now();

  if (now - lastPaymentFetch > 1 || listOfPayments.length === 0) {
    await fetchPayments(auth);
    console.log("FETCHED Payments data");
  }
  console.log(listOfPayments);
  return listOfPayments;
}

// READ
async function fetchMembers(auth) {
  console.log("---getMembers()---");
  const token = auth.currentUser.stsTokenManager.accessToken;
  const response = await fetch(`${endpoint}/members.json?auth=${token}`);
  if (response.ok) {
    console.log("getMembers status " + response.status);
    const data = await response.json();
    listOfMembers = prepareData(data);
    lastMemberFetch = Date.now();
    return listOfMembers;
  } else {
    console.log(response.status, response.statusText);
  }
}

async function fetchPayments(auth) {
  console.log("---fetchPayments()---");
  const token = auth.currentUser.stsTokenManager.accessToken;
  const response = await fetch(`${endpoint}/payments.json?auth=${token}`);
  if (response.ok) {
    console.log("getMembers status " + response.status);
    const data = await response.json();
    listOfPayments = prepareData(data);
    lastPaymentFetch = Date.now();
    return listOfPayments;
  } else {
    console.log(response.status, response.statusText);
  }
}

function prepareData(dataObject) {
  console.log("---prepareData---");
  const dataList = [];
  for (const key in dataObject) {
    const data = dataObject[key];
    data.id = key;
    dataList.push(data);
  }
  return dataList;
}

// create
async function createPayment(auth, uid, amount) {
  const token = auth.currentUser.stsTokenManager.accessToken;
  const now = new Date(Date.now());
  const paymentId = now.toISOString().replaceAll(":", "").replaceAll(".", "");
  const body = {};
  body[paymentId] = amount;
  const response = await fetch(
    `${endpoint}/payments/${uid}/payments.json?auth=${token}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
  if (response.ok) {
    console.log(response.status, response.statusText);
  } else {
    console.log(response.status, response.statusText);
  }
}

// delete
async function deleteMember(id) {
  console.log("---deleteMember()---");
  const token = auth.currentUser.stsTokenManager.accessToken;
  const url = `${endpoint}/members/${id}.json?auth=${token}`;
  const response = await fetch(url, { method: "DELETE" });
  if (response.ok) {
    console.log("deleteMember status " + response.status);
  } else {
    console.log(response.status, response.statusText);
  }
}

export {
  getMembers,
  getMembersUpdate,
  deleteMember,
  getPayments,
  getPaymentsUpdate,
  createPayment,
};
