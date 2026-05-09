'use strict';

const profile = window.StudentData.profile;
const classes = window.StudentData.classes || [];

// ── Identity Card ─────────────────────────────────────────────────────────────
function renderIdentity() {
  // Avatar
  const avatarEl = document.getElementById('identityAvatar');
  avatarEl.textContent = profile.avatar || profile.name.slice(0, 2).toUpperCase();

  document.getElementById('identityName').textContent = profile.name;
  document.getElementById('identityStatus').textContent = profile.status || 'Active Student';
  document.getElementById('identityGrade').textContent = profile.grade || '';
  document.getElementById('identityYear').textContent = profile.academicYear || '';
  document.getElementById('identityId').textContent = profile.studentId || '';

  // Meta items — set text on the element's last text node or a wrapper
  setMetaText('identityLocation', profile.location || '');
  setMetaText('identityJoined', profile.joinedLabel || '');

  const activeCount = classes.filter((c) => c.status === 'Active').length;
  setMetaText('identityClassCount', activeCount + ' Active Class' + (activeCount !== 1 ? 'es' : ''));

  // Hide grade/year badges if empty
  if (!profile.grade) document.getElementById('identityGrade').hidden = true;
  if (!profile.academicYear) document.getElementById('identityYear').hidden = true;
}

function setMetaText(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  // Find or create the text span after the svg
  let span = el.querySelector('.meta-text');
  if (!span) {
    span = document.createElement('span');
    span.className = 'meta-text';
    el.appendChild(span);
  }
  span.textContent = text;
}

// ── Personal Information ──────────────────────────────────────────────────────
function renderPersonal() {
  const p = profile.personal || {};
  document.getElementById('pfFullName').textContent = p.fullName || profile.name || '—';
  document.getElementById('pfDob').textContent = p.dateOfBirth || '—';
  document.getElementById('pfPhone').textContent = p.phone || '—';
  document.getElementById('pfEmail').textContent = p.email || '—';
  document.getElementById('pfAddress').textContent = p.address || '—';
}

// ── Parent / Guardian ─────────────────────────────────────────────────────────
function renderGuardian() {
  const g = profile.guardian || {};
  document.getElementById('gdName').textContent = g.name || '—';
  document.getElementById('gdRelationship').textContent = g.relationship || '—';
  document.getElementById('gdPhone').textContent = g.phone || '—';
  document.getElementById('gdEmail').textContent = g.email || '—';
}

// ── My Classes ────────────────────────────────────────────────────────────────
function renderClasses() {
  const list = document.getElementById('profileClassList');

  if (!classes.length) {
    list.innerHTML = '<li style="font-size:12px;color:var(--muted)">No classes enrolled.</li>';
    return;
  }

  list.innerHTML = classes.map((cls) => {
    const isActive = cls.status === 'Active';
    const isCompleted = cls.status === 'Completed';

    // Derive a status tag label
    let tagClass = 'tag-upcoming';
    let tagLabel = 'UPCOMING';

    if (isCompleted) {
      tagClass = 'tag-completed';
      tagLabel = 'COMPLETED';
    } else if (isActive && cls.upcomingSessions && cls.upcomingSessions.length) {
      const firstSession = cls.upcomingSessions[0];
      if (firstSession.status === 'ongoing') {
        tagClass = 'tag-ongoing';
        tagLabel = 'IN SESSION';
      } else {
        tagClass = 'tag-upcoming';
        tagLabel = 'UPCOMING';
      }
    }

    const dotClass = isActive ? 'class-dot class-dot--active' : 'class-dot';
    const scheduleText = cls.day && cls.time ? `${cls.day} • ${cls.time}` : '';

    return `
      <li class="class-list-item">
        <span class="${dotClass}" aria-hidden="true"></span>
        <div class="class-list-info">
          <span class="class-list-name">${cls.title}</span>
          ${scheduleText ? `<span class="class-list-schedule">${scheduleText}</span>` : ''}
        </div>
        <span class="class-status-tag ${tagClass}">${tagLabel}</span>
      </li>`;
  }).join('');
}

// ── Toast helper ──────────────────────────────────────────────────────────────
let _toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.hidden = false;
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderIdentity();
  renderPersonal();
  renderGuardian();
  renderClasses();

});
