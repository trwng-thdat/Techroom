(function () {
  const container = document.getElementById("owner-header");
  if (!container) return;

  container.innerHTML = `
    <header class="workspace-topbar">
      <div>
        <p class="top-kicker">Admin Workspace</p>
        <strong>Techroom Operations</strong>
      </div>
      <div class="top-actions">
        <button class="profile-chip" type="button" data-toast="Owner profile is demo-only.">
          <span>
            <strong>Mai Anh Le</strong>
            <small>ADMIN ID: 0001</small>
          </span>
          <span class="profile-avatar">M</span>
        </button>
      </div>
    </header>
  `;
})();
