const timetableGrid = document.querySelector("#timetableGrid");
const sessionDetailModal = document.querySelector("#sessionDetailModal");
const closeSessionDetail = document.querySelector("#closeSessionDetail");
const sessionDetailKicker = document.querySelector("#sessionDetailKicker");
const sessionDetailTitle = document.querySelector("#sessionDetailTitle");
const sessionDetailMeta = document.querySelector("#sessionDetailMeta");
const substituteTeacher = document.querySelector("#substituteTeacher");
const assignSubstitute = document.querySelector("#assignSubstitute");
const makeupStudentList = document.querySelector("#makeupStudentList");
const addMakeupStudents = document.querySelector("#addMakeupStudents");
const sessionAssignments = document.querySelector("#sessionAssignments");
const days = [
  { key: "Mon", date: "12" },
  { key: "Tue", date: "13" },
  { key: "Wed", date: "14" },
  { key: "Thu", date: "15" },
  { key: "Fri", date: "16" },
];
const hourLabels = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const slots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];
const sessions = window.StaffData.timetableSessions;
const sessionState = {};
let activeSession = null;

function minutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function getGridRow(start, end) {
  const startIndex = slots.indexOf(start);
  const durationSlots = Math.max(1, Math.ceil((minutes(end) - minutes(start)) / 30));

  return `${startIndex + 2} / span ${durationSlots}`;
}

function renderDayHeaders() {
  return days
    .map(
      (day, index) => `
        <div class="day-head" style="grid-column:${index + 2};grid-row:1">
          <small>${day.key}</small>
          <strong>${day.date}</strong>
        </div>
      `
    )
    .join("");
}

function renderTimeRows() {
  return hourLabels
    .map((time) => {
      const slotIndex = slots.indexOf(time);
      const row = slotIndex + 2;

      return `
        <div class="time-label" style="grid-column:1;grid-row:${row}">${time}</div>
      `;
    })
    .join("");
}

function renderGridBackground() {
  return `
    <div class="time-gutter-bg" style="grid-column:1;grid-row:2 / -1"></div>
    <div class="calendar-bg" style="grid-column:2 / -1;grid-row:2 / -1"></div>
    ${days
      .map(
        (day, index) => `
          <div class="day-column" style="grid-column:${index + 2};grid-row:2 / -1"></div>
        `
      )
      .join("")}
  `;
}

function renderSessions() {
  return sessions
    .map((session) => {
      const col = days.findIndex((day) => day.key === session.day) + 2;
      return `
        <article class="session-card ${session.tone}" style="grid-column:${col};grid-row:${getGridRow(session.start, session.end)}">
          <button class="session-menu" type="button" data-toast="Edit and delete actions are demo-only." aria-label="Session actions">⋮</button>
          <p>${session.category}</p>
          <h2>${session.title}</h2>
          <small>${session.room}</small>
          ${session.students ? `<span>${session.students} Students</span>` : ""}
          <button class="session-open" type="button" data-session-id="${session.id}" aria-label="Open ${session.title} details"></button>
        </article>
      `;
    })
    .join("");
}

timetableGrid.innerHTML = `
  <div class="time-spacer" style="grid-column:1;grid-row:1"></div>
  ${renderDayHeaders()}
  ${renderGridBackground()}
  ${renderTimeRows()}
  ${renderSessions()}
`;

function getState(sessionId) {
  if (!sessionState[sessionId]) {
    sessionState[sessionId] = {
      substitute: "",
      makeupStudentIds: [],
    };
  }

  return sessionState[sessionId];
}

function renderSubstituteOptions() {
  substituteTeacher.innerHTML = window.StaffData.staffTeachers
    .map((teacher) => `<option value="${teacher.id}"${teacher.status === "Busy" ? " disabled" : ""}>${teacher.name} - ${teacher.subject}${teacher.status === "Busy" ? " (Busy)" : ""}</option>`)
    .join("");
}

function renderMakeupStudents() {
  const state = getState(activeSession.id);
  makeupStudentList.innerHTML = window.StaffData.makeupStudents
    .map((student) => {
      const checked = state.makeupStudentIds.includes(student.id);
      return `
        <label class="makeup-student-card${checked ? " is-selected" : ""}">
          <input type="checkbox" value="${student.id}" ${checked ? "checked" : ""} />
          <span class="student-avatar">${student.initials}</span>
          <span><strong>${student.name}</strong><small>${student.id} - ${student.reason}</small></span>
          <span class="status-pill ${student.status.toLowerCase()}">${student.status}</span>
        </label>
      `;
    })
    .join("");
}

function renderAssignments() {
  const state = getState(activeSession.id);
  const teacher = window.StaffData.staffTeachers.find((item) => item.id === state.substitute);
  const makeupStudents = window.StaffData.makeupStudents.filter((student) =>
    state.makeupStudentIds.includes(student.id)
  );

  sessionAssignments.innerHTML = `
    <p><strong>Substitute:</strong> ${teacher ? teacher.name : "No substitute assigned"}</p>
    <p><strong>Makeup students:</strong> ${makeupStudents.length ? makeupStudents.map((student) => student.name).join(", ") : "None added"}</p>
  `;
}

function openSessionDetail(sessionId) {
  activeSession = sessions.find((session) => session.id === sessionId);
  if (!activeSession) return;

  sessionDetailKicker.textContent = `${activeSession.day} ${activeSession.start} - ${activeSession.end}`;
  sessionDetailTitle.textContent = activeSession.title;
  sessionDetailMeta.textContent = `${activeSession.category} • ${activeSession.room || "No room"} • ${activeSession.students || 0} students`;
  renderSubstituteOptions();
  const state = getState(activeSession.id);
  if (state.substitute) {
    substituteTeacher.value = state.substitute;
  }
  renderMakeupStudents();
  renderAssignments();
  sessionDetailModal.hidden = false;
}

function closeModal() {
  sessionDetailModal.hidden = true;
  activeSession = null;
}

timetableGrid.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-session-id]");
  if (openButton) {
    openSessionDetail(openButton.dataset.sessionId);
  }
});

closeSessionDetail.addEventListener("click", closeModal);
sessionDetailModal.addEventListener("click", (event) => {
  if (event.target === sessionDetailModal) {
    closeModal();
  }
});

assignSubstitute.addEventListener("click", () => {
  if (!activeSession) return;
  getState(activeSession.id).substitute = substituteTeacher.value;
  renderAssignments();
  showToast("Substitute teacher assigned to this session.");
});

makeupStudentList.addEventListener("change", (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox || !activeSession) return;
  const state = getState(activeSession.id);

  if (checkbox.checked && !state.makeupStudentIds.includes(checkbox.value)) {
    state.makeupStudentIds.push(checkbox.value);
  } else if (!checkbox.checked) {
    state.makeupStudentIds = state.makeupStudentIds.filter((id) => id !== checkbox.value);
  }

  renderMakeupStudents();
});

addMakeupStudents.addEventListener("click", () => {
  if (!activeSession) return;
  renderAssignments();
  showToast("Makeup students added to this session.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !sessionDetailModal.hidden) {
    closeModal();
  }
});
