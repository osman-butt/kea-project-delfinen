"user strict";

function getAge(dateString) {
  const today = new Date();
  const dob = new Date(dateString);
  let age = today.getFullYear() - dob.getFullYear();
  if (today.getMonth() - dob.getMonth() < 0) {
    age--;
  }
  return age;
}

function membersUI() {
  const table = document.querySelector("#member-table");
  table.textContent = "";
  const tableHeader = /*html*/ `
   <tr>
    <th></th>
    <th class="col1">Navn</th>
    <th class="col2">Email</th>
    <th class="col3">Fødselsdato</th>
    <th class="col4">Alder</th>
    <th class="col5">Aktivt medlem</th>
    <th class="col6">Aktiviteter</th>
  </tr>`;
  table.insertAdjacentHTML("beforeend", tableHeader);
}

function paymentsUI() {
  const table = document.querySelector("#payments-table");
  table.textContent = "";
  const tableHeader = /*html*/ `
   <tr>
    <th></th>
    <th class="col1">Navn</th>
    <th class="col3">Aktivt medlem</th>
    <th class="col4">Medlem siden</th>
    <th>Saldo</th>
  </tr>`;
  table.insertAdjacentHTML("beforeend", tableHeader);
}

function getPrice(memberObj) {
  const prices = {
    inaktiv: 500,
    ungdom: 1000,
    senior: 1600,
    old: 1200,
  };
  memberObj.price = prices.inaktiv;
  const active = memberObj.membershipActive === "Ja";
  if (memberObj.age > 60 && active) {
    memberObj.price = prices.old;
  } else if (memberObj.age <= 60 && memberObj.age >= 18 && active) {
    memberObj.price = prices.senior;
  } else if (memberObj.age < 18 && active) {
    memberObj.price = prices.ungdom;
  }
}

export { getAge, membersUI, paymentsUI, getPrice };
