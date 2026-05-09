const teacherGrid = document.querySelector("#teacherGrid");
const teacherDepartment = document.querySelector("#teacherDepartment");
const addTeacherButton = document.querySelector("#addTeacherButton");
const teacherModal = document.querySelector("#teacherModal");
const closeTeacherModal = document.querySelector("#closeTeacherModal");
const cancelTeacherModal = document.querySelector("#cancelTeacherModal");
const deleteTeacherButton = document.querySelector("#deleteTeacherButton");
const teacherForm = document.querySelector("#teacherForm");
const teacherEditId = document.querySelector("#teacherEditId");
const teacherName = document.querySelector("#teacherName");
const teacherSubject = document.querySelector("#teacherSubject");
const teacherDepartmentInput = document.querySelector("#teacherDepartmentInput");
const teacherStatus = document.querySelector("#teacherStatus");
const teacherEmail = document.querySelector("#teacherEmail");
const teacherPhone = document.querySelector("#teacherPhone");
const teacherLoad = document.querySelector("#teacherLoad");
const teacherModalTitle = document.querySelector("#teacherModalTitle");

const teachers = window.StaffData.staffTeachers.map((teacher) => ({ ...teacher }));

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function renderTeachers() {
  const departmentQuery = teacherDepartment.value;
  const globalSearchInput = document.querySelector("#globalSearch");
  const searchQuery = globalSearchInput ? globalSearchInput.value.trim().toLowerCase() : "";

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesDept = !departmentQuery || teacher.department.toLowerCase().includes(departmentQuery.toLowerCase());
    const matchesSearch = !searchQuery || `${teacher.name} ${teacher.subject} ${teacher.email}`.toLowerCase().includes(searchQuery);
    return matchesDept && matchesSearch;
  });

  teacherGrid.innerHTML = filteredTeachers
    .map(
      (teacher) => `
        <article class="teacher-card">
          <div class="teacher-card-head">
            <div class="student-avatar">${teacher.avatar || getInitials(teacher.name)}</div>
            <div>
              <h2>${teacher.name}</h2>
              <p>${teacher.subject} • ${teacher.department}</p>
            </div>
          </div>
          <div class="teacher-meta">
            <div>
              <span>Email</span>
              <strong>${teacher.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>${teacher.phone}</strong>
            </div>
            <div>
              <span>Current Load</span>
              <strong>${teacher.load} Sessions</strong>
            </div>
          </div>
          <div class="teacher-card-foot">
            <span class="status-pill ${teacher.status.toLowerCase().replace(/\s+/g, "-")}">${teacher.status}</span>
            <div class="row-actions">
              <button class="secondary-button" type="button" data-action="edit" data-id="${teacher.id}">Edit</button>
              <button class="icon-button danger-icon" type="button" data-action="delete" data-id="${teacher.id}" aria-label="Delete ${teacher.name}">
                <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
  
  if (filteredTeachers.length === 0) {
    teacherGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--muted);">No teachers found matching your criteria.</div>`;
  }
}

function openTeacherModal(teacherId = "") {
  const teacher = teachers.find((item) => item.id === teacherId);
  teacherModalTitle.textContent = teacher ? "Edit Teacher" : "Add Teacher";
  teacherEditId.value = teacher ? teacher.id : "";
  teacherName.value = teacher ? teacher.name : "";
  teacherSubject.value = teacher ? teacher.subject : "";
  teacherDepartmentInput.value = teacher ? teacher.department : "";
  teacherStatus.value = teacher ? teacher.status : "Active";
  teacherEmail.value = teacher ? teacher.email : "";
  teacherPhone.value = teacher ? teacher.phone : "";
  teacherLoad.value = teacher ? teacher.load : "0";
  deleteTeacherButton.hidden = !teacher;
  teacherModal.hidden = false;
  teacherName.focus();
}

function closeModal() {
  teacherModal.hidden = true;
  teacherForm.reset();
}

function deleteTeacher(teacherId) {
  const index = teachers.findIndex((teacher) => teacher.id === teacherId);
  if (index === -1) return;
  const [removed] = teachers.splice(index, 1);
  closeModal();
  renderTeachers();
  if (window.showToast) {
    window.showToast(`${removed.name} removed from directory.`);
  }
}

teacherGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "delete") {
    deleteTeacher(button.dataset.id);
    return;
  }
  openTeacherModal(button.dataset.id);
});

addTeacherButton.addEventListener("click", () => openTeacherModal());
closeTeacherModal.addEventListener("click", closeModal);
cancelTeacherModal.addEventListener("click", closeModal);
teacherModal.addEventListener("click", (event) => {
  if (event.target === teacherModal) closeModal();
});
deleteTeacherButton.addEventListener("click", () => {
  if (teacherEditId.value) deleteTeacher(teacherEditId.value);
});

teacherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const existing = teachers.find((teacher) => teacher.id === teacherEditId.value);
  const payload = {
    id: existing ? existing.id : `teacher-${Date.now()}`,
    name: teacherName.value.trim(),
    subject: teacherSubject.value.trim(),
    department: teacherDepartmentInput.value.trim(),
    email: teacherEmail.value.trim(),
    phone: teacherPhone.value.trim(),
    load: Number(teacherLoad.value),
    status: teacherStatus.value,
    avatar: existing ? existing.avatar : getInitials(teacherName.value.trim()),
  };

  if (existing) {
    Object.assign(existing, payload);
    if (window.showToast) window.showToast(`${payload.name} updated.`);
  } else {
    teachers.unshift(payload);
    if (window.showToast) window.showToast(`${payload.name} added to directory.`);
  }

  closeModal();
  renderTeachers();
});

teacherDepartment.addEventListener("change", renderTeachers);

// Wait for header to render the global search
setTimeout(() => {
  const globalSearchInput = document.querySelector("#globalSearch");
  if (globalSearchInput) {
    globalSearchInput.addEventListener("input", renderTeachers);
  }
}, 500);

renderTeachers();
