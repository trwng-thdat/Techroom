'use strict';

// ── Resolve class from URL param ──────────────────────────────────────────────
const urlParams = new URLSearchParams(location.search);
const classCode = urlParams.get('code');
const classData = window.StudentData.classes.find((c) => c.code === classCode)
  || window.StudentData.classes[0]; // fallback to first class

const materials = classData.materials || [];
let selectedId = materials.length > 0 ? materials[0].id : null;

// ── File-type icon SVGs ───────────────────────────────────────────────────────
const FILE_ICONS = {
  pdf: `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6"/><path d="M16 12h-2v6"/><path d="M16 15h-2"/></svg>`,
  pptx: `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  docx: `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>`,
};

const PREVIEW_ICONS = {
  pdf: `<svg viewBox="0 0 80 80" aria-hidden="true" style="width:64px;height:64px;fill:none;stroke:#c0ccc8;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"><path d="M56 8H24a4 4 0 0 0-4 4v56a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V24z"/><path d="M56 8v16h16"/><path d="M33 48h5a5 5 0 0 0 0-10h-5v20"/><path d="M55 38h-7v20"/><path d="M55 49h-7"/></svg>`,
  pptx: `<svg viewBox="0 0 80 80" aria-hidden="true" style="width:64px;height:64px;fill:none;stroke:#c0ccc8;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"><rect x="8" y="14" width="64" height="44" rx="4"/><path d="M28 68h24M40 58v10"/></svg>`,
  docx: `<svg viewBox="0 0 80 80" aria-hidden="true" style="width:64px;height:64px;fill:none;stroke:#c0ccc8;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"><path d="M56 8H24a4 4 0 0 0-4 4v56a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V24z"/><path d="M56 8v16h16"/><path d="M52 40H28M52 52H28M36 28H28"/></svg>`,
};

// ── Render the file list table ────────────────────────────────────────────────
function renderMaterialsList() {
  const tbody = document.getElementById('materialsList');
  if (!materials.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;padding:32px;color:var(--muted,#63706c);font-size:13px;">
          No materials available for this class.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = materials.map((mat) => {
    const isSelected = mat.id === selectedId;
    const icon = FILE_ICONS[mat.type] || FILE_ICONS.docx;
    return `
      <tr class="${isSelected ? 'selected' : ''}" data-id="${mat.id}" tabindex="0" role="button" aria-pressed="${isSelected}">
        <td>
          <div class="file-name-cell">
            <span class="file-icon ${mat.type}">${icon}</span>
            <div class="file-name-info">
              <span class="file-title">${mat.name}</span>
              <span class="file-type-label">${mat.typeLabel}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="file-author">${mat.author}</div>
          <div class="file-date">${mat.date}</div>
        </td>
        <td class="file-size">${mat.size}</td>
      </tr>`;
  }).join('');

  // Attach click listeners
  tbody.querySelectorAll('tr[data-id]').forEach((row) => {
    row.addEventListener('click', () => selectMaterial(row.dataset.id));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectMaterial(row.dataset.id);
      }
    });
  });
}

// ── Update preview panel ──────────────────────────────────────────────────────
function renderPreview(matId) {
  const mat = materials.find((m) => m.id === matId);
  const previewBody = document.getElementById('previewBody');
  const previewMeta = document.getElementById('previewMeta');
  const previewActions = document.getElementById('previewActions');

  if (!mat) {
    previewBody.innerHTML = `
      <div class="preview-empty-state">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="preview-empty-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        <p>Select a file to preview</p>
      </div>`;
    previewMeta.hidden = true;
    previewActions.hidden = true;
    return;
  }

  const iconSvg = PREVIEW_ICONS[mat.type] || PREVIEW_ICONS.docx;

  previewBody.innerHTML = `<div class="preview-placeholder">${iconSvg}</div>`;

  // Meta info
  document.getElementById('previewFilename').textContent = mat.name;

  const stats = [];
  if (mat.pages) {
    stats.push(`<span class="preview-stat"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>${mat.pages} Pages</span>`);
  }
  if (mat.slides) {
    stats.push(`<span class="preview-stat"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>${mat.slides} Slides</span>`);
  }
  stats.push(`<span class="preview-stat"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>${mat.size}</span>`);

  document.getElementById('previewStats').innerHTML = stats.join('');

  previewMeta.hidden = false;
  previewActions.hidden = false;

  // Wire download/fullscreen
  document.getElementById('btnDownload').onclick = () => showToast(`Downloading "${mat.name}"…`);
  document.getElementById('btnFullscreen').onclick = () => showToast(`Full-screen view coming soon.`);
}

// ── Select a material row ─────────────────────────────────────────────────────
function selectMaterial(id) {
  selectedId = id;
  // Update row highlight
  document.querySelectorAll('#materialsList tr[data-id]').forEach((row) => {
    const active = row.dataset.id === id;
    row.classList.toggle('selected', active);
    row.setAttribute('aria-pressed', String(active));
  });
  renderPreview(id);
}

// ── Toast helper ──────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
}

// ── Close preview ─────────────────────────────────────────────────────────────
document.getElementById('previewCloseBtn').addEventListener('click', () => {
  selectedId = null;
  document.querySelectorAll('#materialsList tr[data-id]').forEach((row) => {
    row.classList.remove('selected');
    row.setAttribute('aria-pressed', 'false');
  });
  renderPreview(null);
});

// ── Update page title & back link with class info ─────────────────────────────
function applyClassContext() {
  document.title = `Materials — ${classData.title} | Techroom`;
  // Update header data-back-href to point to class detail
  const hdr = document.getElementById('header-container');
  if (hdr && classCode) hdr.dataset.backHref = `../class-detail/index.html?code=${classCode}`;
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyClassContext();
  renderMaterialsList();
  if (selectedId) renderPreview(selectedId);
});
