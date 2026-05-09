const accountTable = document.querySelector("#accountTable");
const accountCount = document.querySelector("#accountCount");
const statusFilter = document.querySelector("#accountStatus");
const segments = Array.from(document.querySelectorAll(".segment"));
const modal = document.querySelector("#deactivateModal");
const modalUser = document.querySelector("#modalUser");
const cancelDeactivate = document.querySelector("#cancelDeactivate");
const confirmDeactivate = document.querySelector("#confirmDeactivate");
const accounts = [...window.OwnerData.accounts];
let activeRole = "all";
let selectedAccount = null;

function getRoleClass(role) {
  return role.toLowerCase();
}

function renderAccountRows() {
  const status = statusFilter.value;
  const rows = accounts.filter((account) => {
    const matchesRole = activeRole === "all" || account.role === activeRole;
    const matchesStatus = status === "all" || account.status === status;

    return matchesRole && matchesStatus;
  });

  accountTable.innerHTML = rows
    .map(
      (account) => `
        <tr>
          <td>
            <div class="identity-cell">
              <span class="person-avatar" style="background: ${account.color}">${account.avatar}</span>
              <span><strong>${account.name}</strong><small>Joined ${account.joined}</small></span>
            </div>
          </td>
          <td><span class="role-badge ${getRoleClass(account.role)}">${account.role}</span></td>
          <td><strong>${account.email}</strong><small>${account.phone}</small></td>
          <td><span class="status-dot ${account.status.toLowerCase()}">${account.status}</span></td>
          <td>
            <div class="row-actions">
              <button type="button" aria-label="View ${account.name}" data-toast="${account.name} profile preview opened."><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg></button>
              <button type="button" aria-label="Edit ${account.name}" data-toast="${account.name} account editor is demo-only."><svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></svg></button>
              <button type="button" aria-label="Deactivate ${account.name}" data-deactivate="${account.email}"><svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg></button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
  accountCount.textContent = `Showing 1 - ${rows.length} of 124 accounts`;
}

function openDeactivateModal(account) {
  selectedAccount = account;
  modalUser.innerHTML = `
    <span class="person-avatar" style="background: ${account.color}">${account.avatar}</span>
    <span><strong>${account.name}</strong><small>${account.email}</small></span>
    <span class="role-badge teacher">${account.status}</span>
  `;
  modal.hidden = false;
}

segments.forEach((segment) => {
  segment.addEventListener("click", () => {
    segments.forEach((item) => item.classList.remove("active"));
    segment.classList.add("active");
    activeRole = segment.dataset.role;
    renderAccountRows();
  });
});

statusFilter.addEventListener("change", renderAccountRows);

accountTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-deactivate]");
  if (!button) return;
  openDeactivateModal(accounts.find((account) => account.email === button.dataset.deactivate));
});

cancelDeactivate.addEventListener("click", () => {
  modal.hidden = true;
});

confirmDeactivate.addEventListener("click", () => {
  if (selectedAccount) {
    selectedAccount.status = "Inactive";
    showToast(`${selectedAccount.name} has been deactivated.`);
  }
  modal.hidden = true;
  renderAccountRows();
});

renderAccountRows();
