"use strict";

import { getMembers } from "./rest-services.js";

function openCreateMemberDialog() {
  console.log("---openCreateMemberDialog()---");
  document.querySelector("#dialog-create-member").showModal();
}

export { openCreateMemberDialog };
