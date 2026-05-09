const makeupStatusFilter = document.querySelector("#makeupStatusFilter");
const makeupRequestTable = document.querySelector("#makeupRequestTable");
const requests = window.StaffData.makeupRequests.map((request) => ({ ...request }));

function renderRequests() {
  const status = makeupStatusFilter.value;
  const rows = requests.filter((request) => !status || request.status === status);

  makeupRequestTable.innerHTML = rows
    .map(
      (request) => `
        <tr>
          <td>
            <div class="class-name-cell">
              <span class="student-avatar">${request.initials}</span>
              <strong>${request.student}</strong>
            </div>
          </td>
          <td>${request.originalClass}</td>
          <td>${request.missedDate}</td>
          <td><span class="status-pill approved-absence">${request.status}</span></td>
          <td><a class="primary-button compact-button" href="find/index.html?request=${request.id}">Find Makeup Class</a></td>
        </tr>
      `
    )
    .join("");
}

makeupStatusFilter.addEventListener("change", renderRequests);
renderRequests();
