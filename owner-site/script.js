const ownerLoginForm = document.querySelector("#ownerLoginForm");
const ownerUsername = document.querySelector("#ownerUsername");

ownerLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = ownerUsername.value.trim();

  if (!username) {
    showToast("Enter an admin username to continue.");
    ownerUsername.focus();
    return;
  }

  localStorage.setItem("adminName", username);
  showToast("Admin session started.");
  window.setTimeout(() => {
    window.location.href = "dashboard/index.html";
  }, 450);
});
