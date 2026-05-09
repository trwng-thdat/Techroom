/* ============================================================
   submissions/script.js
   Reads:  window.TeacherData.assignments  (for header/stats)
           window.TeacherData.submissions  (for submission list)
           window.TeacherData.students     (for student meta)
   URL param: ?assignment=<encoded title>   (falls back to index 0)
   ============================================================ */

const { assignments, submissions, students } = window.TeacherData;

// ── Resolve assignment from URL param ─────────────────────────
const params = new URLSearchParams(window.location.search);
const assignmentTitle = params.get("assignment") || assignments[0].title;
const assignment = assignments.find((a) => a.title === assignmentTitle) || assignments[0];

// ── Student lookup map ────────────────────────────────────────
const studentMap = {};
students.forEach((s) => { studentMap[s.id] = s; });

// ── State ─────────────────────────────────────────────────────
let activeFilter = "all";
let activeSort = "date-desc";
let gradedScores = {}; // tracks runtime grade edits: { studentId: score }

// ── DOM refs ──────────────────────────────────────────────────
const el = (id) => document.getElementById(id);

const assignmentTitleEl  = el("assignment-title");
const breadcrumbEl       = el("assignmentBreadcrumb");
const postedEl           = el("assignmentPosted");
const deadlineEl         = el("assignmentDeadline");
const statTurnedIn       = el("statTurnedIn");
const statGraded         = el("statGraded");
const statAvgScore       = el("statAvgScore");
const submissionList     = el("submissionList");
const emptyState         = el("emptyState");
const filterTabs         = document.querySelectorAll(".filter-tab");
const sortSelect         = el("sortSelect");
const notSubmittedSection = el("notSubmittedSection");
const nsToggle           = el("nsToggle");
const nsToggleLabel      = el("nsToggleLabel");
const nsList             = el("nsList");

// Modal
const gradeModalOverlay  = el("gradeModalOverlay");
const gradeModalTitle    = el("gradeModalTitle");
const gradeModalStudent  = el("gradeModalStudent");
const modalFiles         = el("modalFiles");
const scoreInput         = el("scoreInput");
const scoreMax           = el("scoreMax");
const feedbackInput      = el("feedbackInput");
const gradeModalClose    = el("gradeModalClose");
const gradeModalCancel   = el("gradeModalCancel");
const gradeModalSave     = el("gradeModalSave");

// Toast
const toast = el("toast");
let toastTimer;

// ── Populate header ──────────────────────────────────────────
document.title = `${assignment.title} — Submissions | Teacher`;
assignmentTitleEl.textContent = assignment.title;
breadcrumbEl.textContent = `${assignment.subject || "Advanced Mathematics"} — ${assignment.grade || "Grade 10"}`;
postedEl.textContent = `Posted ${assignment.postedFull || assignment.posted}`;
deadlineEl.textContent = assignment.deadlineFull || assignment.deadline;

// ── Stats ─────────────────────────────────────────────────────
function computeStats() {
  const list = submissions[assignment.title] || [];
  const gradedCount = list.filter(
    (s) => s.score !== null || gradedScores[s.studentId] !== undefined
  ).length;
  const scores = list
    .map((s) => gradedScores[s.studentId] ?? s.score)
    .filter((v) => v !== null && v !== undefined);
  const avg = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  statTurnedIn.innerHTML = `${list.length}<span class="stat-denom">/${assignment.total}</span>`;
  statGraded.textContent = gradedCount;
  statAvgScore.textContent = avg !== null ? `${avg}%` : "—";
}

// ── File icon ─────────────────────────────────────────────────
function fileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const icons = {
    pdf:  `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>`,
    doc:  `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>`,
    docx: `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>`,
    zip:  `<svg viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"/><path d="M14 2v6h6"/></svg>`,
  };
  return icons[ext] || icons.pdf;
}

// ── Render submission row ─────────────────────────────────────
function renderRow(sub) {
  const student = studentMap[sub.studentId];
  if (!student) return "";

  const score = gradedScores[sub.studentId] ?? sub.score;
  const isGraded = score !== null && score !== undefined;
  const badgeHtml = sub.late
    ? `<span class="badge badge-late"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>LATE</span>`
    : `<span class="badge badge-on-time"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>ON TIME</span>`;

  const scoreHtml = isGraded
    ? `<div class="score-display">
        <div class="score-label-sm">SCORE</div>
        <div class="score-number">${score}<span>/${sub.maxScore}</span></div>
       </div>`
    : badgeHtml;

  const actionHtml = isGraded
    ? `<button class="btn-edit" data-student-id="${sub.studentId}" data-action="edit">Edit</button>`
    : `<button class="btn-grade" data-student-id="${sub.studentId}" data-action="grade">Grade</button>`;

  const filesHtml = (sub.files || [])
    .map(
      (f) =>
        `<span class="file-chip">${fileIcon(f)}${f}</span>`
    )
    .join("");

  return `
    <div class="submission-item" role="listitem" data-student-id="${sub.studentId}" data-late="${sub.late}" data-graded="${isGraded}">
      <div class="sub-avatar" aria-hidden="true">
        <div class="sub-avatar-inner" style="background:${student.color}">${student.avatar}</div>
        <span class="sub-avatar-dot${sub.late ? " late" : ""}"></span>
      </div>
      <div class="sub-info">
        <div class="sub-name">${student.name}</div>
        <div class="sub-time">Submitted ${sub.submittedAt}</div>
        <div class="sub-files">${filesHtml}</div>
      </div>
      <div class="sub-status">${scoreHtml}</div>
      <div class="sub-action">${actionHtml}</div>
    </div>`;
}

