"use strict";

//import modules
import { getMembers, getPayments } from "./rest-services.js";
import { getAge } from "./helpers.js";

async function getSearchPaymentsList() {
  const searchKeyword = document.querySelector("#member-search-payments").value;

  const membersList = await getMembers();
  membersList.forEach(row => (row.age = getAge(row.dob).toString()));
  const filteredMembersList = membersList.filter(
    obj =>
      obj.name.includes(searchKeyword) ||
      obj.email.includes(searchKeyword) ||
      obj.age.includes(searchKeyword)
  );

  const listOfId = [];

  filteredMembersList.forEach(row => listOfId.push(row.id));

  const payments = await getPayments();
  const filteredPayments = payments.filter(row => listOfId.includes(row.id));
  const mergedList = calcSum(
    mergeArrays(filteredPayments, filteredMembersList)
  );
  mergedList.sort((a, b) => b.sum - a.sum);
  return mergedList;
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

function calcSum(list) {
  for (const obj of list) {
    obj.sum = Object.values(obj.payments).reduce(
      (sum, entry) => sum + entry,
      0
    );
  }
  return list;
}

export { getSearchPaymentsList };
