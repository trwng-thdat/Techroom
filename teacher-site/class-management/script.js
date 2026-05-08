const allStudents = window.TeacherData.students;

const PAGE_SIZE = 4;
const totalStudents = allStudents.length;
let currentPage = 1;
const totalPages = Math.ceil(totalStudents / PAGE_SIZE);

const studentList = document.querySelector("#studentList");
const totalStudentsLabel = document.querySelector("#totalStudents");
const averageProgressLabel = document.querySelector("#averageProgress");
const studentCountLabel = document.querySelector("#studentCountLabel");
const pagination = document.querySelector(".pagination");

function getAverageProgress() {
  const totalProgress = allStudents.reduce((sum, s) => sum + s.progress, 0);
  return Math.round(totalProgress / allStudents.length);
}

function renderStudents(page) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageStudents = allStudents.slice(start, end);

  studentList.innerHTML = pageStudents
    .map((student) => {
      const statusClass = student.status.toLowerCase();
      const progressClass = student.progress < 60 ? " is-low" : "";

      return `
        <div class="student-row" role="row">
          <div class="student-name" role="cell">
            <span class="student-avatar" style="background: ${student.color}">${student.avatar}</span>
            <span>
              <strong>${student.name}</strong>
              <small>ID: ${student.id}</small>
            </span>
          </div>
          <span class="attendance-value" role="cell">${student.attendance}%</span>
          <div class="progress-track${progressClass}" role="cell" aria-label="${student.progress}% learning progress">
            <span style="width: ${student.progress}%"></span>
          </div>
          <span class="status-pill ${statusClass}" role="cell">${student.status.toUpperCase()}</span>
          <button class="feedback-button" type="button" role="cell" data-student-id="${student.id}">EDIT</button>
        </div>
      `;
    })
    .join("");

  totalStudentsLabel.textContent = `${totalStudents} Students`;
  averageProgressLabel.textContent = `${getAverageProgress()}%`;
  studentCountLabel.textContent = `Showing ${start + 1}-${Math.min(end, totalStudents)} of ${totalStudents} students`;
}

function renderPagination(current) {
  pagination.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.ariaLabel = "Previous page";
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>';
  prevBtn.disabled = current === 1;
  prevBtn.addEventListener("click", () => goToPage(current - 1));
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = i;
    if (i === current) btn.classList.add("active");
    btn.addEventListener("click", () => goToPage(i));
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.ariaLabel = "Next page";
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>';
  nextBtn.disabled = current === totalPages;
  nextBtn.addEventListener("click", () => goToPage(current + 1));
  pagination.appendChild(nextBtn);
}

function goToPage(page) {
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderStudents(page);
  renderPagination(page);
}

studentList.addEventListener("click", (event) => {
  const feedbackButton = event.target.closest(".feedback-button");
  if (!feedbackButton) return;
  window.location.href = `../feedback/index.html?studentId=${encodeURIComponent(feedbackButton.dataset.studentId)}`;
});

goToPage(1);
