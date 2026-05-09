const addStudentForm = document.querySelector("#addStudentForm");
const studentName = document.querySelector("#studentName");
const studentNameError = document.querySelector("#studentNameError");
const initialClass = document.querySelector("#initialClass");

studentName.addEventListener("input", () => {
  studentName.classList.toggle("error", !studentName.value.trim());
  studentNameError.hidden = Boolean(studentName.value.trim());
});

addStudentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!studentName.value.trim()) {
    studentName.classList.add("error");
    studentNameError.hidden = false;
    studentName.focus();
    showToast("Student full name is required.");
    return;
  }

  const placement = initialClass.value ? ` and assigned to ${initialClass.value}` : "";
  showToast(`${studentName.value.trim()} saved${placement}.`);
  window.setTimeout(() => {
    window.location.href = "../index.html";
  }, 650);
});
