const courseSearch = document.querySelector("#courseSearch");
const courseTable = document.querySelector("#courseTable");
const courseCount = document.querySelector("#courseCount");
const courseModal = document.querySelector("#courseModal");
const courseModalKicker = document.querySelector("#courseModalKicker");
const courseModalTitle = document.querySelector("#courseModalTitle");
const courseModalBody = document.querySelector("#courseModalBody");
const closeCourseModal = document.querySelector("#closeCourseModal");
const courses = [...window.OwnerData.courses];
let selectedCourse = null;

function findCourse(courseId) {
  return courses.find((course) => course.id === courseId);
}

function renderCourses() {
  const query = courseSearch.value.trim().toLowerCase();
  const rows = courses.filter((course) =>
    `${course.name} ${course.subject} ${course.level} ${course.code}`
      .toLowerCase()
      .includes(query)
  );

  courseTable.innerHTML = rows.length
    ? rows
        .map(
          (course) => `
            <tr>
              <td>
                <div class="course-name">
                  <span class="course-icon ${course.tone}"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z" /><path d="M8 9h8" /><path d="M8 13h5" /></svg></span>
                  <span><strong>${course.name}</strong><small>${course.code}</small></span>
                </div>
              </td>
              <td>${course.subject}</td>
              <td><span class="tiny-badge">${course.level}</span></td>
              <td>${course.prerequisites.length ? course.prerequisites.map((item) => `<span class="tiny-badge soft">${item}</span>`).join(" ") : "None"}</td>
              <td><span class="status-dot ${course.status.toLowerCase()}">${course.status}</span></td>
              <td>
                <div class="row-actions">
                  <button type="button" aria-label="View ${course.name}" data-action="view" data-course-id="${course.id}"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg></button>
                  <button type="button" aria-label="Edit ${course.name}" data-action="edit" data-course-id="${course.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></svg></button>
                  <button type="button" aria-label="Delete ${course.name}" data-action="delete" data-course-id="${course.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg></button>
                </div>
              </td>
            </tr>
          `
        )
        .join("")
    : '<tr><td colspan="6" class="empty-state">No courses match your search.</td></tr>';
  courseCount.textContent = `Showing ${rows.length} of 42 courses`;
}

function openCourseModal(course, mode) {
  selectedCourse = course;
  courseModalKicker.textContent =
    mode === "edit" ? "Edit Course" : mode === "delete" ? "Delete Course" : "Course Details";
  courseModalTitle.textContent = course.name;

  if (mode === "edit") {
    renderEditModal(course);
  } else if (mode === "delete") {
    renderDeleteModal(course);
  } else {
    renderDetailModal(course);
  }

  courseModal.hidden = false;
}

function renderDetailModal(course) {
  courseModalBody.innerHTML = `
    <div class="detail-grid">
      <article class="detail-panel">
        <span class="course-icon ${course.tone}"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z" /><path d="M8 9h8" /><path d="M8 13h5" /></svg></span>
        <div>
          <p class="eyebrow">${course.code}</p>
          <h3>${course.name}</h3>
          <p>${course.summary}</p>
        </div>
      </article>
      <dl class="detail-list">
        <div><dt>Subject</dt><dd>${course.subject}</dd></div>
        <div><dt>Level</dt><dd>${course.level}</dd></div>
        <div><dt>Instructor</dt><dd>${course.instructor}</dd></div>
        <div><dt>Duration</dt><dd>${course.duration}</dd></div>
        <div><dt>Sessions</dt><dd>${course.sessions}</dd></div>
        <div><dt>Enrollment</dt><dd>${course.enrolled}/${course.capacity}</dd></div>
        <div><dt>Status</dt><dd><span class="status-dot ${course.status.toLowerCase()}">${course.status}</span></dd></div>
        <div><dt>Syllabus</dt><dd>${course.syllabus}</dd></div>
      </dl>
      <div class="detail-actions">
        <button class="secondary-button" type="button" data-modal-action="edit">Edit Course</button>
        <button class="danger-button compact" type="button" data-modal-action="delete">Delete Course</button>
      </div>
    </div>
  `;
}

