const allStudents = [
  { name: "Julian Vance", id: "40221", attendance: 98, progress: 92, status: "Active", avatar: "J", color: "#f39b54" },
  { name: "Maya Sterling", id: "40225", attendance: 84, progress: 76, status: "Active", avatar: "M", color: "#3bc1aa" },
  { name: "Liam O'Connell", id: "40230", attendance: 72, progress: 45, status: "Inactive", avatar: "L", color: "#5fb4c8" },
  { name: "Chloe Zhang", id: "40238", attendance: 100, progress: 88, status: "Active", avatar: "C", color: "#e48788" },
  { name: "Ethan Rivera", id: "40242", attendance: 91, progress: 79, status: "Active", avatar: "E", color: "#a78bfa" },
  { name: "Sophia Chen", id: "40247", attendance: 67, progress: 53, status: "Active", avatar: "S", color: "#f472b6" },
  { name: "Noah Patel", id: "40251", attendance: 88, progress: 94, status: "Active", avatar: "N", color: "#34d399" },
  { name: "Emma Thompson", id: "40256", attendance: 45, progress: 38, status: "Inactive", avatar: "E", color: "#fb923c" },
  { name: "James Kim", id: "40260", attendance: 95, progress: 91, status: "Active", avatar: "J", color: "#60a5fa" },
  { name: "Olivia Garcia", id: "40264", attendance: 78, progress: 62, status: "Active", avatar: "O", color: "#c084fc" },
  { name: "Benjamin Lee", id: "40269", attendance: 82, progress: 71, status: "Active", avatar: "B", color: "#2dd4bf" },
  { name: "Ava Martinez", id: "40273", attendance: 56, progress: 44, status: "Inactive", avatar: "A", color: "#f87171" },
  { name: "Lucas Brown", id: "40278", attendance: 93, progress: 86, status: "Active", avatar: "L", color: "#38bdf8" },
  { name: "Mia Wilson", id: "40282", attendance: 74, progress: 69, status: "Active", avatar: "M", color: "#a3e635" },
  { name: "Henry Davis", id: "40287", attendance: 89, progress: 83, status: "Active", avatar: "H", color: "#fbbf24" },
  { name: "Isabella Nguyen", id: "40291", attendance: 63, progress: 51, status: "Inactive", avatar: "I", color: "#e879f9" },
  { name: "Alexander White", id: "40296", attendance: 97, progress: 95, status: "Active", avatar: "A", color: "#22c55e" },
  { name: "Charlotte Harris", id: "40300", attendance: 71, progress: 58, status: "Active", avatar: "C", color: "#06b6d4" },
  { name: "Daniel Clark", id: "40305", attendance: 86, progress: 77, status: "Active", avatar: "D", color: "#f59e0b" },
  { name: "Amelia Lewis", id: "40309", attendance: 52, progress: 41, status: "Inactive", avatar: "A", color: "#d946ef" },
  { name: "Matthew Robinson", id: "40314", attendance: 94, progress: 90, status: "Active", avatar: "M", color: "#10b981" },
  { name: "Harper Walker", id: "40318", attendance: 69, progress: 55, status: "Active", avatar: "H", color: "#0ea5e9" },
  { name: "David Hall", id: "40323", attendance: 81, progress: 74, status: "Active", avatar: "D", color: "#8b5cf6" },
  { name: "Evelyn Allen", id: "40327", attendance: 77, progress: 65, status: "Active", avatar: "E", color: "#ec4899" },
];

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
          <button class="feedback-button" type="button" role="cell" data-student="${student.name}">EDIT</button>
        </div>
      `;
    })
    .join("");

  totalStudentsLabel.textContent = `${totalStudents} Students`;
  averageProgressLabel.textContent = `${getAverageProgress()}%`;
  studentCountLabel.textContent = `Showing ${start + 1}–${Math.min(end, totalStudents)} of ${totalStudents} students`;
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
  window.alert(`Feedback editor for ${feedbackButton.dataset.student} will be added next.`);
});

goToPage(1);
