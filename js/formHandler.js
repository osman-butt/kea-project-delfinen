import { createMember } from "./rest-services.js";
import { displayMembers } from "./view-members.js";

export function attachCreateMemberListener() {
  const createMemberButton = document.getElementById("create-member");
  const formModal = document.getElementById("member-form-modal");
  const formContent = document.getElementById("member-form-content");

  createMemberButton.addEventListener("click", async function (event) {
    event.preventDefault();
    event.stopPropagation();

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

    console.log("Checked activities: ", activities);

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
      profileImage,
      mebershipDate
    );

    console.log(`New Member: ${JSON.stringify(newMember)}`);

    // Show the success message
    createNotification("Ny bruger oprettet");

    // Reset the form and Close it
    formContent.reset();
    document.getElementById("member-form-modal").style.display = "none";

    // Call the function to update the member display
    displayMembers();
  });
}

function createNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.classList.add("notification");
  document.body.appendChild(notification);

  // Hide the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}
