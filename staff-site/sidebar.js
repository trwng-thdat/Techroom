(function () {
  const container = document.getElementById("staff-sidebar");
  if (!container) return;

  const active = container.dataset.active || "";
  const depth = container.dataset.depth || ".";
  const links = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: `${depth}/dashboard/index.html`,
      icon: '<path d="M4 4h6v6H4z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6H4z" /><path d="M14 14h6v6h-6z" />',
    },
    {
      id: "classes",
      label: "Classes",
      href: `${depth}/classes/index.html`,
      icon: '<path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" /><path d="M4 12l8 4.5L20 12" /><path d="M7 14v4c2 2 8 2 10 0v-4" />',
    },
    {
      id: "timetable",
      label: "Timetable",
      href: `${depth}/timetable/index.html`,
      icon: '<path d="M7 3v3" /><path d="M17 3v3" /><path d="M4 9h16" /><path d="M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" />',
    },
    {
      id: "students",
      label: "Students",
      href: `${depth}/students/index.html`,
      icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" />',
    },
    {
      id: "teachers",
      label: "Teachers",
      href: `${depth}/teachers/index.html`,
      icon: '<path d="M6 3h12v18H6z" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h3" />',
    },
    {
      id: "notifications",
      label: "Notifications",
      href: `${depth}/notifications/index.html`,
      icon: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />',
    },
    {
      id: "rooms",
      label: "Rooms",
      href: `${depth}/rooms/index.html`,
      icon: '<path d="M4 21h16" /><path d="M6 21V4h10v17" /><path d="M16 9h2v12" /><path d="M10 12h.01" />',
    },
    {
      id: "makeup",
      label: "Makeup Sessions",
      href: `${depth}/makeup/index.html`,
      icon: '<path d="M7 3v3" /><path d="M17 3v3" /><path d="M4 9h16" /><path d="M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" /><path d="M12 13v4" /><path d="M10 15h4" />',
    },
  ];

  container.innerHTML = `
    <aside class="staff-sidebar" aria-label="Staff navigation">
      <a class="staff-brand" href="${depth}/index.html" aria-label="Techroom staff home">
        <strong>Techroom</strong>
        <small>Academic Management</small>
      </a>
      <nav class="staff-main-nav">
        ${links
          .map(
            (link) => `
              <a class="staff-nav-link${active === link.id ? " active" : ""}" href="${link.href}"${active === link.id ? ' aria-current="page"' : ""}>
                <span><svg viewBox="0 0 24 24">${link.icon}</svg></span>
                ${link.label}
              </a>
            `
          )
          .join("")}
      </nav>
      <nav class="staff-utility-nav" aria-label="Staff account links">
        <button class="staff-nav-link nav-button" type="button" data-toast="Profile panel is demo-only.">
          <span><svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 1 0-16 0" /><path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg></span>
          Profile
        </button>
        <button class="staff-nav-link nav-button" type="button" data-toast="Settings are demo-only.">
          <span><svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 6.5h-4L10.6 9a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L6.5 14a8 8 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.2-1.5Z" /></svg></span>
          Settings
        </button>
        <button class="staff-nav-link nav-button logout-link" type="button" data-logout data-logout-href="${depth}/index.html">
          <span><svg viewBox="0 0 24 24"><path d="M10 17 15 12 10 7" /><path d="M15 12H3" /><path d="M21 3v18" /></svg></span>
          Logout
        </button>
      </nav>
    </aside>
  `;
})();
