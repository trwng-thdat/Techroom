function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function getUsername() {
  return localStorage.getItem("authUsername") || "Sarah";
}

function setWelcomeName() {
  const target = document.querySelector("[data-welcome-name]");
  if (!target) return;
  const username = getUsername();
  const name = username.includes("@") ? username.split("@")[0] : username;
  target.textContent = name
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function setupUsernameForm() {
  const form = document.querySelector("#usernameForm");
  const username = document.querySelector("#username");
  if (!form || !username) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = username.value.trim();
    if (!value) {
      showToast("Please enter your username.");
      username.focus();
      return;
    }

    localStorage.setItem("authUsername", value);
    window.location.href = "password/index.html";
  });
}

function setupPasswordForm() {
  const form = document.querySelector("#passwordForm");
  const password = document.querySelector("#password");
  const toggle = document.querySelector("#togglePassword");
  if (!form || !password) return;

  toggle.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (password.value.length < 4) {
      showToast("Password must contain at least 4 characters for this demo.");
      return;
    }

    localStorage.setItem("authLoggedIn", "true");
    showToast("Logged in successfully.");
    window.setTimeout(() => {
      window.location.href = "../../staff-site/dashboard/index.html";
    }, 650);
  });
}

function setupActivateForm() {
  const form = document.querySelector("#activateForm");
  const activationUser = document.querySelector("#activationUser");
  const password = document.querySelector("#newPassword");
  const confirmPassword = document.querySelector("#confirmPassword");
  const requirements = document.querySelectorAll("[data-rule]");
  if (!form || !activationUser || !password || !confirmPassword) return;

  function updateRequirements() {
    const value = password.value;
    const rules = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    };

    requirements.forEach((item) => {
      item.classList.toggle("met", Boolean(rules[item.dataset.rule]));
    });

    return Object.values(rules).every(Boolean);
  }

  password.addEventListener("input", updateRequirements);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!activationUser.value.trim()) {
      showToast("Please enter your user ID.");
      activationUser.focus();
      return;
    }

    if (!updateRequirements()) {
      showToast("Please complete all password requirements.");
      return;
    }

    if (password.value !== confirmPassword.value) {
      showToast("Password confirmation does not match.");
      confirmPassword.focus();
      return;
    }

    localStorage.setItem("authActivated", "true");
    window.location.href = "../success/index.html";
  });

  updateRequirements();
}

document.querySelectorAll(".field-control").forEach((control) => {
  control.addEventListener("click", () => {
    const input = control.querySelector("input");
    if (input && !input.readOnly) input.focus();
  });
});

setupUsernameForm();
setupPasswordForm();
setupActivateForm();
setWelcomeName();

document.addEventListener("click", (event) => {
  const toastTrigger = event.target.closest("[data-toast]");
  if (!toastTrigger) return;
  event.preventDefault();
  showToast(toastTrigger.dataset.toast);
});
