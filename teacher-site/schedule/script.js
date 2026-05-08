const sessions = window.TeacherData.sessions;

const sessionList = document.querySelector("#sessionList");
const sessionCount = document.querySelector("#sessionCount");

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function renderAction(session) {
  if (!session.action) {
    return '<span class="unavailable">Not Available</span>';
  }

  const buttonClass = session.status === "In Progress" ? "action-button primary" : "action-button";

  return `<button class="${buttonClass}" type="button" data-action="${session.action}">${session.action}</button>`;
}

function renderSessions() {
  sessionList.innerHTML = sessions
    .map((session) => {
      const rowClass = session.current ? "session-row is-current" : "session-row";
      const todayBadge = session.today ? '<span class="today-badge">TODAY</span>' : "";

      return `
        <div class="${rowClass}" role="row">
          <div class="date-cell" role="cell">
            <strong>${session.date}${todayBadge}</strong>
            <small>${session.day}</small>
          </div>
          <span class="time-cell" role="cell">
            <svg viewBox="0 0 24 24"><path d="M12 7v5l3 2" /><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" /></svg>
            ${session.time}
          </span>
          <span class="status-pill ${getStatusClass(session.status)}" role="cell">${session.status.toUpperCase()}</span>
          <div class="action-cell" role="cell">${renderAction(session)}</div>
        </div>
      `;
    })
    .join("");

  sessionCount.textContent = `Showing ${sessions.length} of 28 scheduled sessions`;
}

const tooltip = document.createElement("div");
tooltip.className = "session-tooltip";
tooltip.hidden = true;
document.body.appendChild(tooltip);

sessionList.addEventListener("mouseover", (event) => {
  const row = event.target.closest(".session-row");
  if (!row) return;

  const date = row.querySelector(".date-cell strong").textContent.replace("TODAY", "").trim();
  const day = row.querySelector(".date-cell small").textContent;
  const time = row.querySelector(".time-cell").textContent.trim();
  const status = row.querySelector(".status-pill").textContent.trim();

  tooltip.textContent = `${date} (${day}) - ${time} - ${status}`;
  tooltip.hidden = false;

  const rect = row.getBoundingClientRect();
  tooltip.style.left = Math.min(rect.left + 20, window.innerWidth - tooltip.offsetWidth - 16) + "px";
  tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + "px";
});

sessionList.addEventListener("mouseout", (event) => {
  if (event.target.closest(".session-row")) {
    tooltip.hidden = true;
  }
});

sessionList.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".action-button");

  if (!actionButton) {
    return;
  }

  window.alert(`${actionButton.dataset.action} flow will be added next.`);
});

renderSessions();
