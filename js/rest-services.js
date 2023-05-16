import { getAuth } from "./firebase-sdk.js";

("use strict");

const endpoint =
  "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app/";

// READ
async function getMembers() {
  console.log("---getMembers()---");

  const auth = getAuth(); // use getAuth to get the auth instance
  const token = auth.currentUser?.stsTokenManager.accessToken;
  const response = await fetch(`${endpoint}/members.json?auth=${token}`);
  if (response.ok) {
    console.log("getMembers status " + response.status);
    const data = await response.json();
    const listOfMembers = prepareData(data);
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
  return flashCards;
}

//CREATE
async function createMember(name, email, dob, age, activities) {
  console.log("---createMember()---");

  const auth = getAuth(); // use getAuth to get the auth instance
  const token = auth.currentUser?.stsTokenManager.accessToken;

  const newMember = {
    name,
    email,
    dob,
    age,
    activities,
  };

  console.log(`Creating member: ${JSON.stringify(newMember)}`);

  const response = await fetch(`${endpoint}/members.json?auth=${token}`, {
    method: "POST",
    body: JSON.stringify(newMember),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("createMember status" + response.status);
    const jsonResponse = await response.json();
    console.log(`Response: ${JSON.stringify(jsonResponse)}`);
    return jsonResponse;
  } else {
    console.log(response.status, response.statusText);
  }
}

export { getMembers, createMember };
