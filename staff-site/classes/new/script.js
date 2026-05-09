const createClassForm = document.querySelector("#createClassForm");
const className = document.querySelector("#className");
const classNameError = document.querySelector("#classNameError");
const course = document.querySelector("#course");
const sessionsPerWeek = document.querySelector("#sessionsPerWeek");
const sessionsRuleNote = document.querySelector("#sessionsRuleNote");
const studentPicker = document.querySelector("#studentPicker");
const studentInput = document.querySelector("#studentInput");
const openStudentBrowser = document.querySelector("#openStudentBrowser");
const studentBrowserModal = document.querySelector("#studentBrowserModal");
const closeStudentBrowser = document.querySelector("#closeStudentBrowser");
const cancelStudentBrowser = document.querySelector("#cancelStudentBrowser");
const addBrowserStudents = document.querySelector("#addBrowserStudents");
const studentBrowserSearch = document.querySelector("#studentBrowserSearch");
const studentBrowserList = document.querySelector("#studentBrowserList");
const browserSelectedCount = document.querySelector("#browserSelectedCount");
const selectedStudents = [...window.StaffData.studentsForNewClass];
const selectedStudentIds = new Set();
const courseRules = window.StaffData.courseRules;

function renderStudentChips() {
  studentPicker.querySelectorAll(".student-chip").forEach((chip) => chip.remove());
  selectedStudents.forEach((student) => {
    const chip = document.createElement("span");
    chip.className = "student-chip";
    chip.innerHTML = `${student} <button type="button" aria-label="Remove ${student}" data-student="${student}">×</button>`;
    studentPicker.insertBefore(chip, studentInput);
  });
}

studentPicker.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-student]");
  if (!remove) return;
  const index = selectedStudents.indexOf(remove.dataset.student);
  if (index >= 0) {
    selectedStudents.splice(index, 1);
    renderStudentChips();
  }
});

studentInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || !studentInput.value.trim()) return;
  event.preventDefault();
  selectedStudents.push(studentInput.value.trim());
  studentInput.value = "";
  renderStudentChips();
});

function getStudentLabel(student) {
  return `${student.name} (${student.grade})`;
}

function renderStudentBrowser() {
  const query = studentBrowserSearch.value.trim().toLowerCase();
  const selectedLabels = new Set(selectedStudents);
  const rows = window.StaffData.availableStudents.filter((student) =>
    `${student.id} ${student.name} ${student.grade}`.toLowerCase().includes(query)
  );

  studentBrowserList.innerHTML = rows.length
    ? rows
        .map((student) => {
          const label = getStudentLabel(student);
          const isAdded = selectedLabels.has(label);
          const isSelected = selectedStudentIds.has(student.id);

          return `
            <label class="available-student-card${isAdded ? " is-disabled" : ""}${isSelected ? " is-selected" : ""}">
              <input type="checkbox" value="${student.id}" ${isSelected ? "checked" : ""} ${isAdded ? "disabled" : ""} />
              <span class="student-avatar">${student.initials}</span>
              <span>
                <strong>${student.name}</strong>
                <small>${student.id} • ${student.grade} • ${student.email}</small>
              </span>
              <span class="status-pill ${student.status.toLowerCase().replace(/\s+/g, "-")}">${isAdded ? "Added" : student.status}</span>
            </label>
          `;
        })
        .join("")
    : '<p class="empty-state">No students match your search.</p>';
  browserSelectedCount.textContent = `${selectedStudentIds.size} student${selectedStudentIds.size === 1 ? "" : "s"} selected`;
}

function openBrowser() {
  selectedStudentIds.clear();
  studentBrowserSearch.value = "";
  renderStudentBrowser();
  studentBrowserModal.hidden = false;
  studentBrowserSearch.focus();
}

function closeBrowser() {
  studentBrowserModal.hidden = true;
  selectedStudentIds.clear();
}

function addSelectedFromBrowser() {
  const selectedLabels = new Set(selectedStudents);
  const studentsToAdd = window.StaffData.availableStudents.filter((student) => {
    const label = getStudentLabel(student);
    return selectedStudentIds.has(student.id) && !selectedLabels.has(label);
  });

  if (!studentsToAdd.length) {
    showToast("Select at least one available student.");
    return;
  }

  studentsToAdd.forEach((student) => selectedStudents.push(getStudentLabel(student)));
  renderStudentChips();
  showToast(`${studentsToAdd.length} student${studentsToAdd.length === 1 ? "" : "s"} added to the new class.`);
  closeBrowser();
}

className.addEventListener("input", () => {
  className.classList.toggle("error", !className.value.trim());
  classNameError.hidden = Boolean(className.value.trim());
});

function updateSessionsRule() {
  const rule = courseRules[course.value];

  if (!rule) {
    sessionsPerWeek.textContent = "-";
    sessionsRuleNote.textContent = "Select a course to apply its required weekly sessions.";
    return;
  }

  sessionsPerWeek.textContent = rule.sessionsPerWeek;
  sessionsRuleNote.textContent = rule.note;
}

course.addEventListener("change", updateSessionsRule);
openStudentBrowser.addEventListener("click", openBrowser);
closeStudentBrowser.addEventListener("click", closeBrowser);
cancelStudentBrowser.addEventListener("click", closeBrowser);
addBrowserStudents.addEventListener("click", addSelectedFromBrowser);
studentBrowserSearch.addEventListener("input", renderStudentBrowser);
studentBrowserList.addEventListener("change", (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;

  if (checkbox.checked) {
    selectedStudentIds.add(checkbox.value);
  } else {
    selectedStudentIds.delete(checkbox.value);
  }

  renderStudentBrowser();
});
studentBrowserModal.addEventListener("click", (event) => {
  if (event.target === studentBrowserModal) {
    closeBrowser();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !studentBrowserModal.hidden) {
    closeBrowser();
  }
});

createClassForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!className.value.trim()) {
    className.classList.add("error");
    classNameError.hidden = false;
    className.focus();
    showToast("Class name is required.");
    return;
  }

  if (!course.value) {
    showToast("Select a course so sessions per week can be applied.");
    course.focus();
    return;
  }

  showToast(`Class saved with ${sessionsPerWeek.textContent} sessions per week.`);
  window.setTimeout(() => {
    window.location.href = "../index.html";
  }, 650);
});

renderStudentChips();
updateSessionsRule();
