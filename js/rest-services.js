"use strict";

const endpoint =
  "https://kea-delfinen-default-rtdb.europe-west1.firebasedatabase.app/";

// READ
async function getMembers(auth) {
  console.log("---getMembers()---");
  const token = auth.currentUser.stsTokenManager.accessToken;
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
  const token = auth.currentUser.stsTokenManager.accessToken;

  const newMember = {
    name,
    email,
    dob,
    age,
    activities,
  };

  const response = await fetch(`${endpoint}/members.json?auth=${token}`, {
    method: "POST",
    body: JSON.stringify(newMember),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("createMember status" + response.status);
    return await response.json();
  } else {
    console.log(response.status, response.statusText);
  }
}

export { getMembers, createMember };
