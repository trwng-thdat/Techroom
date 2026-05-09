const urlParams = new URLSearchParams(location.search);
const classCode = urlParams.get("code");
const classData = window.StudentData.classes.find((c) => c.code === classCode);

if (!classData) {
  window.location.href = "../index.html";
}

function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => toast.remove(), 2600);
}

function populateInfo() {
  document.getElementById("classCode").textContent = classData.code;
  document.getElementById("classLevel").textContent = classData.level;
  document.querySelector("#feedback-title").textContent = classData.title;
  document.getElementById("classSchedule").textContent = `${classData.day} · ${classData.time}`;
  document.getElementById("classLocation").textContent = `${classData.room}, ${classData.building}`;
  document.getElementById("teacherAvatar").textContent = classData.teacher.avatar;
  document.getElementById("teacherAvatar").style.background = classData.teacher.color;
  document.getElementById("teacherName").textContent = classData.teacher.name;
  document.getElementById("teacherRole").textContent = classData.teacher.role;
}

function setSubmittedState(savedText) {
  const textarea = document.getElementById("feedbackText");
  const button = document.querySelector(".btn-submit");
  const hint = document.getElementById("feedbackHint");

  textarea.value = savedText;
  textarea.disabled = true;
  button.disabled = true;
  button.textContent = "Submitted ✓";
  hint.textContent = "You already submitted feedback for this class.";
}

document.addEventListener("DOMContentLoaded", () => {
  populateInfo();

  if (classData.feedback) {
    setSubmittedState(classData.feedback);
    return;
  }

  const form = document.getElementById("feedbackForm");
  const textarea = document.getElementById("feedbackText");
  const error = document.getElementById("feedbackError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!textarea.value.trim()) {
      error.hidden = false;
      textarea.focus();
      return;
    }

    error.hidden = true;
    classData.feedback = textarea.value.trim();
    showToast("Thank you! Your feedback has been submitted.");
    setSubmittedState(classData.feedback);
  });

  textarea.addEventListener("input", () => {
    if (textarea.value.trim()) {
      error.hidden = true;
    }
  });
});
