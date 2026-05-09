(function () {
  const iconMap = {
    classes:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z" /><path d="M4 11.5 12 15l8-3.5" /><path d="M4 15.5 12 19l8-3.5" /></svg>',
    assignments:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M12 8h4" /><path d="M10 12h6" /><path d="M10 16h6" /></svg>',
    absence:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v4l3 2" /><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /><path d="M8 8 16 16" /></svg>',
    schedule:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3M17 3v3M4 9h16" /><path d="M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M9 13h6" /></svg>',
    profile:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 1 0-16 0" /><path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>',
    settings:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="M19 12a7.1 7.1 0 0 0-.1-1l2-1.5-2-3.5-2.3.8a7.4 7.4 0 0 0-1.7-1L14.5 3h-5L9 5.8c-.6.2-1.2.5-1.7 1L5 6l-2 3.5 2 1.5A7.1 7.1 0 0 0 5 12a7.1 7.1 0 0 0 .1 1l-2 1.5L5 18l2.3-.8c.5.4 1.1.7 1.7 1L9.5 21h5l.2-2.8c.6-.2 1.2-.5 1.7-1L19 18l2-3.5-2-1.5c0-.3.1-.6.1-1Z" /></svg>',
  };

  function navLink({ href, label, keyName, active }) {
    return `
      <a class="nav-link${active ? " active" : ""}" href="${href}">
        <span class="nav-icon">${iconMap[keyName]}</span>
        <span>${label}</span>
      </a>
    `;
  }

  document.querySelectorAll("#sidebar-container").forEach((container) => {
    const active = container.dataset.active || "my-classes";
    const homeHref = container.dataset.homeHref || "index.html";
    const classesHref = container.dataset.classesHref || "index.html";
    const assignmentsHref = container.dataset.assignmentsHref || "#";
    const absenceHref = container.dataset.absenceHref || "#";
    const scheduleHref = container.dataset.scheduleHref || "#";
    const profileHref = container.dataset.profileHref || "#";
    const settingsHref = container.dataset.settingsHref || "#";

    container.innerHTML = `
      <aside class="sidebar">
        <a class="brand" href="${homeHref}" aria-label="Techroom student portal home">
          <span class="brand-mark">T</span>
          <span>
            <strong>Techroom</strong>
            <small>STUDENT PORTAL</small>
          </span>
        </a>

        <nav class="main-nav" aria-label="Student navigation">
          ${navLink({ href: classesHref, label: "My Classes", keyName: "classes", active: active === "my-classes" })}
          ${navLink({ href: assignmentsHref, label: "Assignments", keyName: "assignments", active: active === "assignments" })}
          ${navLink({ href: absenceHref, label: "Absence Requests", keyName: "absence", active: active === "absence-requests" })}
          ${navLink({ href: scheduleHref, label: "Schedule", keyName: "schedule", active: active === "schedule" })}
        </nav>

        <nav class="utility-nav" aria-label="Account links">
          ${navLink({ href: profileHref, label: "Profile", keyName: "profile", active: active === "profile" })}
          ${navLink({ href: settingsHref, label: "Settings", keyName: "settings", active: active === "settings" })}
        </nav>
      </aside>
    `;
  });
})();
