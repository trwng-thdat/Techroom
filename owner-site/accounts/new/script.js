const newAccountForm = document.querySelector("#newAccountForm");
const fullName = document.querySelector("#fullName");
const accessRole = document.querySelector("#accessRole");

newAccountForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!fullName.value.trim() || !accessRole.value) {
    showToast("Add a full name and access role before creating the account.");
    return;
  }

  showToast("Account invitation created.");
  window.setTimeout(() => {
    window.location.href = "../index.html";
  }, 500);
});
