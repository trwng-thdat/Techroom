'use strict';

const classes = window.StudentData.classes || [];
const absenceRequests = window.StudentData.absenceRequests || [];
const policy = (window.StudentData.schedule && window.StudentData.schedule.absencePolicy) || { maxPerClass: 3, usedThisTerm: 1 };

// ── Populate class dropdown ───────────────────────────────────────────────────
function populateClassSelect() {
  const select = document.getElementById('classSelect');
  classes.forEach((cls) => {
    const option = document.createElement('option');
    option.value = cls.code;
    option.textContent = `${cls.title} — ${cls.level || cls.grade || ''} · ${cls.day || ''}`;
    select.appendChild(option);
  });
}

// ── Render recent absence requests ────────────────────────────────────────────
function renderRecentRequests() {
  const list = document.getElementById('recentRequestsList');
  const recent = absenceRequests.slice(0, 4);

  if (!recent.length) {
    list.innerHTML = '<li style="font-size:12px;color:var(--muted);padding:10px 0">No requests yet.</li>';
    return;
  }

  list.innerHTML = recent.map((req) => `
    <li class="request-item">
      <div class="request-item-info">
        <strong>${req.className}</strong>
        <small>${req.date}</small>
      </div>
      <span class="request-status-tag tag-${req.status}">${req.statusLabel}</span>
    </li>`).join('');
}

// ── Render absence policy ─────────────────────────────────────────────────────
function renderPolicy() {
  const { maxPerClass, usedThisTerm } = policy;
  const note = document.getElementById('policyNote');
  note.textContent = `You are allowed up to ${maxPerClass} absences per class. You have used ${usedThisTerm} of ${maxPerClass} this term.`;

  const dotsContainer = document.getElementById('usageDots');
  const dots = Array.from({ length: maxPerClass }, (_, i) => `
    <span class="usage-dot ${i < usedThisTerm ? 'used' : ''}" aria-label="${i < usedThisTerm ? 'used' : 'available'}"></span>`).join('');
  dotsContainer.innerHTML = dots;
}

// ── Character count for textarea ──────────────────────────────────────────────
function initCharCount() {
  const textarea = document.getElementById('absenceReason');
  const counter = document.getElementById('charCount');
  textarea.addEventListener('input', () => {
    counter.textContent = `${textarea.value.length} / 500`;
  });
}

// ── File dropzone ─────────────────────────────────────────────────────────────
function initDropzone() {
  const input = document.getElementById('absenceDoc');
  const label = document.getElementById('dropzoneLabel');
  const text = document.getElementById('dropzoneText');

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) {
      text.textContent = file.name;
      label.classList.add('has-file');
    } else {
      text.textContent = 'Attach file (e.g., medical certificate)';
      label.classList.remove('has-file');
    }
  });
}

// ── Validation helpers ────────────────────────────────────────────────────────
function showError(fieldGroupId, errorId, inputSelector) {
  const group = document.getElementById(fieldGroupId);
  const error = document.getElementById(errorId);
  const input = group.querySelector(inputSelector);
  if (error) error.hidden = false;
  if (input) input.classList.add('has-error');
}

function clearError(fieldGroupId, errorId, inputSelector) {
  const group = document.getElementById(fieldGroupId);
  const error = document.getElementById(errorId);
  const input = group && group.querySelector(inputSelector);
  if (error) error.hidden = true;
  if (input) input.classList.remove('has-error');
}

function validateForm() {
  let valid = true;
  const classVal = document.getElementById('classSelect').value;
  const dateVal = document.getElementById('absenceDate').value;
  const reasonVal = document.getElementById('absenceReason').value.trim();

  if (!classVal) {
    showError('classFieldGroup', 'classError', 'select');
    valid = false;
  } else {
    clearError('classFieldGroup', 'classError', 'select');
  }

  if (!dateVal) {
    showError('dateFieldGroup', 'dateError', 'input');
    valid = false;
  } else {
    clearError('dateFieldGroup', 'dateError', 'input');
  }

  if (!reasonVal) {
    showError('reasonFieldGroup', 'reasonError', 'textarea');
    valid = false;
  } else {
    clearError('reasonFieldGroup', 'reasonError', 'textarea');
  }

  return valid;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let _toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.hidden = false;
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
}

// ── Inline error clearing on change ──────────────────────────────────────────
function initInlineClear() {
  document.getElementById('classSelect').addEventListener('change', () => {
    clearError('classFieldGroup', 'classError', 'select');
  });
  document.getElementById('absenceDate').addEventListener('change', () => {
    clearError('dateFieldGroup', 'dateError', 'input');
  });
  document.getElementById('absenceReason').addEventListener('input', () => {
    clearError('reasonFieldGroup', 'reasonError', 'textarea');
  });
}

// ── Form submit ───────────────────────────────────────────────────────────────
function initForm() {
  document.getElementById('absenceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedOption = document.getElementById('classSelect').selectedOptions[0];
    const className = selectedOption ? selectedOption.textContent.split(' — ')[0] : '';
    const dateVal = document.getElementById('absenceDate').value;
    const dateLabel = dateVal ? new Date(dateVal + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

    // Add to top of recent list (demo)
    absenceRequests.unshift({
      id: `ABS-${Date.now()}`,
      className,
      date: dateLabel,
      reason: document.getElementById('absenceReason').value.trim(),
      status: 'pending',
      statusLabel: 'PENDING',
    });

    renderRecentRequests();
    document.getElementById('absenceForm').reset();
    document.getElementById('charCount').textContent = '0 / 500';
    document.getElementById('dropzoneLabel').classList.remove('has-file');
    document.getElementById('dropzoneText').textContent = 'Attach file (e.g., medical certificate)';

    showToast('✓ Absence request submitted successfully.');
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('absenceForm').reset();
    document.getElementById('charCount').textContent = '0 / 500';
    document.getElementById('dropzoneLabel').classList.remove('has-file');
    document.getElementById('dropzoneText').textContent = 'Attach file (e.g., medical certificate)';
    ['classFieldGroup', 'dateFieldGroup', 'reasonFieldGroup'].forEach((gid) => {
      const grp = document.getElementById(gid);
      if (grp) grp.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
    });
    ['classError', 'dateError', 'reasonError'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateClassSelect();
  renderRecentRequests();
  renderPolicy();
  initCharCount();
  initDropzone();
  initInlineClear();
  initForm();
});
