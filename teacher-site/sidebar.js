(function () {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  const active = container.dataset.active || "";
  const homeHref = container.dataset.homeHref || "../index.html";
  const myClassHref = container.dataset.myClassHref || "index.html";
  const scheduleHref = container.dataset.scheduleHref || "#";

  container.innerHTML = `
    <aside class="sidebar" aria-label="Teacher navigation">
      <a class="brand" href="${homeHref}" aria-label="Techroom home">
        <span class="brand-mark">T</span>
        <span>Techroom</span>
      </a>

      <nav class="main-nav">
        <a class="nav-link${active === "my-class" ? " active" : ""}" href="${myClassHref}"${active === "my-class" ? ' aria-current="page"' : ""}>
          <span class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Z" />
              <path d="M10 8h4M10 12h4" />
            </svg>
          </span>
          My Class
        </a>
        <a class="nav-link${active === "schedule" ? " active" : ""}" href="${scheduleHref}"${active === "schedule" ? ' aria-current="page"' : ""}>
          <span class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
            </svg>
          </span>
          Schedule
        </a>
      </nav>

      <nav class="utility-nav" aria-label="Account navigation">
        <a class="nav-link" href="#">
          <span class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </span>
          Profile
        </a>
        <a class="nav-link" href="#">
          <span class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 6.5h-4L10.6 9a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L6.5 14a8 8 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.2-1.5Z" />
            </svg>
          </span>
          Settings
        </a>
      </nav>
    </aside>
  `;
})();
