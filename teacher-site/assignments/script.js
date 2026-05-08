const assignments = [
  {
    title: "Quadratic Equations Practice",
    posted: "Oct 12",
    deadline: "Oct 24, 11:59 PM",
    submitted: 24,
    total: 28,
    urgent: true,
  },
  {
    title: "Trigonometry Basics Quiz",
    posted: "Oct 05",
    deadline: "Oct 15, 11:59 PM",
    submitted: 28,
    total: 28,
    urgent: false,
  },
  {
    title: "Logarithmic Functions HW",
    posted: "Oct 26",
    deadline: "Oct 28",
    submitted: 0,
    total: 28,
    urgent: false,
  },
  {
    title: "Geometry Final Project Phase 1",
    posted: "Oct 18",
    deadline: "Nov 01, 11:59 PM",
    submitted: 12,
    total: 28,
    urgent: true,
  },
];

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
    window.alert(`Delete flow for ${deleteButton.dataset.title} will be added next.`);
    return;
  }

  if (submissionsButton) {
    window.alert(`Submissions for ${submissionsButton.dataset.title} will be added next.`);
  }
});

createAssignmentButton.addEventListener("click", () => {
  window.alert("Create assignment flow will be added next.");
});

renderAssignments();