function renderEditModal(course) {
  courseModalBody.innerHTML = `
    <form class="modal-form" id="courseEditForm">
      <div class="form-grid">
        <div class="field-group">
          <label for="editCourseName">Course Name</label>
          <input id="editCourseName" name="name" type="text" value="${course.name}" />
        </div>
        <div class="field-group">
          <label for="editCourseCode">Course Code</label>
          <input id="editCourseCode" name="code" type="text" value="${course.code}" />
        </div>
        <div class="field-group">
          <label for="editSubject">Subject</label>
          <select id="editSubject" name="subject">
            ${["Mathematics", "Science", "English", "Computer Science"].map((subject) => `<option${subject === course.subject ? " selected" : ""}>${subject}</option>`).join("")}
          </select>
        </div>
        <div class="field-group">
          <label for="editLevel">Level</label>
          <input id="editLevel" name="level" type="text" value="${course.level}" />
        </div>
        <div class="field-group">
          <label for="editInstructor">Instructor</label>
          <input id="editInstructor" name="instructor" type="text" value="${course.instructor}" />
        </div>
        <div class="field-group">
          <label for="editStatus">Status</label>
          <select id="editStatus" name="status">
            <option${course.status === "Active" ? " selected" : ""}>Active</option>
            <option${course.status === "Inactive" ? " selected" : ""}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="field-group">
        <label for="editSummary">Summary</label>
        <textarea id="editSummary" name="summary">${course.summary}</textarea>
      </div>
      <div class="field-group">
        <label for="editPrerequisites">Prerequisites</label>
        <input id="editPrerequisites" name="prerequisites" type="text" value="${course.prerequisites.join(", ")}" />
      </div>
      <div class="modal-actions right">
        <button class="secondary-button" type="button" data-modal-action="close">Cancel</button>
        <button class="primary-button" type="submit">Save Changes</button>
      </div>
    </form>
  `;
}

function renderDeleteModal(course) {
  courseModalBody.innerHTML = `
    <div class="delete-panel">
      <div class="warning-icon"><svg viewBox="0 0 24 24"><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg></div>
      <h3>Delete this course?</h3>
      <p>Deleting <strong>${course.name}</strong> removes it from this demo course catalog. This mock action only updates the current page.</p>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-modal-action="close">Cancel</button>
        <button class="danger-button" type="button" data-modal-action="confirm-delete">Delete Course</button>
      </div>
    </div>
  `;
}

function closeModal() {
  courseModal.hidden = true;
  selectedCourse = null;
}

courseSearch.addEventListener("input", renderCourses);

courseTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const course = findCourse(button.dataset.courseId);

  if (course) {
    openCourseModal(course, button.dataset.action);
  }
});

courseModalBody.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-modal-action]");
  if (!actionButton || !selectedCourse) return;

  const action = actionButton.dataset.modalAction;
  if (action === "close") {
    closeModal();
  } else if (action === "edit") {
    openCourseModal(selectedCourse, "edit");
  } else if (action === "delete") {
    openCourseModal(selectedCourse, "delete");
  } else if (action === "confirm-delete") {
    const index = courses.findIndex((course) => course.id === selectedCourse.id);
    if (index >= 0) {
      courses.splice(index, 1);
      showToast(`${selectedCourse.name} deleted from the course catalog.`);
    }
    closeModal();
    renderCourses();
  }
});

courseModalBody.addEventListener("submit", (event) => {
  if (event.target.id !== "courseEditForm" || !selectedCourse) return;
  event.preventDefault();

  const formData = new FormData(event.target);
  selectedCourse.name = formData.get("name").trim();
  selectedCourse.code = formData.get("code").trim();
  selectedCourse.subject = formData.get("subject");
  selectedCourse.level = formData.get("level").trim();
  selectedCourse.instructor = formData.get("instructor").trim();
  selectedCourse.status = formData.get("status");
  selectedCourse.summary = formData.get("summary").trim();
  selectedCourse.prerequisites = formData
    .get("prerequisites")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  showToast(`${selectedCourse.name} updated.`);
  closeModal();
  renderCourses();
});

closeCourseModal.addEventListener("click", closeModal);
courseModal.addEventListener("click", (event) => {
  if (event.target === courseModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !courseModal.hidden) {
    closeModal();
  }
});

renderCourses();
