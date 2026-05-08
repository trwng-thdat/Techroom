const form = document.querySelector("#teacherLoginForm");
const usernameInput = document.querySelector("#teacherUsername");
const passwordInput = document.querySelector("#teacherPassword");
const forgotButton = document.querySelector("#forgotPassword");
const applyButton = document.querySelector("#applyAccess");

function showToast(message) {
  const existingToast = document.querySelector(".toast");

  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === "teacher" && password === "123") {
    window.location.href = "my-classes/index.html";
  } else {
    showToast("Invalid username or password. Please try again.");
  }
});

forgotButton.addEventListener("click", () => {
  showToast("Password recovery will be added in the next screen.");
});

applyButton.addEventListener("click", () => {
  showToast("Application flow will be added soon.");
});
