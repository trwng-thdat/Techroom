const params = new URLSearchParams(window.location.search);
const requestId = params.get("request") || window.StaffData.makeupRequests[0].id;
const request = window.StaffData.makeupRequests.find((item) => item.id === requestId) || window.StaffData.makeupRequests[0];
const makeupStudentName = document.querySelector("#makeupStudentName");
const makeupSubject = document.querySelector("#makeupSubject");
const makeupLevel = document.querySelector("#makeupLevel");
const filterSessionsButton = document.querySelector("#filterSessionsButton");
const makeupSessionTable = document.querySelector("#makeupSessionTable");
let selectedSessionId = "";

function renderOptions() {
  const subjects = [...new Set(window.StaffData.makeupAvailableSessions.map((session) => session.subject))];
  const levels = [...new Set(window.StaffData.makeupAvailableSessions.map((session) => session.level))];
  makeupSubject.innerHTML = subjects.map((subject) => `<option${subject === request.subject ? " selected" : ""}>${subject}</option>`).join("");
  makeupLevel.innerHTML = levels.map((level) => `<option${level === request.level ? " selected" : ""}>${level}</option>`).join("");
}

function renderSessions() {
  const rows = window.StaffData.makeupAvailableSessions.filter(
    (session) => session.subject === makeupSubject.value && session.level === makeupLevel.value
  );

  makeupSessionTable.innerHTML = rows
    .map(
      (session) => `
        <tr>
          <td><strong>${session.code}</strong></td>
          <td>${session.topic}</td>
          <td><strong>${session.date}</strong><small>${session.time}</small></td>
          <td>${session.room}</td>
          <td><span class="seat-chip">${session.seats}</span></td>
          <td><button class="primary-button compact-button${selectedSessionId === session.id ? " selected-button" : ""}" type="button" data-session-id="${session.id}">${selectedSessionId === session.id ? "Selected" : "Select"}</button></td>
        </tr>
      `
    )
    .join("");
}

makeupStudentName.textContent = request.student;
renderOptions();
renderSessions();

filterSessionsButton.addEventListener("click", () => {
  selectedSessionId = "";
  renderSessions();
  showToast("Available makeup sessions filtered.");
});

[makeupSubject, makeupLevel].forEach((control) => {
  control.addEventListener("change", renderSessions);
});

makeupSessionTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-session-id]");
  if (!button) return;
  selectedSessionId = button.dataset.sessionId;
  renderSessions();
  showToast(`${request.student} assigned to selected makeup class.`);
});
