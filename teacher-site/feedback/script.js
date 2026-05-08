const params = new URLSearchParams(window.location.search);
const studentId = params.get("studentId") || window.TeacherData.students[0].id;
const student = window.TeacherData.students.find((item) => item.id === studentId) || window.TeacherData.students[0];
const savedFeedback = JSON.parse(window.localStorage.getItem(`feedback:${student.id}`) || "null");
const feedback = savedFeedback || student.feedback;

const studentName = document.querySelector("#studentName");
const studentPhoto = document.querySelector("#studentPhoto");
const comments = document.querySelector("#comments");
const form = document.querySelector("#feedbackForm");
const toast = document.querySelector("#toast");

function setRadioValue(name, value) {
  const input = document.querySelector(`input[name="${name}"][value="${value}"]`);

  if (input) {
    input.checked = true;
  }
}

function showToast() {
  toast.hidden = false;

  window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

studentName.textContent = student.name;
studentPhoto.textContent = student.photo || student.avatar;
studentPhoto.style.background = student.color;
comments.value = feedback.comments;
setRadioValue("attitude", feedback.attitude);
setRadioValue("progress", feedback.progress);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const updatedFeedback = {
    attitude: formData.get("attitude"),
    progress: formData.get("progress"),
    comments: formData.get("comments").trim(),
  };

  student.feedback = updatedFeedback;
  window.localStorage.setItem(`feedback:${student.id}`, JSON.stringify(updatedFeedback));
  showToast();
});
