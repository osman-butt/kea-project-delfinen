"use strict";

//import modules
import {
  getMembers,
  getMembersUpdate,
  getResults,
  getResultsUpdate,
} from "./rest-services.js";
import { openAddResultDialog } from "./add-result.js";
// import { resultsUI } from "./helpers.js";

async function displayResults() {
  document
    .querySelector("#add-result-btn")
    .addEventListener("click", openAddResultDialog);
  const results = await getResults();
  const members = await getMembers();
  const mergedList = mergeArrays(results, members);
  document.querySelectorAll(".result-table-row").forEach(row => row.remove());
  displayButterflyResults(mergedList);
  displayCrawlResults(mergedList);
  displayRygcrawlResults(mergedList);
  displayBrystResults(mergedList);
  document
    .querySelectorAll(".result-filter")
    .forEach(elem =>
      elem.addEventListener("change", () => showFilteredResults(mergedList))
    );
}

async function updateDisplayResults() {
  document
    .querySelector("#add-result-btn")
    .addEventListener("click", openAddResultDialog);
  const results = await getResultsUpdate();
  const members = await getMembersUpdate();
  const mergedList = mergeArrays(results, members);
  document.querySelectorAll(".result-table-row").forEach(row => row.remove());
  displayButterflyResults(mergedList);
  displayCrawlResults(mergedList);
  displayRygcrawlResults(mergedList);
  displayBrystResults(mergedList);
  document
    .querySelectorAll(".result-filter")
    .forEach(elem =>
      elem.addEventListener("change", () => showFilteredResults(mergedList))
    );
}

function showFilteredResults(mergedList) {
  console.log(mergedList);
  const team = document.querySelector("#team-filter").value;
  const gender = document.querySelector("#gender-filter").value;
  const filteredList = mergedList.filter(row => {
    return row.team.includes(team) && row.member.gender.includes(gender);
  });
  console.log(filteredList);
  document.querySelectorAll(".result-table-row").forEach(row => row.remove());
  displayButterflyResults(filteredList);
  displayCrawlResults(filteredList);
  displayRygcrawlResults(filteredList);
  displayBrystResults(filteredList);
}

function displayButterflyResults(resultList) {
  const list = resultList.filter(row => row.activity === "butterfly");
  list.sort(
    (row1, row2) =>
      Number(row1.time.replaceAll(":", "")) -
      Number(row2.time.replaceAll(":", ""))
  );
  const topFive = list.slice(0, 5);
  topFive.forEach(displayButterflyResult);
}

function displayCrawlResults(resultList) {
  const list = resultList.filter(row => row.activity === "crawl");
  list.sort(
    (row1, row2) =>
      Number(row1.time.replaceAll(":", "")) -
      Number(row2.time.replaceAll(":", ""))
  );
  const topFive = list.slice(0, 5);
  topFive.forEach(displayCrawlResult);
}
function displayRygcrawlResults(resultList) {
  const list = resultList.filter(row => row.activity === "rygcrawl");
  list.sort(
    (row1, row2) =>
      Number(row1.time.replaceAll(":", "")) -
      Number(row2.time.replaceAll(":", ""))
  );
  const topFive = list.slice(0, 5);
  topFive.forEach(displayRygcrawlResult);
}

function displayBrystResults(resultList) {
  const list = resultList.filter(row => row.activity === "brystsvømning");
  list.sort(
    (row1, row2) =>
      Number(row1.time.replaceAll(":", "")) -
      Number(row2.time.replaceAll(":", ""))
  );
  const topFive = list.slice(0, 5);
  topFive.forEach(displayBrystResult);
}

function displayButterflyResult(resultObj, index) {
  const table = document.querySelector("#butterfly-table");
  const row = /*html*/ `
    <tr class="result-table-row">
        <td class="col1 -result">${index + 1}</td>
        <td class="col2-result">${resultObj.member.name}</td>
        <td class="col3-result">${resultObj.time}</td>
        <td class="col4-result">${resultObj.meet}</td>
        <td class="col5-result">${resultObj.distance}</td>
        <td class="col6-result">${resultObj.placement}</td>
    </td>`;
  table.insertAdjacentHTML("beforeend", row);
}

function displayCrawlResult(resultObj, index) {
  const table = document.querySelector("#crawl-table");
  const row = /*html*/ `
    <tr class="result-table-row">
        <td class="col1-result">${index + 1}</td>
        <td class="col2-result">${resultObj.member.name}</td>
        <td class="col3-result">${resultObj.time}</td>
        <td class="col4-result">${resultObj.meet}</td>
        <td class="col5-result">${resultObj.distance}</td>
        <td class="col6-result">${resultObj.placement}</td>
    </td>`;
  table.insertAdjacentHTML("beforeend", row);
}

function displayRygcrawlResult(resultObj, index) {
  const table = document.querySelector("#rygcrawl-table");
  const row = /*html*/ `
    <tr class="result-table-row">
        <td class="col1-result">${index + 1}</td>
        <td class="col2-result">${resultObj.member.name}</td>
        <td class="col3-result">${resultObj.time}</td>
        <td class="col4-result">${resultObj.meet}</td>
        <td class="col5-result">${resultObj.distance}</td>
        <td class="col6-result">${resultObj.placement}</td>
    </td>`;
  table.insertAdjacentHTML("beforeend", row);
}

function displayBrystResult(resultObj, index) {
  const table = document.querySelector("#bryst-table");
  const row = /*html*/ `
    <tr class="result-table-row">
        <td class="col1-result">${index + 1}</td>
        <td class="col2-result">${resultObj.member.name}</td>
        <td class="col3-result">${resultObj.time}</td>
        <td class="col4-result">${resultObj.meet}</td>
        <td class="col5-result">${resultObj.distance}</td>
        <td class="col6-result">${resultObj.placement}</td>
    </td>`;
  table.insertAdjacentHTML("beforeend", row);
}

function mergeArrays(arr1, arr2) {
  let res = [];
  res = arr1.map(obj => {
    const index = arr2.findIndex(el => el["id"] == obj["memberId"]);
    const { profileImage } = index !== -1 ? arr2[index] : {};
    const { name } = index !== -1 ? arr2[index] : {};
    const { email } = index !== -1 ? arr2[index] : {};
    const { membershipActive } = index !== -1 ? arr2[index] : {};
    const { membershipDate } = index !== -1 ? arr2[index] : {};
    const { membershipLevel } = index !== -1 ? arr2[index] : {};
    const { activity } = index !== -1 ? arr2[index] : {};
    const { gender } = index !== -1 ? arr2[index] : {};
    return {
      ...obj,
      member: {
        profileImage,
        name,
        email,
        membershipActive,
        membershipDate,
        membershipLevel,
        activity,
        gender,
      },
    };
  });
  return res;
}

export { displayResults, updateDisplayResults };
