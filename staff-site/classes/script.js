const classTable = document.querySelector("#classTable");
const classSearch = document.querySelector("#classSearch");
const classCount = document.querySelector("#classCount");
const classes = window.StaffData.classes;

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function renderClasses() {
  const query = classSearch.value.trim().toLowerCase();
  const rows = classes.filter((item) =>
    `${item.name} ${item.course} ${item.teacher}`.toLowerCase().includes(query)
  );

  classTable.innerHTML = rows
    .map(
      (item) => `
        <tr>
          <td>
            <div class="class-name-cell">
              <span class="class-icon ${item.icon}"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z" /><path d="M8 9h8" /><path d="M8 13h5" /></svg></span>
              <a href="detail/index.html?id=${item.id}"><strong>${item.name}</strong></a>
            </div>
          </td>
          <td>${item.course}</td>
          <td>${item.startDate}</td>
          <td>${item.teacher}</td>
          <td><span class="status-pill ${getStatusClass(item.status)}">${item.status}</span></td>
          <td><a class="secondary-button" href="detail/index.html?id=${item.id}">View</a></td>
        </tr>
      `
    )
    .join("");
  classCount.textContent = `Showing 1-${rows.length} of 24 classes`;
}

classSearch.addEventListener("input", renderClasses);
renderClasses();
