const dispatchTable = document.querySelector("#dispatchTable");
const dispatchCount = document.querySelector("#dispatchCount");
const dispatches = window.StaffData.dispatches.map((item) => ({ ...item }));

function getIcon(type) {
  if (type === "Emergency") return '<path d="M12 2v20" /><path d="M5 8h14" /><path d="M6 16h12" />';
  if (type === "Faculty") return '<path d="M12 8v4l3 3" /><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />';
  return '<path d="M8 6h8" /><path d="M8 12h8" /><path d="M8 18h5" /><path d="M5 3h14v18H5z" />';
}

function renderDispatches() {
  dispatchTable.innerHTML = dispatches
    .map(
      (item) => `
        <tr>
          <td>
            <div class="dispatch-title">
              <span class="dispatch-icon ${item.type.toLowerCase()}"><svg viewBox="0 0 24 24">${getIcon(item.type)}</svg></span>
              <span><strong>${item.title}</strong><small>${item.body}</small></span>
            </div>
          </td>
          <td><span class="class-chip">${item.recipients}</span></td>
          <td>${item.sentAt}</td>
          <td><span class="status-pill ${item.status.toLowerCase()}">${item.status}</span></td>
          <td>
            <div class="row-actions">
              <button type="button" data-action="edit" data-id="${item.id}" aria-label="Edit ${item.title}">
                <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
              </button>
              <button type="button" data-action="more" data-id="${item.id}" aria-label="More actions">
                <svg viewBox="0 0 24 24"><path d="M12 5h.01" /><path d="M12 12h.01" /><path d="M12 19h.01" /></svg>
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
  dispatchCount.textContent = `Showing ${dispatches.length} of 1,284 notifications`;
}

dispatchTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const item = dispatches.find((dispatch) => dispatch.id === button.dataset.id);
  showToast(button.dataset.action === "edit" ? `${item.title} opened for editing.` : `${item.title} actions are demo-only.`);
});

renderDispatches();
