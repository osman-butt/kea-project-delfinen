"use strict";

import { auth } from "./authentication.js";
const endpoint =
  "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app/";

let listOfMembers = [];
let lastFetch = 0;

// Caching data - fetch can be performed every 10sec
async function getMembers() {
  const now = Date.now();

  if (now - lastFetch > 10_000 || listOfMembers.length === 0) {
    await fetchMembers(auth);
    console.log("FETCHED Members data");
  }
  return listOfMembers;
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
    return listOfMembers;
  } else {
    console.log(response.status, response.statusText);
  }
}

function prepareData(dataObject) {
  console.log("---prepareData---");
  const flashCards = [];
  for (const key in dataObject) {
    const flashCard = dataObject[key];
    flashCard.id = key;
    flashCards.push(flashCard);
  }
  lastFetch = Date.now();
  return flashCards;
}

export { getMembers };
