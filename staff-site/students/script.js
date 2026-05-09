const studentDirectorySearch = document.querySelector("#studentDirectorySearch");
const studentDirectoryTable = document.querySelector("#studentDirectoryTable");
const studentDirectoryCount = document.querySelector("#studentDirectoryCount");
const addStudentButton = document.querySelector("#addStudentButton");
const studentModal = document.querySelector("#studentModal");
const closeStudentModal = document.querySelector("#closeStudentModal");
const cancelStudentModal = document.querySelector("#cancelStudentModal");
const deleteStudentButton = document.querySelector("#deleteStudentButton");
const studentForm = document.querySelector("#studentForm");
const studentEditId = document.querySelector("#studentEditId");
const studentName = document.querySelector("#studentName");
const studentGrade = document.querySelector("#studentGrade");
const studentEmail = document.querySelector("#studentEmail");
const studentPhone = document.querySelector("#studentPhone");
const studentGuardian = document.querySelector("#studentGuardian");
const studentStatus = document.querySelector("#studentStatus");
const studentClass = document.querySelector("#studentClass");
const studentModalTitle = document.querySelector("#studentModalTitle");
const studentModalHelp = document.querySelector("#studentModalHelp");
const students = window.StaffData.availableStudents.map((student) => ({ ...student }));
const profileControls = [studentName, studentGrade, studentEmail, studentPhone, studentGuardian, studentStatus];

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getClassName(classId) {
  const item = window.StaffData.classes.find((classItem) => classItem.id === classId);
  return item ? item.name : "Unassigned";
}

function renderClassOptions(selectedId = "") {
  studentClass.innerHTML = window.StaffData.classes
    .filter((item) => item.status !== "Cancelled")
    .map((item) => `<option value="${item.id}"${item.id === selectedId ? " selected" : ""}>${item.name}</option>`)
    .join("");
}

function renderStudents() {
  const query = studentDirectorySearch.value.trim().toLowerCase();
  const rows = students.filter((student) =>
    `${student.id} ${student.name} ${student.grade} ${student.email} ${getClassName(student.classId)}`.toLowerCase().includes(query)
  );

  studentDirectoryTable.innerHTML = rows
    .map(
      (student) => `
        <tr>
          <td>
            <div class="class-name-cell">
              <span class="student-avatar">${student.initials}</span>
              <span><strong>${student.name}</strong><small>${student.id}</small></span>
            </div>
          </td>
          <td>${student.grade}</td>
          <td><strong>${student.email}</strong><small>${student.phone}</small></td>
          <td><span class="class-chip">${getClassName(student.classId)}</span></td>
          <td><span class="status-pill ${student.status.toLowerCase().replace(/\s+/g, "-")}">${student.status}</span></td>
          <td>
            <div class="row-actions">
              <button type="button" data-action="transfer" data-id="${student.id}" title="Transfer class">
                <svg viewBox="0 0 24 24"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
              </button>
              <button type="button" data-action="edit" data-id="${student.id}" title="Edit student">
                <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
              </button>
              <button class="danger-icon" type="button" data-action="delete" data-id="${student.id}" title="Delete student">
                <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
  studentDirectoryCount.textContent = `Showing ${rows.length} of ${students.length} students`;
}

function openStudentModal(studentId = "", transferOnly = false) {
  const student = students.find((item) => item.id === studentId);
  studentModalTitle.textContent = student ? (transferOnly ? "Transfer Student" : "Edit Student") : "Add Student";
  studentModalHelp.textContent = transferOnly
    ? "Move this learner into another active class without changing their profile details."
    : "Create or update learner information and class placement.";
  studentModal.dataset.mode = transferOnly ? "transfer" : "profile";
  studentEditId.value = student ? student.id : "";
  studentName.value = student ? student.name : "";
  studentGrade.value = student ? student.grade : "U17";
  studentEmail.value = student ? student.email : "";
  studentPhone.value = student ? student.phone : "";
  studentGuardian.value = student ? student.guardian : "";
  studentStatus.value = student ? student.status : "Active";
  renderClassOptions(student ? student.classId : window.StaffData.classes[0].id);
  profileControls.forEach((control) => {
    control.disabled = transferOnly;
  });
  deleteStudentButton.hidden = !student;
  studentModal.hidden = false;
  if (transferOnly) {
    studentClass.focus();
  } else {
    studentName.focus();
  }
}

function closeModal() {
  studentModal.hidden = true;
  studentModal.dataset.mode = "";
  profileControls.forEach((control) => {
    control.disabled = false;
  });
  studentForm.reset();
}

function deleteStudent(studentId) {
  const index = students.findIndex((student) => student.id === studentId);
  if (index === -1) return;
  const [removed] = students.splice(index, 1);
  closeModal();
  renderStudents();
  showToast(`${removed.name} removed from student directory.`);
}

addStudentButton.addEventListener("click", () => openStudentModal());
closeStudentModal.addEventListener("click", closeModal);
cancelStudentModal.addEventListener("click", closeModal);
studentModal.addEventListener("click", (event) => {
  if (event.target === studentModal) closeModal();
});

studentDirectoryTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;

  if (action === "delete") {
    deleteStudent(id);
    return;
  }

  openStudentModal(id, action === "transfer");
});

deleteStudentButton.addEventListener("click", () => {
  if (studentEditId.value) deleteStudent(studentEditId.value);
});

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const existing = students.find((student) => student.id === studentEditId.value);
  const payload = {
    id: existing ? existing.id : `ST-2024-${String(1200 + students.length + 1).padStart(4, "0")}`,
    name: studentName.value.trim(),
    initials: getInitials(studentName.value),
    grade: studentGrade.value,
    email: studentEmail.value.trim(),
    phone: studentPhone.value.trim(),
    guardian: studentGuardian.value.trim(),
    joined: existing ? existing.joined : "May 09, 2026",
    status: studentStatus.value,
    classId: studentClass.value,
  };

  if (existing) {
    const oldClass = getClassName(existing.classId);
    Object.assign(existing, payload);
    const newClass = getClassName(payload.classId);
    showToast(studentModal.dataset.mode === "transfer" ? `${payload.name} moved from ${oldClass} to ${newClass}.` : `${payload.name} updated.`);
  } else {
    students.unshift(payload);
    showToast(`${payload.name} added to student directory.`);
  }

  closeModal();
  renderStudents();
});

studentDirectorySearch.addEventListener("input", renderStudents);
renderStudents();
