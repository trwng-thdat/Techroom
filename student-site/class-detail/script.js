const urlParams = new URLSearchParams(location.search);
const classCode = urlParams.get("code");
const classData = window.StudentData.classes.find((c) => c.code === classCode);

if (!classData) {
  window.location.href = "../index.html";
}

function populateClassDetails() {
  document.getElementById("classCode").textContent = classData.code;
  document.getElementById("classLevel").textContent = classData.level;
  document.querySelector("#class-title").textContent = classData.title;
  document.getElementById("classSchedule").textContent = `${classData.day} · ${classData.time}`;
  document.getElementById("classLocation").textContent = `${classData.room}, ${classData.building}`;
  document.getElementById("classCredits").textContent = `${classData.credits} Credits`;
  document.getElementById("classDescription").textContent = classData.description;

  const objectivesList = document.getElementById("objectivesList");
  objectivesList.innerHTML = classData.learningObjectives.map((obj) => `<li>${obj}</li>`).join("");

  const curriculumList = document.getElementById("curriculumList");
  curriculumList.innerHTML = classData.curriculum
    .map((unit, index) => `
      <details class="curriculum-unit" ${index === 0 ? "open" : ""}>
        <summary>
          <strong>${unit.unit}: ${unit.title}</strong>
          <svg viewBox="0 0 24 24" class="chevron-icon" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
          </svg>
        </summary>
        <p>${unit.topics}</p>
      </details>
    `)
    .join("");

  document.getElementById("teacherAvatar").textContent = classData.teacher.avatar;
  document.getElementById("teacherAvatar").style.background = classData.teacher.color;
  document.getElementById("teacherName").textContent = classData.teacher.name;
  document.getElementById("teacherRole").textContent = classData.teacher.role;

  const sessionsList = document.getElementById("sessionsList");
  if (classData.upcomingSessions && classData.upcomingSessions.length > 0) {
    sessionsList.innerHTML = classData.upcomingSessions.slice(0, 3).map((session) => {
      const statusBadgeClass = session.status === "ongoing" ? "badge-active" : "badge-scheduled";
      const statusLabel = session.status === "ongoing" ? "Ongoing" : "Scheduled";
      return `
        <div class="session-item">
          <div class="session-date-time">
            <strong>${session.date}</strong>
            <span>${session.time}</span>
          </div>
          <span class="badge ${statusBadgeClass}">${statusLabel}</span>
        </div>
      `;
    }).join("");
  } else {
    sessionsList.innerHTML = '<p class="empty-sessions">No upcoming sessions</p>';
  }
}

function initTabs() {
  const tabLinks = document.querySelectorAll(".tab-link[data-tab]");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const tabName = link.dataset.tab;

      tabLinks.forEach((item) => item.classList.remove("active"));
      tabContents.forEach((item) => item.classList.remove("active"));

      link.classList.add("active");
      document.getElementById(`${tabName}-tab`).classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateClassDetails();
  initTabs();
});
