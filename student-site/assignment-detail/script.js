'use strict';

const params = new URLSearchParams(location.search);
const classCode = params.get('code');
const assignmentId = params.get('assignmentId');

const classData = window.StudentData.classes.find((item) => item.code === classCode);
const ASSIGNMENT_OVERRIDE_KEY = 'studentAssignmentOverrides';

if (!classData || !assignmentId) {
  window.location.href = '../index.html';
}

let assignment = classData.assignments.find((item) => item.id === assignmentId);

if (!assignment) {
  window.location.href = `../assignments/index.html?code=${encodeURIComponent(classCode)}`;
}

let pendingFiles = [];
let activeSubmitMode = 'upload';
let submitCardOriginalHTML = '';

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => { toast.remove(); }, 2600);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readOverrides() {
  try {
    const raw = localStorage.getItem(ASSIGNMENT_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_error) {
    return {};
  }
}

function writeOverrides(overrides) {
  localStorage.setItem(ASSIGNMENT_OVERRIDE_KEY, JSON.stringify(overrides));
}

function mergeAssignmentFromOverride() {
  const overrides = readOverrides();
  const override = overrides[assignment.id];
  if (override) {
    assignment = {
      ...assignment,
      ...override,
      submissionHistory: override.submissionHistory || assignment.submissionHistory || [],
    };
  }
}

// ── Update nav links ─────────────────────────────────────────────────────────
function updateHeaderLinks() {
  const backHref = `../assignments/index.html?code=${encodeURIComponent(classData.code)}`;
  const header = document.getElementById('header-container');
  header.dataset.backHref = backHref;

  const sidebar = document.getElementById('sidebar-container');
  sidebar.dataset.assignmentsHref = backHref;

  const backLink = document.querySelector('.back-link');
  if (backLink) backLink.setAttribute('href', backHref);

  const assignmentNavLink = Array.from(document.querySelectorAll('.main-nav .nav-link'))
    .find((link) => link.textContent.trim().toLowerCase().includes('assignments'));
  if (assignmentNavLink) assignmentNavLink.setAttribute('href', backHref);
}

// ════════════════════════════════════════════════════════════════════════════
//  GRADED VIEW
// ════════════════════════════════════════════════════════════════════════════

function renderGradedView() {
  document.getElementById('gradedView').hidden = false;

  // Title & subtitle
  document.getElementById('gradedTitle').textContent = assignment.title;
  const dueLabel = assignment.deadline !== 'Completed' ? `Due ${assignment.deadline}` : 'Completed';
  document.getElementById('gradedSubtitle').textContent =
    `${dueLabel} • ${classData.subject || classData.title}`;

  // Score
  const score = assignment.score || '0/100';
  const [numerator, denominator] = score.split('/');
  document.getElementById('gradeScoreBig').textContent = numerator.trim();
  document.getElementById('gradeScoreDenom').textContent = `/${(denominator || '100').trim()}`;

  const pct = denominator
    ? Math.round((parseInt(numerator, 10) / parseInt(denominator, 10)) * 100)
    : 0;
  document.getElementById('gradeBarFill').style.width = `${pct}%`;

  // Instructor info
  const teacher = classData.teacher;
  const avatarEl = document.getElementById('feedbackAvatar');
  avatarEl.textContent = teacher.avatar || 'T';
  avatarEl.style.background = teacher.color || '#e8d2bb';
  document.getElementById('feedbackName').textContent = teacher.name;
  document.getElementById('feedbackTime').textContent = 'Feedback provided';

  // Feedback quote — from latest submission note or a generic message
  const history = assignment.submissionHistory || [];
  const latestEntry = history[history.length - 1];
  const feedbackText = latestEntry && latestEntry.feedback
    ? latestEntry.feedback
    : `"Great work on this assignment! Your submission demonstrated a solid understanding of the material. Keep up the strong performance."`;
  document.getElementById('feedbackQuote').textContent = feedbackText;

  // Assignment info card
  document.getElementById('gradedInstructions').textContent =
    assignment.instructions || 'No instructions provided.';

  // Reference files
  const refContainer = document.getElementById('gradedReferenceFiles');
  const refFiles = assignment.referenceFiles || [];
  if (refFiles.length) {
    refContainer.innerHTML = refFiles.map((file) => `
      <div class="graded-ref-item">
        <span class="graded-ref-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        </span>
        <div class="graded-ref-meta">
          <strong>${file.name}</strong>
          <small>${file.sizeLabel} • ${file.category || 'Document'}</small>
        </div>
      </div>`).join('');
  } else {
    refContainer.innerHTML = '<p class="empty">No reference files.</p>';
  }

  // Submission files
  const subContainer = document.getElementById('gradedSubmissionFiles');
  const submittedFiles = latestEntry && latestEntry.files ? latestEntry.files : [];
  if (submittedFiles.length) {
    subContainer.innerHTML = submittedFiles.map((file) => `
      <div class="graded-submission-item">
        <span class="graded-sub-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>
        </span>
        <div class="graded-sub-meta">
          <strong>${file.name}</strong>
          <small>Submitted ${latestEntry.submittedAt}</small>
        </div>
        <button class="graded-view-file-btn" type="button" data-name="${file.name}">View file</button>
      </div>`).join('');

    subContainer.querySelectorAll('.graded-view-file-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        showToast(`File preview for "${btn.dataset.name}" — placeholder`);
      });
    });
  } else {
    subContainer.innerHTML = '<p class="empty">No submitted files found.</p>';
  }

  // Right sidebar — submission status dates
  const submittedOn = latestEntry
    ? latestEntry.submittedAt.split(' ').slice(0, 3).join(' ')
    : '—';
  document.getElementById('statusSubmittedOn').textContent = submittedOn;

  // Use deadlineDate as graded date approximation
  const gradedOn = assignment.deadlineDate
    ? new Date(new Date(assignment.deadlineDate).getTime() + 2 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  document.getElementById('statusGradedOn').textContent = gradedOn;
  document.getElementById('statusAttempt').textContent =
    `${history.length || 1} of ${history.length || 1}`;
}

