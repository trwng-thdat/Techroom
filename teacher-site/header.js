(function () {
  const container = document.getElementById("header-container");
  if (!container) return;

  const backHref = container.dataset.backHref || "../my-classes/index.html";

  container.innerHTML = `
    <header class="workspace-topbar">
      <a class="back-link" href="${backHref}" aria-label="Back to classes">
        <svg viewBox="0 0 24 24"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
      </a>

      <div class="top-actions" aria-label="Teacher shortcuts">
        <button class="icon-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>
        <button class="icon-button" type="button" aria-label="Settings">
          <svg viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 6.5h-4L10.6 9a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L6.5 14a8 8 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.2-1.5Z" />
          </svg>
        </button>
        <button class="profile-chip" type="button" aria-label="Teacher profile">
          <span>
            <strong>N. Minh Khoa</strong>
            <small>STUDENT ID: 0847</small>
          </span>
          <span class="profile-avatar">K</span>
        </button>
      </div>
    </header>
  `;
})();
