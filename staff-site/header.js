(function () {
  const container = document.getElementById("staff-header");
  if (!container) return;

  const search = container.dataset.search || "Search students, classes, or reports...";

  container.innerHTML = `
    <header class="staff-topbar">
      <nav class="staff-tabs" aria-label="Staff workspace tabs">
        <a href="#" data-toast="Staff workspace is demo-only.">Staff</a>
        <a class="active" href="#">Academic</a>
        <a href="#" data-toast="Management workspace is demo-only.">Management</a>
      </nav>
      <label class="top-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.3-4.3" /><path d="M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" /></svg>
        <input type="search" placeholder="${search}" />
      </label>
      <div class="top-icons">
        <button type="button" aria-label="Notifications" data-toast="No urgent alerts."><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg></button>
        <button type="button" aria-label="Help" data-toast="Help center is demo-only."><svg viewBox="0 0 24 24"><path d="M12 17h.01" /><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.2-1.9 1.7-2.5 2.7" /><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" /></svg></button>
        <button class="staff-profile-chip" type="button" data-toast="Staff profile is demo-only.">
          <span><strong>Staff Profile</strong><small>Academic Admin</small></span>
          <span class="staff-avatar">SP</span>
        </button>
      </div>
    </header>
  `;
})();
