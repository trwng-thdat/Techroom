(function () {
  const iconMarkup = {
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a6 6 0 0 0-6 6c0 7-3 8-3 8h18s-3-1-3-8a6 6 0 0 0-6-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>',
  };

  document.querySelectorAll("#header-container").forEach((container) => {
    const backHref = container.dataset.backHref || "#page-top";
    const profileName = container.dataset.profileName || "Student";
    const profileRole = container.dataset.profileRole || "Portal";
    const avatar = container.dataset.avatar || "S";
    const avatarColor = container.dataset.avatarColor || "#14b99e";

    const profileHref = container.dataset.profileHref || "../profile/index.html";

    container.innerHTML = `
      <header class="workspace-topbar">
        <a class="back-link" href="${backHref}" aria-label="Back to previous section">
          ${iconMarkup.back}
        </a>

        <div class="top-actions">
          <button class="icon-button" type="button" aria-label="Notifications">
            ${iconMarkup.bell}
          </button>

          <a class="profile-chip" href="${profileHref}" aria-label="${profileName} profile">
            <span class="profile-avatar" style="background:${avatarColor}">${avatar}</span>
            <span>
              <strong>${profileName}</strong>
              <small>${profileRole}</small>
            </span>
          </a>
        </div>
      </header>
    `;
  });
})();
