const params = new URLSearchParams(window.location.search);
const classId = params.get("id") || "advanced-algorithms";
const classData =
  window.StaffData.classes.find((item) => item.id === classId) ||
  window.StaffData.classes[0];
const teacherList = document.querySelector("#teacherList");
const studentTable = document.querySelector("#studentTable");
const studentSearch = document.querySelector("#studentSearch");
const studentCount = document.querySelector("#studentCount");
const openAddStudent = document.querySelector("#openAddStudent");
const addStudentModal = document.querySelector("#addStudentModal");
const closeAddStudent = document.querySelector("#closeAddStudent");
const cancelAddStudent = document.querySelector("#cancelAddStudent");
const confirmAddStudent = document.querySelector("#confirmAddStudent");
const availableStudentSearch = document.querySelector("#availableStudentSearch");
const availableStudentList = document.querySelector("#availableStudentList");
const selectedStudentCount = document.querySelector("#selectedStudentCount");
const classStudents = classData.students.length
  ? classData.students
  : [...window.StaffData.classes[0].students];
const selectedStudentIds = new Set();

document.querySelector("#classCode").textContent = classData.code;
document.querySelector("#classTitle").textContent = classData.name;
document.querySelector("#teacherCount").textContent = `${classData.teachers.length || 2} Teachers Assigned`;

function updateStudentCount() {
  studentCount.textContent = `${classStudents.length} Enrolled Students`;
}

function renderTeachers() {
  const teachers = classData.teachers.length
    ? classData.teachers
    : window.StaffData.classes[0].teachers;
  teacherList.innerHTML = teachers
    .map(
      (teacher) => `
        <article class="teacher-card">
          <span class="teacher-avatar" style="background:${teacher.color}">${teacher.avatar}</span>
          <div>
            <strong>${teacher.name}</strong>
            <small>${teacher.role}</small>
          </div>
        </article>
      `
    )
    .join("");
}

function renderStudents() {
  const query = studentSearch.value.trim().toLowerCase();
  const rows = classStudents.filter((student) =>
    `${student.id} ${student.name}`.toLowerCase().includes(query)
  );

  studentTable.innerHTML = rows
    .map(
      (student) => `
        <tr>
          <td><div class="check-cell"></div></td>
          <td>${student.id}</td>
          <td><div class="class-name-cell"><span class="student-avatar">${student.initials}</span><span class="student-name">${student.name}</span></div></td>
          <td>${student.enrollDate}</td>
          <td><span class="status-pill ${student.status.toLowerCase().replace(/\s+/g, "-")}">${student.status}</span></td>
        </tr>
      `
    )
    .join("");
  updateStudentCount();
}

function renderAvailableStudents() {
  const query = availableStudentSearch.value.trim().toLowerCase();
  const enrolledIds = new Set(classStudents.map((student) => student.id));
  const rows = window.StaffData.availableStudents.filter((student) =>
    `${student.id} ${student.name} ${student.grade}`.toLowerCase().includes(query)
  );

  availableStudentList.innerHTML = rows.length
    ? rows
        .map((student) => {
          const isEnrolled = enrolledIds.has(student.id);
          const isSelected = selectedStudentIds.has(student.id);

          return `
            <label class="available-student-card${isEnrolled ? " is-disabled" : ""}${isSelected ? " is-selected" : ""}">
              <input type="checkbox" value="${student.id}" ${isSelected ? "checked" : ""} ${isEnrolled ? "disabled" : ""} />
              <span class="student-avatar">${student.initials}</span>
              <span>
                <strong>${student.name}</strong>
                <small>${student.id} • ${student.grade} • ${student.email}</small>
              </span>
              <span class="status-pill ${student.status.toLowerCase().replace(/\s+/g, "-")}">${isEnrolled ? "Enrolled" : student.status}</span>
            </label>
          `;
        })
        .join("")
    : '<p class="empty-state">No students match your search.</p>';
  selectedStudentCount.textContent = `${selectedStudentIds.size} student${selectedStudentIds.size === 1 ? "" : "s"} selected`;
}

function openModal() {
  selectedStudentIds.clear();
  availableStudentSearch.value = "";
  renderAvailableStudents();
  addStudentModal.hidden = false;
  availableStudentSearch.focus();
}

function closeModal() {
  addStudentModal.hidden = true;
  selectedStudentIds.clear();
}

function addSelectedStudents() {
  const enrolledIds = new Set(classStudents.map((student) => student.id));
  const studentsToAdd = window.StaffData.availableStudents.filter(
    (student) => selectedStudentIds.has(student.id) && !enrolledIds.has(student.id)
  );

  if (!studentsToAdd.length) {
    showToast("Select at least one available student.");
    return;
  }

  studentsToAdd.forEach((student) => {
    classStudents.push({
      id: student.id,
      name: student.name,
      initials: student.initials,
      enrollDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      status: student.status,
    });
  });

  showToast(`${studentsToAdd.length} student${studentsToAdd.length === 1 ? "" : "s"} added to ${classData.name}.`);
  closeModal();
  renderStudents();
}

studentSearch.addEventListener("input", renderStudents);
openAddStudent.addEventListener("click", openModal);
closeAddStudent.addEventListener("click", closeModal);
cancelAddStudent.addEventListener("click", closeModal);
confirmAddStudent.addEventListener("click", addSelectedStudents);
availableStudentSearch.addEventListener("input", renderAvailableStudents);
availableStudentList.addEventListener("change", (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;

  if (checkbox.checked) {
    selectedStudentIds.add(checkbox.value);
  } else {
    selectedStudentIds.delete(checkbox.value);
  }

  renderAvailableStudents();
});
addStudentModal.addEventListener("click", (event) => {
  if (event.target === addStudentModal) {
    closeModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !addStudentModal.hidden) {
    closeModal();
  }
});
renderTeachers();
renderStudents();
