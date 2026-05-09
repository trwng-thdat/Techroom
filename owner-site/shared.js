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
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-toast]");

  if (trigger) {
    showToast(trigger.dataset.toast);
  }

  const logoutButton = event.target.closest("[data-logout]");

  if (logoutButton) {
    localStorage.removeItem("adminName");
    showToast("Logged out of the admin portal.");
    window.setTimeout(() => {
      window.location.href = logoutButton.dataset.logoutHref || "../index.html";
    }, 450);
  }
});
