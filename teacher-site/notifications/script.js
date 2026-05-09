/* ============================================================
   notifications/script.js
   Reads: window.TeacherData.notifications
   Features:
     - Filter by type (all / unread / room-change / schedule / submission)
     - Mark individual item as read on click
     - "Mark all as read" button
     - Unread badge count in heading
     - Staggered entrance animation
   ============================================================ */

const { notifications } = window.TeacherData;

// Runtime read state (mirrors data; allows mutations without touching TeacherData)
const readState = {};
notifications.forEach((n) => { readState[n.id] = n.read; });

let activeFilter = "all";

// ── DOM refs ─────────────────────────────────────────────────
const notifList   = document.getElementById("notifList");
const emptyState  = document.getElementById("emptyState");
const unreadBadge = document.getElementById("unreadBadge");
const markAllBtn  = document.getElementById("markAllBtn");
const filterBtns  = document.querySelectorAll(".filter-btn");

// ── Icons per type ────────────────────────────────────────────
const TYPE_ICON = {
  "room-change": `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/></svg>`,
  "schedule":    `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`,
  "submission":  `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>`,
};

// ── Helpers ───────────────────────────────────────────────────
function unreadCount() {
  return notifications.filter((n) => !readState[n.id]).length;
}

function updateBadge() {
  const count = unreadCount();
  unreadBadge.textContent = count > 0 ? count : "";
}

function tagClass(type) {
  const map = {
    "room-change": "tag-room-change",
    "schedule":    "tag-schedule",
    "submission":  "tag-submission",
  };
  return map[type] || "tag-submission";
}

// ── Render ────────────────────────────────────────────────────
function render() {
  let list = notifications;

  if (activeFilter === "unread") {
    list = notifications.filter((n) => !readState[n.id]);
  } else if (activeFilter !== "all") {
    list = notifications.filter((n) => n.type === activeFilter);
  }

  if (list.length === 0) {
    notifList.innerHTML = "";
    emptyState.classList.remove("hidden");
    updateBadge();
    return;
  }

  emptyState.classList.add("hidden");

  notifList.innerHTML = list
    .map((n, idx) => {
      const isUnread = !readState[n.id];
      const isLate = n.meta && n.meta.late;

      // Tag label
      let tagHtml = `<span class="notif-tag ${tagClass(n.type)}">${n.tag}</span>`;
      if (isLate) {
        tagHtml += ` <span class="notif-tag tag-late">Late</span>`;
      }

      // CTA link for submissions → view submissions page
      let ctaHtml = "";
      if (n.type === "submission" && n.meta) {
        const enc = encodeURIComponent(n.meta.assignment);
        ctaHtml = `<a class="notif-cta" href="../submissions/index.html?assignment=${enc}" tabindex="-1">View submissions →</a>`;
      }

      return `
        <div
          class="notif-item${isUnread ? " unread" : ""}"
          role="listitem"
          data-id="${n.id}"
          style="animation-delay:${idx * 40}ms"
          tabindex="0"
          aria-label="${n.title}${isUnread ? " — unread" : ""}"
        >
          <div class="notif-icon-wrap type-${n.type}" aria-hidden="true">
            ${TYPE_ICON[n.type] || TYPE_ICON["submission"]}
          </div>

          <div class="notif-body">
            <div class="notif-title">${n.title}</div>
            <div class="notif-text">${n.body}</div>
            <div class="notif-tags-row">
              ${tagHtml}
              ${ctaHtml}
            </div>
          </div>

          <div class="notif-meta">
            <span class="notif-time">${n.time}</span>
            <span class="notif-dot" aria-label="${isUnread ? "unread" : ""}"></span>
          </div>
        </div>`;
    })
    .join("");

  updateBadge();
}

// ── Mark as read on click ─────────────────────────────────────
notifList.addEventListener("click", (e) => {
  // If user clicked a CTA link, let it navigate — don't swallow
  if (e.target.classList.contains("notif-cta")) return;

  const item = e.target.closest(".notif-item[data-id]");
  if (!item) return;

  const id = item.dataset.id;
  if (readState[id]) return; // already read

  readState[id] = true;
  item.classList.remove("unread");
  item.querySelector(".notif-dot").removeAttribute("aria-label");
  updateBadge();

  // If filter is "unread", fade and remove item
  if (activeFilter === "unread") {
    item.style.transition = "opacity .25s, transform .25s";
    item.style.opacity = "0";
    item.style.transform = "translateX(8px)";
    setTimeout(() => {
      render(); // re-render to keep list correct
    }, 260);
  }
});

// Keyboard: mark as read on Enter/Space
notifList.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const item = e.target.closest(".notif-item[data-id]");
    if (item) item.click();
  }
});

// ── Mark all as read ─────────────────────────────────────────
markAllBtn.addEventListener("click", () => {
  notifications.forEach((n) => { readState[n.id] = true; });
  render();
});

// ── Filter tabs ───────────────────────────────────────────────
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    filterBtns.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    render();
  });
});

// ── Add extra style for CTA link inline ──────────────────────
const style = document.createElement("style");
style.textContent = `
  .notif-tags-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .notif-cta {
    font-size: 11px;
    font-weight: 700;
    color: var(--teal-dark);
    text-decoration: none;
    opacity: 0;
    transition: opacity .15s;
    margin-left: auto;
  }
  .notif-item:hover .notif-cta { opacity: 1; }
`;
document.head.appendChild(style);

// ── Initial render ────────────────────────────────────────────
render();
