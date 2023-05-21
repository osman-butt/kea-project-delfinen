import { createMember } from "./rest-services.js";

export function attachCreateMemberListener() {
  const opretMedlemButton = document.getElementById("opret-medlem");
  const createMemberButton = document.getElementById("create-member");
  const formModal = document.getElementById("member-form-modal");
  const adminMessages = document.getElementById("admin-messages");

  createMemberButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const membershipActive =
      document.getElementById("membershipActive").value === "true"
        ? "Ja"
        : "Nej";
    const membershipLevel = document.getElementById("membershipLevel").value;
    const activities = Array.from(
      document.querySelectorAll('input[name="activities"]:checked')
    ).map((checkbox) => checkbox.value);
    const profileImage = document.getElementById("profileImage").files[0];

    console.log("Checked activities: ", activities); // Add this line

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

    // Show the success message
    adminMessages.textContent = `New Member: ${JSON.stringify(newMember)}`;
    adminMessages.classList.remove("hidden");

    // Hide the message after 5 seconds
    setTimeout(() => {
      adminMessages.textContent = "";
      adminMessages.classList.add("hidden");
    }, 5000);

    // Close the form
    formModal.style.display = "none";

    // Reset the form
    formModal.querySelector("form").reset();

    // Force page reload
    location.reload();
  });
}
