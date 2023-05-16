"use strict";

//import modules
import { getPayments } from "./rest-services.js";
import { paymentsUI } from "./helpers.js";

async function displayPayments() {
  paymentsUI();
  const data = await getPayments();
  data.forEach(displayMember);
}
