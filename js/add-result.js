"use strict";

//import modules
import {
  getMembers,
  getMembersUpdate,
  getResults,
  getResultsUpdate,
} from "./rest-services.js";

function openAddResultDialog() {
  document.querySelector("#add-result-dialog").showModal();
}

export { openAddResultDialog };