// ════════════════════════════════════════════════════════════════════════════
//  STANDARD VIEW (not-submitted / submitted)
// ════════════════════════════════════════════════════════════════════════════

function renderHeader() {
  document.getElementById('breadcrumbs').textContent =
    `My Classes > ${classData.title} > Assignments > ${assignment.title}`;
  document.getElementById('assignmentTitle').textContent = assignment.title;
  document.getElementById('assignmentInstructor').textContent =
    assignment.instructor || classData.teacher.name;
  document.getElementById('assignmentPostedAt').textContent =
    `Posted at ${assignment.postedAt || 'N/A'}`;
  document.getElementById('deadlineText').textContent = `Deadline: ${assignment.deadline}`;
  document.getElementById('remainingText').textContent =
    assignment.badge ||
    (assignment.status === 'graded' ? assignment.score || 'Graded' : assignment.statusLabel);
  document.getElementById('assignmentInstructions').textContent =
    assignment.instructions || 'No instructions yet.';
}

function renderReferenceFiles() {
  const referenceFileList = document.getElementById('referenceFileList');
  const files = assignment.referenceFiles || [];
  if (!files.length) {
    referenceFileList.innerHTML = '<p class="empty">No reference files.</p>';
    return;
  }
  referenceFileList.innerHTML = files.map((file) => `
    <article class="resource-item">
      <div>
        <strong>${file.name}</strong>
        <small>${file.sizeLabel} - ${file.updatedLabel}</small>
      </div>
      <button type="button" class="resource-action" data-name="${file.name}">Download</button>
    </article>`).join('');

  referenceFileList.querySelectorAll('.resource-action').forEach((button) => {
    button.addEventListener('click', () => {
      showToast(`Download placeholder for ${button.dataset.name}`);
    });
  });
}

