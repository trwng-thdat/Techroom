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
  const toastTrigger = event.target.closest("[data-toast]");

  if (toastTrigger) {
    showToast(toastTrigger.dataset.toast);
  }

  const logout = event.target.closest("[data-logout]");

  if (logout) {
    localStorage.removeItem("staffName");
    showToast("Logged out of the staff portal.");
    window.setTimeout(() => {
      window.location.href = logout.dataset.logoutHref || "../index.html";
    }, 450);
  }
});
