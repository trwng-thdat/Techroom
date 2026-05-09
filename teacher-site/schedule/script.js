/* ============================================================
   schedule/script.js
   Reads: window.TeacherData.sessions
   Features:
     - Sort chronologically (earliest → latest)
     - Paginate: PAGE_SIZE sessions per page
     - Auto-jump to the page containing today's session on load
     - "View Roster" / "Take Attendance" → modal placeholder
     - Prev / Next page buttons with disabled states
   ============================================================ */

const PAGE_SIZE = 4;

// Sort sessions chronologically by date string
const allSessions = [...window.TeacherData.sessions].sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

const total = allSessions.length;

// Find the page that contains today's session (if any)
const todayIndex = allSessions.findIndex((s) => s.today || s.current);
const initialPage = todayIndex >= 0 ? Math.floor(todayIndex / PAGE_SIZE) : 0;

let currentPage = initialPage;

// DOM refs
const sessionList  = document.getElementById("sessionList");
const sessionCount = document.getElementById("sessionCount");
const prevBtn      = document.getElementById("prevPage");
const nextBtn      = document.getElementById("nextPage");

// ── Helpers ───────────────────────────────────────
function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function renderAction(session) {
  if (!session.action) {
    return `<span class="unavailable">Not Available</span>`;
  }
  const cls = session.status === "In Progress" ? "action-button primary" : "action-button secondary";
  return `<button class="${cls}" type="button" data-action="${session.action}">${session.action}</button>`;
}

// ── Render ────────────────────────────────────────
function render() {
  const start = currentPage * PAGE_SIZE;
  const end   = Math.min(start + PAGE_SIZE, total);
  const page  = allSessions.slice(start, end);

  sessionList.innerHTML = page
    .map((session) => {
      const rowClass  = (session.current || session.today) ? "session-row is-current" : "session-row";
      const todayBadge = session.today
        ? `<span class="today-badge">TODAY</span>`
        : "";

      return `
        <div class="${rowClass}" role="row">
          <div class="date-cell" role="cell">
            <strong>${session.date}${todayBadge}</strong>
            <small>${session.day}</small>
          </div>
          <span class="time-cell" role="cell">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            ${session.time}
          </span>
          <span class="status-pill ${statusClass(session.status)}" role="cell">
            ${session.status.toUpperCase()}
          </span>
          <div class="action-cell" role="cell">
            ${renderAction(session)}
          </div>
        </div>`;
    })
    .join("");

  // Footer count
  sessionCount.textContent = `Showing ${end - start} of ${total} scheduled sessions`;

  // Pagination button states
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = end >= total;
}

// ── Pagination buttons ────────────────────────────
prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    render();
    sessionList.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

nextBtn.addEventListener("click", () => {
  const maxPage = Math.ceil(total / PAGE_SIZE) - 1;
  if (currentPage < maxPage) {
    currentPage++;
    render();
    sessionList.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

// ── Action button clicks ──────────────────────────
sessionList.addEventListener("click", (e) => {
  const btn = e.target.closest(".action-button");
  if (!btn) return;

  if (btn.dataset.action === "Take Attendance") {
    window.location.href = "../attendance/index.html";
  } else {
    showModal(`${btn.dataset.action} — roster view will be added next.`);
  }
});

// ── Initial render ────────────────────────────────
render();
