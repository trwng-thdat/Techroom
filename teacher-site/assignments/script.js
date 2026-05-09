const assignments = window.TeacherData.assignments;

const assignmentList = document.querySelector("#assignmentList");
const createAssignmentButton = document.querySelector("#createAssignment");

function renderAssignments() {
  assignmentList.innerHTML = assignments
    .map((assignment) => {
      const percent = Math.round((assignment.submitted / assignment.total) * 100);
      const deadlineClass = assignment.urgent ? "deadline-danger" : "muted";

      return `
        <div class="assignment-row" role="row">
          <span class="assignment-title" role="cell">${assignment.title}</span>
          <span class="muted" role="cell">${assignment.posted}</span>
          <span class="${deadlineClass}" role="cell">${assignment.deadline}</span>
          <div class="progress-cell" role="cell">
            <div class="progress-track" aria-label="${assignment.submitted} of ${assignment.total} submissions">
              <span style="width: ${percent}%"></span>
            </div>
            <small>${assignment.submitted}/${assignment.total}</small>
          </div>
          <div class="actions" role="cell">
            <button class="delete-button" type="button" data-title="${assignment.title}">Delete</button>
            <button class="submissions-button" type="button" data-title="${assignment.title}">View Submissions</button>
          </div>
        </div>
      `;
    })
    .join("");
}

assignmentList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");
  const submissionsButton = event.target.closest(".submissions-button");

  if (deleteButton) {
    showModal(`Delete flow for ${deleteButton.dataset.title} will be added next.`);
    return;
  }

  if (submissionsButton) {
    showModal(`Submissions for ${submissionsButton.dataset.title} will be added next.`);
  }
});

createAssignmentButton.addEventListener("click", () => {
  showModal("Create assignment flow will be added next.");
});

renderAssignments();