function renderCourseContext() {
  document.getElementById('courseName').textContent = `${classData.title} (${classData.code})`;
  document.getElementById('courseTeacher').textContent = classData.teacher.name;
  document.getElementById('nextSession').textContent =
    classData.upcomingSessions && classData.upcomingSessions.length
      ? `${classData.upcomingSessions[0].date}, ${classData.upcomingSessions[0].time}`
      : 'No upcoming session';
}

function renderStatusCard() {
  document.getElementById('statusLabel').textContent = assignment.statusLabel;
  document.getElementById('statusTimer').textContent =
    assignment.badge || 'Submission window active';

  const checklist = [
    `Review material: ${assignment.referenceFiles && assignment.referenceFiles.length ? 'done' : 'optional'}`,
    `Upload files: ${(assignment.submissionHistory || []).length ? 'done' : 'pending'}`,
    `Status: ${assignment.statusLabel}`,
  ];
  document.getElementById('statusChecklist').innerHTML = checklist
    .map((item) => `<li>${item}</li>`)
    .join('');
}

function renderSelectedFiles() {
  const selectedFiles = document.getElementById('selectedFiles');
  if (!pendingFiles.length) {
    selectedFiles.innerHTML = '<p class="empty">No files selected.</p>';
    return;
  }
  selectedFiles.innerHTML = pendingFiles.map((file, index) => `
    <article class="selected-file-item">
      <div>
        <strong>${file.name}</strong>
        <small>${file.sizeLabel}</small>
      </div>
      <button type="button" data-index="${index}" class="remove-file">Remove</button>
    </article>`).join('');

  selectedFiles.querySelectorAll('.remove-file').forEach((button) => {
    button.addEventListener('click', () => {
      const removeIndex = Number(button.dataset.index);
      pendingFiles = pendingFiles.filter((_item, index) => index !== removeIndex);
      renderSelectedFiles();
    });
  });
}

function renderHistory() {
  const historyEl = document.getElementById('submissionHistory');
  const history = assignment.submissionHistory || [];
  if (!history.length) {
    historyEl.innerHTML = '<p class="empty">No submission history yet.</p>';
    return;
  }
  historyEl.innerHTML = history.slice().reverse().map((entry) => {
    const fileLines = (entry.files || [])
      .map((file) => `<li>${file.name} (${file.sizeLabel})</li>`)
      .join('');
    return `
      <article class="history-item">
        <strong>${entry.submittedAt}</strong>
        <p>${entry.note || 'Submitted'}</p>
        <ul>${fileLines}</ul>
      </article>`;
  }).join('');
}

function saveSubmission(files, textResponse) {
  const submissionEntry = {
    id: `${assignment.id}-SUB-${Date.now()}`,
    submittedAt: new Date().toLocaleString(),
    note: textResponse ? 'Submitted text response and files' : 'Submitted through upload',
    files,
    textResponse: textResponse || '',
  };

  const updatedHistory = [...(assignment.submissionHistory || []), submissionEntry];

  const overrides = readOverrides();
  overrides[assignment.id] = {
    status: assignment.status === 'graded' ? 'graded' : 'submitted',
    statusLabel: assignment.status === 'graded' ? 'Graded' : 'Submitted',
    badge: assignment.status === 'graded' ? assignment.badge : 'SUBMITTED',
    attachments: files.length,
    submissionHistory: updatedHistory,
  };
  writeOverrides(overrides);

  assignment.submissionHistory = updatedHistory;
  if (assignment.status !== 'graded') {
    assignment.status = 'submitted';
    assignment.statusLabel = 'Submitted';
    assignment.badge = 'SUBMITTED';
  }
  assignment.attachments = files.length;
  mergeAssignmentFromOverride();
}

