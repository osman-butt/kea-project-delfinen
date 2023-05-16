import { createMember } from "./rest-services.js";

export function attachCreateMemberListener() {
  const createMemberButton = document.getElementById("create-member");

  createMemberButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const membershipActive = document.getElementById("membershipActive").value;
    const membershipLevel = document.getElementById("membershipLevel").value;
    const activities = Array.from(
      document.querySelectorAll('input[name="activities"]:checked')
    ).map((checkbox) => checkbox.value);
    const profileImage = document.getElementById("profileImage").files[0];

    console.log(
      name,
      email,
      dob,
      gender,
      membershipActive,
      membershipLevel,
      activities
    );

    const newMember = await createMember(
      name,
      email,
      dob,
      gender,
      membershipActive,
      membershipLevel,
      activities,
      profileImage
    );
    console.log(`New Member: ${JSON.stringify(newMember)}`);
  });
}
