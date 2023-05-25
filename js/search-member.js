"use strict";

//import modules
import { getMembers } from "./rest-services.js";
import { getAge } from "./helpers.js";

async function getSearchMemberList() {
  const searchKeyword = document.querySelector("#member-search").value;
  const filterKeyword = document.querySelector("#filter-member").value;

  const membersList = await getMembers();
  membersList.forEach(row => (row.age = getAge(row.dob).toString()));
  let filteredMembersList = membersList;

  if (filterKeyword === "") {
    filteredMembersList = membersList.filter(
      obj =>
        obj.name.includes(searchKeyword) ||
        obj.email.includes(searchKeyword) ||
        obj.age.includes(searchKeyword)
    );
  } else if (filterKeyword === "name") {
    filteredMembersList = membersList.filter(obj =>
      obj.name.includes(searchKeyword)
    );
  } else if (filterKeyword === "email") {
    filteredMembersList = membersList.filter(obj =>
      obj.email.includes(searchKeyword)
    );
  } else if (filterKeyword === "age") {
    filteredMembersList = membersList.filter(obj =>
      obj.age.includes(searchKeyword)
    );
  } else if (filterKeyword === "senior") {
    filteredMembersList = membersList.filter(obj => Number(obj.age) >= 18);
  } else if (filterKeyword === "junior") {
    filteredMembersList = membersList.filter(obj => Number(obj.age) < 18);
  } else if (filterKeyword === "Konkurrence") {
    filteredMembersList = membersList.filter(
      obj => obj.membershipLevel === "Konkurrence"
    );
    filteredMembersList = filteredMembersList.filter(
      obj =>
        obj.name.includes(searchKeyword) ||
        obj.email.includes(searchKeyword) ||
        obj.age.includes(searchKeyword)
    );
  } else if (filterKeyword === "Motionist") {
    filteredMembersList = membersList.filter(
      obj => obj.membershipLevel === "Motionist"
    );
    filteredMembersList = filteredMembersList.filter(
      obj =>
        obj.name.includes(searchKeyword) ||
        obj.email.includes(searchKeyword) ||
        obj.age.includes(searchKeyword)
    );
  } else if (
    filterKeyword === "butterfly" ||
    filterKeyword === "brystsvømning" ||
    filterKeyword === "rygcrawl"
  ) {
    filteredMembersList = membersList.filter(obj =>
      obj.activity.join(", ").includes(filterKeyword)
    );
    filteredMembersList = filteredMembersList.filter(
      obj =>
        obj.name.includes(searchKeyword) ||
        obj.email.includes(searchKeyword) ||
        obj.age.includes(searchKeyword)
    );
  } else if (filterKeyword === "crawl") {
    filteredMembersList = membersList.filter(
      obj =>
        obj.activity.join(", ").includes(", " + filterKeyword) ||
        obj.activity.join(", ").includes(filterKeyword + ",")
    );
    filteredMembersList = filteredMembersList.filter(
      obj =>
        obj.name.includes(searchKeyword) ||
        obj.email.includes(searchKeyword) ||
        obj.age.includes(searchKeyword)
    );
  }

  document.querySelector("#showing-members").textContent =
    filteredMembersList.length;
  document.querySelector("#total-members").textContent = membersList.length;

  return filteredMembersList;
}

export { getSearchMemberList };
