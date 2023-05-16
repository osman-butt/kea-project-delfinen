import { createMember } from "./rest-services.js";

export function attachCreateMemberListener() {
  const createMemberButton = document.getElementById("create-member");

  createMemberButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const age = document.getElementById("age").value;
    const activities = Array.from(
      document.getElementById("activities").selectedOptions
    ).map((option) => option.value);

    console.log(name, email, dob, age, activities);

    const newMember = await createMember(name, email, dob, age, activities);
    console.log(`New Member: ${JSON.stringify(newMember)}`);
  });
}
