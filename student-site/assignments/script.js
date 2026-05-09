const urlParams = new URLSearchParams(location.search);
const classCode = urlParams.get("code");
const classData = window.StudentData.classes.find((item) => item.code === classCode);

if (!classData) {
  window.location.href = "../index.html";
}

const ASSIGNMENT_OVERRIDE_KEY = "studentAssignmentOverrides";
let activeAssignmentFilter = "all";

function readAssignmentOverrides() {
  try {
    const raw = localStorage.getItem(ASSIGNMENT_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_error) {
    return {};
  }
}

function mergeAssignments(baseAssignments) {
  const overrides = readAssignmentOverrides();

  return baseAssignments.map((assignment) => {
    const override = overrides[assignment.id];

    if (!override) {
      return assignment;
    }

    return {
      ...assignment,
      ...override,
      submissionHistory: override.submissionHistory || assignment.submissionHistory || [],
    };
  });
}

function populateClassDetails() {
  document.getElementById("classCode").textContent = classData.code;
  document.getElementById("classLevel").textContent = classData.level;
  document.querySelector("#class-title").textContent = classData.title;
  document.getElementById("classSchedule").textContent = `${classData.day} · ${classData.time}`;
  document.getElementById("classLocation").textContent = `${classData.room}, ${classData.building}`;
  document.getElementById("classCredits").textContent = `${classData.credits} Credits`;
}

function getAssignmentPriority(assignment) {
  if (assignment.status === "graded") {
    return 2;
  }

  if (assignment.status === "submitted") {
    return 1;
  }

  return 0;
}

function getAssignmentActionLabel(assignment) {
  if (assignment.status === "graded") {
    return "Review Grade";
  }

  if (assignment.status === "submitted") {
    return "View Submission";
  }

  return "Open Assignment";
}

function renderAssignments() {
  const assignmentList = document.getElementById("assignmentList");
  const assignmentEmptyState = document.getElementById("assignmentEmptyState");
  const sortValue = document.getElementById("assignmentSort").value;

  const mergedAssignments = mergeAssignments(classData.assignments || []);

  const assignments = mergedAssignments
    .filter((assignment) => activeAssignmentFilter === "all" || assignment.status === activeAssignmentFilter)
    .sort((left, right) => {
      const leftDate = new Date(left.deadlineDate).getTime();
      const rightDate = new Date(right.deadlineDate).getTime();

      if (sortValue === "deadline-desc") {
        return getAssignmentPriority(right) - getAssignmentPriority(left) || rightDate - leftDate;
      }

      return getAssignmentPriority(left) - getAssignmentPriority(right) || leftDate - rightDate;
    });

  if (!assignments.length) {
    assignmentList.innerHTML = "";
    assignmentEmptyState.hidden = false;
    return;
  }

  assignmentEmptyState.hidden = true;
  assignmentList.innerHTML = assignments
    .map((assignment) => {
      const actionLabel = getAssignmentActionLabel(assignment);
      const attachmentText = `${assignment.attachments} attachment${assignment.attachments === 1 ? "" : "s"}`;
      const badgeMarkup = assignment.badge ? `<span class="assignment-badge">${assignment.badge}</span>` : "";

      return `
        <article class="assignment-card assignment-${assignment.status}" style="--accent:${assignment.accent}">
          <div class="assignment-main">
            <div class="assignment-title-row">
              <h3>${assignment.title}</h3>
              ${badgeMarkup}
            </div>
            <div class="assignment-meta">
              <span>Deadline: ${assignment.deadline}</span>
              <span>${attachmentText}</span>
              <span class="assignment-status ${assignment.status}">${assignment.statusLabel}</span>
            </div>
          </div>
          <a class="assignment-action" href="../assignment-detail/index.html?code=${encodeURIComponent(classData.code)}&assignmentId=${encodeURIComponent(assignment.id)}">${actionLabel}</a>
        </article>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  populateClassDetails();
  renderAssignments();

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      activeAssignmentFilter = chip.dataset.filter;
      renderAssignments();
    });
  });

  document.getElementById("assignmentSort").addEventListener("change", renderAssignments);
});
