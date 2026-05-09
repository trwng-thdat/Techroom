const notificationForm = document.querySelector("#notificationForm");
const notificationRecipients = document.querySelector("#notificationRecipients");
const saveDraftButton = document.querySelector("#saveDraftButton");
const deliveryButtons = document.querySelectorAll("[data-delivery]");

document.querySelectorAll("[data-recipient]").forEach((button) => {
  button.addEventListener("click", () => {
    notificationRecipients.value = button.dataset.recipient;
  });
});

deliveryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    deliveryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

saveDraftButton.addEventListener("click", () => {
  showToast("Notification draft saved.");
});

notificationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Notification sent to selected recipients.");
  window.setTimeout(() => {
    window.location.href = "../index.html";
  }, 650);
});
