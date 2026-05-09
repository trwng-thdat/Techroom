(function () {
  const container = document.getElementById("owner-sidebar");
  if (!container) return;

  const active = container.dataset.active || "";
  const depth = container.dataset.depth || ".";

  const links = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: `${depth}/dashboard/index.html`,
      icon: '<path d="M4 13h6V4H4v9Z" /><path d="M14 20h6V4h-6v16Z" /><path d="M4 20h6v-3H4v3Z" />',
    },
    {
      id: "accounts",
      label: "Account Management",
      href: `${depth}/accounts/index.html`,
      icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />',
    },
    {
      id: "courses",
      label: "Courses Management",
      href: `${depth}/classes/index.html`,
      icon: '<path d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Z" /><path d="M10 8h4M10 12h4" />',
    },
  ];

  container.innerHTML = `
    <aside class="sidebar" aria-label="Owner navigation">
      <a class="brand" href="${depth}/index.html" aria-label="Techroom owner home">
        <span class="brand-mark">T</span>
        <span><strong>Techroom</strong><small>Admin Portal</small></span>
      </a>
      <nav class="main-nav">
        ${links
          .map(
            (link) => `
              <a class="nav-link${active === link.id ? " active" : ""}" href="${link.href}"${active === link.id ? ' aria-current="page"' : ""}>
                <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${link.icon}</svg></span>
                ${link.label}
              </a>
            `
          )
          .join("")}
      </nav>
      <nav class="utility-nav" aria-label="Owner account navigation">
        <button class="nav-link nav-button" type="button" data-toast="Help center content is demo-only.">
          <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.2-1.9 1.7-2.5 2.7" /><path d="M12 17h.01" /><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" /></svg></span>
          Help Center
        </button>
        <button class="nav-link nav-button" type="button" data-toast="Settings will be connected in the production owner portal.">
          <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 6.5h-4L10.6 9a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L6.5 14a8 8 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.2-1.5Z" /></svg></span>
          Settings
        </button>
        <button class="nav-link nav-button logout-button" type="button" data-logout data-logout-href="${depth}/index.html">
          <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M10 17 15 12 10 7" /><path d="M15 12H3" /><path d="M21 3v18" /></svg></span>
          Logout
        </button>
      </nav>
    </aside>
  `;
})();