// ── Not-submitted students ────────────────────────────────────
function renderNotSubmitted() {
  const submittedIds = new Set(
    (submissions[assignment.title] || []).map((s) => s.studentId)
  );
  const missing = students.filter((s) => !submittedIds.has(s.id));
  if (missing.length === 0) {
    notSubmittedSection.classList.add("hidden");
    return;
  }

  notSubmittedSection.classList.remove("hidden");
  nsToggleLabel.textContent = `Not Submitted (${missing.length})`;
  nsList.innerHTML = missing
    .map(
      (s) => `
        <div class="ns-item">
          <div class="ns-avatar" style="background:${s.color}" aria-hidden="true">${s.avatar}</div>
          <span class="ns-name">${s.name}</span>
          <span class="ns-badge">Not Submitted</span>
        </div>`
    )
    .join("");
}

// ── Sort helper ───────────────────────────────────────────────
function sortedList(list) {
  const copy = [...list];
  switch (activeSort) {
    case "date-asc":
      return copy.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
    case "date-desc":
      return copy.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    case "name-asc":
      return copy.sort((a, b) =>
        (studentMap[a.studentId]?.name || "").localeCompare(studentMap[b.studentId]?.name || "")
      );
    case "name-desc":
      return copy.sort((a, b) =>
        (studentMap[b.studentId]?.name || "").localeCompare(studentMap[a.studentId]?.name || "")
      );
    case "score-desc":
      return copy.sort(
        (a, b) => (gradedScores[b.studentId] ?? b.score ?? -1) - (gradedScores[a.studentId] ?? a.score ?? -1)
      );
    case "score-asc":
      return copy.sort(
        (a, b) => (gradedScores[a.studentId] ?? a.score ?? 999) - (gradedScores[b.studentId] ?? b.score ?? 999)
      );
    default:
      return copy;
  }
}

// ── Main render ───────────────────────────────────────────────
function render() {
  const list = submissions[assignment.title] || [];
  let filtered = list;

  if (activeFilter === "ungraded") {
    filtered = list.filter(
      (s) => (gradedScores[s.studentId] ?? s.score) === null
    );
  } else if (activeFilter === "graded") {
    filtered = list.filter(
      (s) => (gradedScores[s.studentId] ?? s.score) !== null
    );
  } else if (activeFilter === "late") {
    filtered = list.filter((s) => s.late);
  }

  filtered = sortedList(filtered);

  if (filtered.length === 0) {
    submissionList.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    submissionList.innerHTML = filtered.map(renderRow).join("");
  }

  computeStats();
  renderNotSubmitted();
}

// ── Filter tabs ───────────────────────────────────────────────
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    filterTabs.forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });
    render();
  });
});

// ── Sort ─────────────────────────────────────────────────────
sortSelect.addEventListener("change", () => {
  activeSort = sortSelect.value;
  render();
});

// ── Not-submitted toggle ─────────────────────────────────────
nsToggle.addEventListener("click", () => {
  const expanded = nsToggle.getAttribute("aria-expanded") === "true";
  nsToggle.setAttribute("aria-expanded", !expanded);
  nsList.classList.toggle("hidden", expanded);
});

// ── Grade modal helpers ───────────────────────────────────────
let currentStudentId = null;
let currentMaxScore = 100;

function openGradeModal(studentId) {
  const student = studentMap[studentId];
  const sub = (submissions[assignment.title] || []).find(
    (s) => s.studentId === studentId
  );
  if (!student || !sub) return;

  currentStudentId = studentId;
  currentMaxScore = sub.maxScore || 100;

  gradeModalTitle.textContent =
    (gradedScores[studentId] ?? sub.score) !== null ? "Edit Grade" : "Grade Submission";
  gradeModalStudent.textContent = `${student.name} · ID ${student.id}`;
  scoreMax.textContent = `/ ${currentMaxScore}`;
  scoreInput.max = currentMaxScore;
  scoreInput.value = gradedScores[studentId] ?? sub.score ?? "";
  feedbackInput.value = "";

  modalFiles.innerHTML = (sub.files || [])
    .map(
      (f) =>
        `<span class="modal-file-chip">${fileIcon(f)}${f}</span>`
    )
    .join("");

  gradeModalOverlay.classList.remove("hidden");
  setTimeout(() => scoreInput.focus(), 50);
}

function closeGradeModal() {
  gradeModalOverlay.classList.add("hidden");
  currentStudentId = null;
}

gradeModalClose.addEventListener("click", closeGradeModal);
gradeModalCancel.addEventListener("click", closeGradeModal);
gradeModalOverlay.addEventListener("click", (e) => {
  if (e.target === gradeModalOverlay) closeGradeModal();
});

gradeModalSave.addEventListener("click", () => {
  const val = parseInt(scoreInput.value, 10);
  if (isNaN(val) || val < 0 || val > currentMaxScore) {
    scoreInput.classList.add("error");
    scoreInput.focus();
    setTimeout(() => scoreInput.classList.remove("error"), 1200);
    return;
  }
  gradedScores[currentStudentId] = val;
  closeGradeModal();
  render();
  showToast(`Grade saved: ${val}/${currentMaxScore}`);
});

// ── Delegation: Grade / Edit buttons ─────────────────────────
submissionList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  openGradeModal(btn.dataset.studentId);
});

// ── Keyboard: close modal on Escape ──────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeGradeModal();
});

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.remove("hidden");
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2800);
}

// ── Wire "View Submissions" in assignments page ────────────────
// (assignments/script.js uses showModal as placeholder; we redirect instead)
// This page is standalone — the assignments page should link here via:
//   submissions/index.html?assignment=<encodeURIComponent(title)>

// ── Initial render ────────────────────────────────────────────
render();
