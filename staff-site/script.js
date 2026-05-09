const staffLoginForm = document.querySelector("#staffLoginForm");
const staffUsername = document.querySelector("#staffUsername");

staffLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!staffUsername.value.trim()) {
    showToast("Enter a staff username to continue.");
    staffUsername.focus();
    return;
  }

  localStorage.setItem("staffName", staffUsername.value.trim());
  showToast("Staff session started.");
  window.setTimeout(() => {
    window.location.href = "dashboard/index.html";
  }, 450);
});
