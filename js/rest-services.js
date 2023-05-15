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
  console.log(listOfMembers);
  return listOfMembers;
}

async function getMembersUpdate() {
  const now = Date.now();

  if (now - lastFetch > 1 || listOfMembers.length === 0) {
    await fetchMembers(auth);
    console.log("FETCHED Members data");
  }
  console.log(listOfMembers);
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
  const dataList = [];
  for (const key in dataObject) {
    const data = dataObject[key];
    data.id = key;
    dataList.push(data);
  }
  lastFetch = Date.now();
  return dataList;
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

export { getMembers, getMembersUpdate, deleteMember };