function initSubmitTabs() {
  const uploadMode = document.getElementById('uploadMode');
  const textMode = document.getElementById('textMode');
  document.querySelectorAll('.submit-tab').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.submit-tab').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      activeSubmitMode = button.dataset.mode;
      uploadMode.classList.toggle('active', activeSubmitMode === 'upload');
      textMode.classList.toggle('active', activeSubmitMode === 'text');
    });
  });
}

function initUploadInput() {
  const submissionFileInput = document.getElementById('submissionFileInput');
  submissionFileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      pendingFiles.push({
        name: file.name,
        sizeLabel: formatSize(file.size),
        type: file.type || 'application/octet-stream',
      });
    });
    renderSelectedFiles();
    submissionFileInput.value = '';
  });
}

function deleteAndResubmit() {
  const overrides = readOverrides();
  delete overrides[assignment.id];
  writeOverrides(overrides);

  assignment.status = 'not-submitted';
  assignment.statusLabel = 'Not Submitted';
  assignment.badge = '';
  assignment.attachments = 0;
  assignment.submissionHistory = [];
  pendingFiles = [];

  updateSubmitSection();
  renderHistory();
  renderStatusCard();
  showToast('Submission deleted. You can now resubmit.');
}

function updateSubmitSection() {
  const submitCard = document.querySelector('.submit-card');

  // Remove any old sidebar delete button
  const oldBtn = document.getElementById('sidebarDeleteBtn');
  if (oldBtn) oldBtn.remove();

  if (assignment.status === 'graded') {
    submitCard.style.display = 'none';
    return;
  }
  if (assignment.status === 'submitted') {
    submitCard.style.display = 'none';
    const statusCard = document.querySelector('.side-card.status-card');
    if (statusCard && !document.getElementById('sidebarDeleteBtn')) {
      const btn = document.createElement('button');
      btn.id = 'sidebarDeleteBtn';
      btn.className = 'confirm-submit danger';
      btn.textContent = 'Delete Submission & Resubmit';
      btn.addEventListener('click', deleteAndResubmit);
      statusCard.appendChild(btn);
    }
    return;
  }
  submitCard.style.display = '';
  submitCard.innerHTML = submitCardOriginalHTML;
  initSubmitTabs();
  initUploadInput();
  initSubmitAction();
  renderSelectedFiles();
}

function initSubmitAction() {
  const confirmSubmit = document.getElementById('confirmSubmit');
  confirmSubmit.addEventListener('click', () => {
    const textResponse = document.getElementById('textResponse').value.trim();
    if (activeSubmitMode === 'upload' && !pendingFiles.length) {
      showToast('Please select at least one file before submitting.');
      return;
    }
    if (activeSubmitMode === 'text' && !textResponse && !pendingFiles.length) {
      showToast('Please enter a text response or attach a file.');
      return;
    }
    const filesToSubmit = pendingFiles.length
      ? pendingFiles
      : [{ name: 'text-response.txt', sizeLabel: `${textResponse.length} chars`, type: 'text/plain' }];

    saveSubmission(filesToSubmit, textResponse);
    pendingFiles = [];
    document.getElementById('textResponse').value = '';

    updateSubmitSection();
    renderSelectedFiles();
    renderHistory();
    renderStatusCard();
    showToast('Submission metadata was added to the assignment data successfully.');
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  mergeAssignmentFromOverride();
  updateHeaderLinks();

  if (assignment.status === 'graded') {
    document.getElementById('standardView').hidden = true;
    renderGradedView();
  } else {
    document.getElementById('gradedView').hidden = true;
    document.getElementById('standardView').hidden = false;
    submitCardOriginalHTML = document.querySelector('.submit-card').innerHTML;
    renderHeader();
    renderReferenceFiles();
    renderCourseContext();
    renderStatusCard();
    renderSelectedFiles();
    renderHistory();
    updateSubmitSection();
  }
});
