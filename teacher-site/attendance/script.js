/* ============================================================
   attendance/script.js
   Reads: window.TeacherData.students   — full student roster
          window.TeacherData.sessions   — to find current session date
   Features:
     - Renders every student as a Present / Absent / Late toggle row
     - Live CLASS COMPLETION bar (% of students marked)
     - Live summary chips in submit bar
     - "Save Attendance" → toast confirmation
   ============================================================ */

const { students, sessions } = window.TeacherData;

// Find the session to display (today's / current, or fall back to first In Progress)
const currentSession =
  sessions.find((s) => s.today || s.current) ||
  sessions.find((s) => s.status === "In Progress") ||
  sessions[0];

// Attendance state: { [studentId]: 'present' | 'absent' | 'late' | null }
const state = {};
students.forEach((s) => { state[s.id] = null; });

// ── DOM refs ─────────────────────────────────────────────────
const rosterList     = document.getElementById("rosterList");
const completionBar  = document.getElementById("completionBar");
const completionPct  = document.getElementById("completionPct");
const submitSummary  = document.getElementById("submitSummary");
const submitBtn      = document.getElementById("submitBtn");
const sessionDateEl  = document.getElementById("sessionDate");
const toast          = document.getElementById("toast");

// ── Populate session date ─────────────────────────────────────
if (currentSession && sessionDateEl) {
  sessionDateEl.textContent = `${currentSession.day}, ${currentSession.date}`;
}

// ── SVG icons ─────────────────────────────────────────────────
const ICONS = {
  present: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>`,
  absent:  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  late:    `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
};

// ── Render roster ──────────────────────────────────────────────
function renderRoster() {
  rosterList.innerHTML = students
    .map((student, idx) => {
      return `
        <div
          class="student-row"
          role="listitem"
          data-id="${student.id}"
          style="animation-delay:${idx * 30}ms"
        >
          <!-- Student info -->
          <div class="stu-info">
            <div
              class="stu-avatar"
              style="background:${student.color}"
              aria-hidden="true"
            >${student.avatar}</div>
            <div class="stu-details">
              <div class="stu-name">${student.name}</div>
              <div class="stu-id">ID: #STU-${student.id}</div>
            </div>
          </div>

          <!-- Present -->
          <div class="att-cell">
            <button
              class="att-btn${state[student.id] === 'present' ? ' present' : ''}"
              type="button"
              data-student="${student.id}"
              data-status="present"
              aria-label="Mark ${student.name} as present"
              aria-pressed="${state[student.id] === 'present'}"
            >${ICONS.present}</button>
          </div>

          <!-- Absent -->
          <div class="att-cell">
            <button
              class="att-btn${state[student.id] === 'absent' ? ' absent' : ''}"
              type="button"
              data-student="${student.id}"
              data-status="absent"
              aria-label="Mark ${student.name} as absent"
              aria-pressed="${state[student.id] === 'absent'}"
            >${ICONS.absent}</button>
          </div>

          <!-- Late -->
          <div class="att-cell">
            <button
              class="att-btn${state[student.id] === 'late' ? ' late' : ''}"
              type="button"
              data-student="${student.id}"
              data-status="late"
              aria-label="Mark ${student.name} as late"
              aria-pressed="${state[student.id] === 'late'}"
            >${ICONS.late}</button>
          </div>
        </div>`;
    })
    .join("");
}

// ── Update completion bar + summary ───────────────────────────
function updateStats() {
  const counts = { present: 0, absent: 0, late: 0, unmarked: 0 };
  students.forEach((s) => {
    const v = state[s.id];
    if (v) counts[v]++;
    else counts.unmarked++;
  });

  const marked = students.length - counts.unmarked;
  const pct = Math.round((marked / students.length) * 100);

  completionBar.style.width = `${pct}%`;
  completionPct.textContent = `${pct}%`;

  submitSummary.innerHTML = `
    <span class="summary-chip">
      <span class="summary-dot present"></span>
      Present: <strong>${counts.present}</strong>
    </span>
    <span class="summary-chip">
      <span class="summary-dot absent"></span>
      Absent: <strong>${counts.absent}</strong>
    </span>
    <span class="summary-chip">
      <span class="summary-dot late"></span>
      Late: <strong>${counts.late}</strong>
    </span>
    <span class="summary-chip">
      <span class="summary-dot unmarked"></span>
      Unmarked: <strong>${counts.unmarked}</strong>
    </span>`;
}

// ── Toggle button clicks (event delegation) ───────────────────
rosterList.addEventListener("click", (e) => {
  const btn = e.target.closest(".att-btn[data-student]");
  if (!btn) return;

  const id     = btn.dataset.student;
  const status = btn.dataset.status;

  // Toggle off if already selected
  state[id] = state[id] === status ? null : status;

  // Update all 3 buttons for this student without a full re-render
  const row = btn.closest(".student-row");
  row.querySelectorAll(".att-btn").forEach((b) => {
    const s = b.dataset.status;
    const active = state[id] === s;
    b.classList.toggle(s, active);
    // Remove the other two active classes
    ["present", "absent", "late"].forEach((cls) => {
      if (cls !== s) b.classList.remove(cls);
    });
    b.setAttribute("aria-pressed", active);
  });

  updateStats();
});

// ── Submit ────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.remove("hidden");
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3000);
}

submitBtn.addEventListener("click", () => {
  const counts = { present: 0, absent: 0, late: 0, unmarked: 0 };
  students.forEach((s) => {
    const v = state[s.id];
    if (v) counts[v]++;
    else counts.unmarked++;
  });

  if (counts.unmarked === students.length) {
    showToast("⚠ Please mark at least one student before saving.");
    return;
  }

  showToast(`✓ Attendance saved — ${counts.present} present, ${counts.absent} absent, ${counts.late} late, ${counts.unmarked} unmarked.`);
});

// ── Init ──────────────────────────────────────────────────────
renderRoster();
updateStats();
