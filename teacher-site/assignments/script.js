// ── State ──
let createWorkspace = null;
let uploadedFiles = [];

// ── DOM refs ──
const assignmentList = document.querySelector("#assignmentList");
const createAssignmentButton = document.querySelector("#createAssignment");
const assignmentToolbar = document.querySelector(".assignment-toolbar");
const assignmentPanel = document.querySelector(".assignment-panel");
const content = document.querySelector(".content");
const emptyState = document.querySelector(".empty-state");

// ── Persistence ──
function persistAssignments() {
  localStorage.setItem("techroom_assignments", JSON.stringify(window.TeacherData.assignments));
}

// ── Render ──
function renderAssignments() {
  const list = window.TeacherData.assignments;

  if (list.length === 0) {
    assignmentList.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }
  if (emptyState) emptyState.hidden = true;

  assignmentList.innerHTML = list
    .map((a) => {
      const pct = a.total > 0 ? Math.round((a.submitted / a.total) * 100) : 0;
      const deadlineClass = a.urgent ? "deadline-danger" : "muted";
      const typeBadge = a.type === "quiz"
        ? `<span class="type-badge type-quiz">Quiz</span>`
        : `<span class="type-badge type-file">File</span>`;

      var checked = a.allowLate ? "checked" : "";

      return `
        <div class="assignment-row" role="row" data-id="${a.id}">
          <span class="assignment-title" role="cell">${typeBadge}${a.title}</span>
          <span class="muted" role="cell">${a.posted}</span>
          <span class="${deadlineClass}" role="cell">${a.deadline}</span>
          <div class="late-cell" role="cell">
            <label class="late-toggle" title="Allow late submissions">
              <input type="checkbox" class="late-checkbox" data-id="${a.id}" ${checked} />
              <span class="late-slider"></span>
            </label>
          </div>
          <div class="progress-cell" role="cell">
            <div class="progress-track" aria-label="${a.submitted} of ${a.total} submissions">
              <span style="width: ${pct}%"></span>
            </div>
            <small>${a.submitted}/${a.total}</small>
          </div>
          <div class="actions" role="cell">
            <button class="delete-button" type="button" data-action="delete" data-id="${a.id}">Delete</button>
            <button class="submissions-button" type="button" data-action="submissions" data-id="${a.id}">View Submissions</button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ── Create choice modal ──
function showCreateModal() {
  var overlay = document.createElement('div');
  overlay.className = 'create-choice-overlay';
  overlay.innerHTML =
    '<div class="create-choice-modal" role="dialog" aria-modal="true" aria-labelledby="createModalTitle">' +
      '<h2 id="createModalTitle">Create New Assignment</h2>' +
      '<p class="create-choice-sub">Choose the type of assignment you want to create.</p>' +
      '<div class="choice-options">' +
        '<button class="choice-option" data-type="file" type="button">' +
          '<span class="choice-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>' +
          '</span>' +
          '<span class="choice-label">File Assignment</span>' +
          '<span class="choice-desc">Students submit a file for grading</span>' +
        '</button>' +
        '<button class="choice-option" data-type="quiz" type="button">' +
          '<span class="choice-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
          '</span>' +
          '<span class="choice-label">Multiple Choice Quiz</span>' +
          '<span class="choice-desc">Auto-graded quiz with multiple choice questions</span>' +
        '</button>' +
      '</div>' +
      '<button class="choice-cancel" type="button">Cancel</button>' +
    '</div>';

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay || e.target.classList.contains('choice-cancel')) {
      overlay.remove();
      return;
    }
    var opt = e.target.closest('.choice-option');
    if (opt) {
      overlay.remove();
      window.location.href = 'index.html?create=' + opt.dataset.type;
    }
  });

  document.body.appendChild(overlay);
}

// ── Create workspace ──
function ensureCreateWorkspace() {
  if (createWorkspace) return createWorkspace;
  createWorkspace = document.createElement("section");
  createWorkspace.className = "create-workspace";
  createWorkspace.hidden = true;
  createWorkspace.setAttribute("aria-live", "polite");
  content.appendChild(createWorkspace);
  return createWorkspace;
}

function renderFileAssignmentForm() {
  uploadedFiles = [];
  return `
    <div class="create-header">
      <div>
        <p class="create-kicker">Create Assignment</p>
        <h2>Manage Assignment</h2>
      </div>
      <span class="create-type-pill">File Attachment</span>
    </div>

    <div class="create-card">
      <h3>Assignment Details</h3>
      <label class="field-group">
        <span>Assignment Title</span>
        <input type="text" id="fa-title" placeholder="Enter assignment title" />
      </label>
      <label class="field-group">
        <span>Description</span>
        <textarea id="fa-desc" rows="5" placeholder="Provide requirements and instructions for students"></textarea>
      </label>
    </div>

    <div class="create-card">
      <h3>Deadline &amp; Grading</h3>
      <div class="field-grid">
        <label class="field-group">
          <span>Due Date</span>
          <input type="date" id="fa-date" />
        </label>
        <label class="field-group">
          <span>Due Time</span>
          <input type="time" id="fa-time" />
        </label>
        <label class="field-group">
          <span>Max Score</span>
          <input type="number" id="fa-max-score" min="0" value="100" />
        </label>
      </div>
      <label class="toggle-field">
        <input type="checkbox" id="fa-late" checked />
        <span>Allow late submissions</span>
      </label>
    </div>

    <div class="create-card">
      <h3>Attachments</h3>
      <div class="upload-zone">
        <input type="file" id="fa-file-input" hidden multiple />
        <button class="upload-placeholder" id="fa-upload-btn" type="button">
          <strong>Upload resource file</strong>
          <small>Click to browse for files</small>
        </button>
        <div id="fa-file-list" class="file-list"></div>
      </div>
    </div>

    <div class="create-actions">
      <button class="secondary-action" type="button" data-action="cancel">Cancel</button>
      <button class="primary-action" type="button" data-action="save-file">Save Changes</button>
    </div>
  `;
}

function renderQuizAssignmentForm() {
  return `
    <div class="create-header">
      <div>
        <p class="create-kicker">Create Assignment</p>
        <h2>Manage Multiple Choice Assignment</h2>
      </div>
      <span class="create-type-pill">Multiple Choice Quiz</span>
    </div>

    <div class="create-card">
      <h3>Quiz Information</h3>
      <label class="field-group">
        <span>Quiz Title</span>
        <input type="text" id="qz-title" placeholder="Enter quiz title" />
      </label>
      <label class="field-group">
        <span>Instruction</span>
        <textarea id="qz-instruction" rows="3" placeholder="Write instructions for students"></textarea>
      </label>
      <div class="field-grid">
        <label class="field-group">
          <span>Due Date</span>
          <input type="date" id="qz-date" />
        </label>
        <label class="field-group">
          <span>Due Time</span>
          <input type="time" id="qz-time" />
        </label>
        <label class="field-group">
          <span>Max Score</span>
          <input type="number" id="qz-max-score" min="0" value="100" />
        </label>
      </div>
      <label class="toggle-field">
        <input type="checkbox" id="qz-late" checked />
        <span>Allow late submissions</span>
      </label>
    </div>

    <div id="qz-questions" class="questions-container">
      <div class="question-block" data-qidx="0">
        <div class="question-header">
          <span class="q-number">1</span>
          <div class="q-header-right">
            <span class="q-label">Question</span>
            <button class="q-remove-btn" type="button" data-action="remove-question" data-qidx="0" title="Remove question">
              <svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
        <input type="text" class="q-text" placeholder="Type your question here..." />
        <div class="options-heading">
          <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Answer Choices
          <span class="options-hint">(select the radio next to the correct answer)</span>
        </div>
        <div class="option-list">
          <label class="option-item">
            <input type="radio" class="q-correct" name="q-correct-0" checked />
            <span class="opt-badge">A</span>
            <input type="text" class="q-option" placeholder="Option A" />
            <button class="opt-remove" type="button" data-action="remove-option" data-qidx="0" title="Remove option">
              <svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </label>
          <label class="option-item">
            <input type="radio" class="q-correct" name="q-correct-0" />
            <span class="opt-badge">B</span>
            <input type="text" class="q-option" placeholder="Option B" />
            <button class="opt-remove" type="button" data-action="remove-option" data-qidx="0" title="Remove option">
              <svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </label>
        </div>
        <button class="add-option-btn" type="button" data-action="add-option" data-qidx="0">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add Option
        </button>
      </div>
    </div>

    <div class="add-question-bar">
      <button class="add-question-btn" type="button" data-action="add-question">
        <svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        Add Question
      </button>
    </div>

    <div class="create-actions">
      <button class="secondary-action" type="button" data-action="cancel">Cancel</button>
      <button class="primary-action" type="button" data-action="save-quiz">Save Changes</button>
    </div>
  `;
}

// ── Form helpers ──
function reletterOptions(optionList) {
  var items = optionList.querySelectorAll(".option-item");
  items.forEach(function(item, i) {
    var badge = item.querySelector(".opt-badge");
    if (badge) badge.textContent = String.fromCharCode(65 + i);
    var input = item.querySelector(".q-option");
    if (input) input.placeholder = "Option " + String.fromCharCode(65 + i);
  });
}

function addQuestionBlock(qidx) {
  var container = document.querySelector("#qz-questions");
  var block = document.createElement("div");
  block.className = "question-block";
  block.dataset.qidx = qidx;
  block.innerHTML =
    '<div class="question-header">' +
      '<span class="q-number">' + (qidx + 1) + '</span>' +
      '<div class="q-header-right">' +
        '<span class="q-label">Question</span>' +
        '<button class="q-remove-btn" type="button" data-action="remove-question" data-qidx="' + qidx + '" title="Remove question">' +
          '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<input type="text" class="q-text" placeholder="Type your question here..." />' +
    '<div class="options-heading">' +
      '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
      ' Answer Choices' +
      '<span class="options-hint"> (select the radio next to the correct answer)</span>' +
    '</div>' +
    '<div class="option-list">' +
      '<label class="option-item">' +
        '<input type="radio" class="q-correct" name="q-correct-' + qidx + '" checked />' +
        '<span class="opt-badge">A</span>' +
        '<input type="text" class="q-option" placeholder="Option A" />' +
        '<button class="opt-remove" type="button" data-action="remove-option" data-qidx="' + qidx + '" title="Remove option">' +
          '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
        '</button>' +
      '</label>' +
      '<label class="option-item">' +
        '<input type="radio" class="q-correct" name="q-correct-' + qidx + '" />' +
        '<span class="opt-badge">B</span>' +
        '<input type="text" class="q-option" placeholder="Option B" />' +
        '<button class="opt-remove" type="button" data-action="remove-option" data-qidx="' + qidx + '" title="Remove option">' +
          '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
        '</button>' +
      '</label>' +
    '</div>' +
    '<button class="add-option-btn" type="button" data-action="add-option" data-qidx="' + qidx + '">' +
      '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5v14"/><path d="M5 12h14"/></svg>' +
      ' Add Option' +
    '</button>';
  container.appendChild(block);
}

function addOptionToQuestion(qidx) {
  var block = document.querySelector('.question-block[data-qidx="' + qidx + '"]');
  if (!block) return;
  var optionList = block.querySelector(".option-list");
  var label = document.createElement("label");
  label.className = "option-item";
  var letter = String.fromCharCode(65 + optionList.children.length);
  var name = "q-correct-" + qidx;
  label.innerHTML =
    '<input type="radio" class="q-correct" name="' + name + '" />' +
    '<span class="opt-badge">' + letter + '</span>' +
    '<input type="text" class="q-option" placeholder="Option ' + letter + '" />' +
    '<button class="opt-remove" type="button" data-action="remove-option" data-qidx="' + qidx + '" title="Remove option">' +
      '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
    '</button>';
  optionList.appendChild(label);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return hour12 + ":" + m + " " + ampm;
}

// ── Save file assignment ──
function saveFileAssignment() {
  const title = document.querySelector("#fa-title").value.trim();
  if (!title) { showModal("Please enter an assignment title."); return; }
  const desc = document.querySelector("#fa-desc").value.trim();
  const dateVal = document.querySelector("#fa-date").value;
  const timeVal = document.querySelector("#fa-time").value;
  const maxScore = parseInt(document.querySelector("#fa-max-score").value, 10) || 100;
  const allowLate = document.querySelector("#fa-late").checked;

  const now = new Date();
  const monthsShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const posted = monthsShort[now.getMonth()] + " " + now.getDate();

  let deadline = "";
  let deadlineFull = "";
  if (dateVal) {
    deadline = formatDate(dateVal);
    if (timeVal) deadline += ", " + formatTime(timeVal);
    deadlineFull = deadline;
  }

  const assignment = {
    id: "a" + Date.now(),
    type: "file",
    title: title,
    description: desc,
    posted: posted,
    postedFull: posted,
    deadline: deadline,
    deadlineFull: deadlineFull,
    maxScore: maxScore,
    allowLate: allowLate,
    files: uploadedFiles.slice(),
    submitted: 0,
    total: 28,
    graded: 0,
    avgScore: null,
    urgent: false,
  };

  window.TeacherData.assignments.push(assignment);
  persistAssignments();
  window.location.href = "index.html";
}

// ── Save quiz assignment ──
function saveQuizAssignment() {
  const title = document.querySelector("#qz-title").value.trim();
  if (!title) { showModal("Please enter a quiz title."); return; }
  const instruction = document.querySelector("#qz-instruction").value.trim();
  const dateVal = document.querySelector("#qz-date").value;
  const timeVal = document.querySelector("#qz-time").value;
  const maxScore = parseInt(document.querySelector("#qz-max-score").value, 10) || 100;
  const allowLate = document.querySelector("#qz-late").checked;

  const blocks = document.querySelectorAll(".question-block");
  if (blocks.length === 0) { showModal("Please add at least one question."); return; }

  const questions = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const text = block.querySelector(".q-text").value.trim();
    if (!text) { showModal("Please fill in Question " + (i + 1) + "."); return; }
    const options = block.querySelectorAll(".q-option");
    const correctRadios = block.querySelectorAll(".q-correct");
    let correctIndex = -1;
    const opts = [];
    for (let j = 0; j < options.length; j++) {
      const optVal = options[j].value.trim();
      if (!optVal) { showModal("Please fill in all options for Question " + (i + 1) + "."); return; }
      opts.push(optVal);
      if (correctRadios[j] && correctRadios[j].checked) correctIndex = j;
    }
    if (opts.length < 2) { showModal("Each question needs at least 2 options."); return; }
    questions.push({ id: i + 1, text: text, options: opts, correctIndex: correctIndex >= 0 ? correctIndex : 0 });
  }

  const now = new Date();
  const monthsShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const posted = monthsShort[now.getMonth()] + " " + now.getDate();

  let deadline = "";
  let deadlineFull = "";
  if (dateVal) {
    deadline = formatDate(dateVal);
    if (timeVal) deadline += ", " + formatTime(timeVal);
    deadlineFull = deadline;
  }

  const assignment = {
    id: "q" + Date.now(),
    type: "quiz",
    title: title,
    instruction: instruction,
    questions: questions,
    posted: posted,
    postedFull: posted,
    deadline: deadline,
    deadlineFull: deadlineFull,
    maxScore: maxScore,
    allowLate: allowLate,
    submitted: 0,
    total: 28,
    graded: 0,
    avgScore: null,
    urgent: false,
  };

  window.TeacherData.assignments.push(assignment);
  persistAssignments();
  window.location.href = "index.html";
}

// ── Delete assignment ──
function deleteAssignment(id) {
  const a = window.TeacherData.assignments.find(function(x) { return x.id === id; });
  if (!a) return;
  showConfirm('Delete "' + a.title + '"? This cannot be undone.', function() {
    window.TeacherData.assignments = window.TeacherData.assignments.filter(function(x) { return x.id !== id; });
    persistAssignments();
    renderAssignments();
  });
}

// ── Show/hide workspace ──
function renderCreateWorkspace(type) {
  const container = ensureCreateWorkspace();
  container.innerHTML = type === "file" ? renderFileAssignmentForm() : renderQuizAssignmentForm();
  container.hidden = false;
  assignmentToolbar.hidden = true;
  assignmentPanel.hidden = true;
  if (emptyState) emptyState.hidden = true;
}

function showAssignmentList() {
  if (createWorkspace) createWorkspace.hidden = true;
  assignmentToolbar.hidden = false;
  assignmentPanel.hidden = false;
  renderAssignments();
}

function applyCreateModeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const createType = params.get("create");
  if (createType === "file" || createType === "quiz") {
    renderCreateWorkspace(createType);
  } else {
    showAssignmentList();
  }
}

// ── Event delegation ──
content.addEventListener("click", function(event) {
  var btn = event.target.closest("[data-action]");
  if (!btn) return;

  var action = btn.dataset.action;

  // Cancel
  if (action === "cancel") {
    window.location.href = "index.html";
    return;
  }

  // Save
  if (action === "save-file") { saveFileAssignment(); return; }
  if (action === "save-quiz") { saveQuizAssignment(); return; }

  // Delete
  if (action === "delete") { deleteAssignment(btn.dataset.id); return; }

  // View submissions
  if (action === "submissions") {
    var a = window.TeacherData.assignments.find(function(x) { return x.id === btn.dataset.id; });
    if (a) window.location.href = "../submissions/index.html?assignment=" + encodeURIComponent(a.title);
    return;
  }

  // Quiz: add question
  if (action === "add-question") {
    var blocks = document.querySelectorAll(".question-block");
    addQuestionBlock(blocks.length);
    return;
  }

  // Quiz: remove question
  if (action === "remove-question") {
    var qidx = parseInt(btn.dataset.qidx, 10);
    var block = document.querySelector('.question-block[data-qidx="' + qidx + '"]');
    if (block) {
      block.remove();
      // re-number
      var remaining = document.querySelectorAll(".question-block");
      remaining.forEach(function(b, i) {
        b.dataset.qidx = i;
        b.querySelector("h3").textContent = "Question " + (i + 1);
        var radios = b.querySelectorAll(".q-correct");
        radios.forEach(function(r) { r.name = "q-correct-" + i; });
        var addOptBtn = b.querySelector('[data-action="add-option"]');
        if (addOptBtn) addOptBtn.dataset.qidx = i;
        var rmBtn = b.querySelector('[data-action="remove-question"]');
        if (rmBtn) rmBtn.dataset.qidx = i;
      });
    }
    return;
  }

  // Quiz: add option
  if (action === "add-option") {
    addOptionToQuestion(btn.dataset.qidx);
    return;
  }

  // Quiz: remove option
  if (action === "remove-option") {
    var optItem = btn.closest(".option-item");
    if (optItem) {
      var optList = optItem.closest(".option-list");
      optItem.remove();
      reletterOptions(optList);
    }
    return;
  }
});

// ── Late toggle handling ──
content.addEventListener("change", function(event) {
  var cb = event.target.closest(".late-checkbox");
  if (!cb) return;
  var id = cb.dataset.id;
  var a = window.TeacherData.assignments.find(function(x) { return x.id === id; });
  if (a) {
    a.allowLate = cb.checked;
    persistAssignments();
  }
});

// ── File upload handling ──
content.addEventListener("change", function(event) {
  var input = event.target.closest("#fa-file-input");
  if (!input) return;
  for (var i = 0; i < input.files.length; i++) {
    var f = input.files[i];
    var sizeStr = (f.size / 1024 / 1024).toFixed(1) + " MB";
    if (f.size < 1024 * 1024) sizeStr = Math.round(f.size / 1024) + " KB";
    uploadedFiles.push({ name: f.name, size: sizeStr });
  }
  renderFileList();
  input.value = "";
});

content.addEventListener("click", function(event) {
  var uploadBtn = event.target.closest("#fa-upload-btn");
  if (uploadBtn) {
    var input = document.querySelector("#fa-file-input");
    if (input) input.click();
    return;
  }

  var removeBtn = event.target.closest(".file-chip-remove");
  if (removeBtn) {
    var idx = parseInt(removeBtn.dataset.idx, 10);
    uploadedFiles.splice(idx, 1);
    renderFileList();
    return;
  }
});

function renderFileList() {
  var list = document.querySelector("#fa-file-list");
  if (!list) return;
  if (uploadedFiles.length === 0) { list.innerHTML = ""; return; }
  list.innerHTML = uploadedFiles.map(function(f, i) {
    return '<span class="file-chip"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>' + f.name + ' <small>' + f.size + '</small><button class="file-chip-remove" data-idx="' + i + '" type="button">&times;</button></span>';
  }).join("");
}

// ── Init ──
// Use localStorage if it has data; otherwise fall back to data.js defaults
(function init() {
  var stored = localStorage.getItem("techroom_assignments");
  if (stored) {
    try {
      var parsed = JSON.parse(stored);
      if (parsed.length > 0) {
        window.TeacherData.assignments = parsed;
        return;
      }
    } catch (_) {}
  }
  // If localStorage is missing or empty, keep data.js assignments as-is
})();

createAssignmentButton.addEventListener("click", showCreateModal);
applyCreateModeFromUrl();
