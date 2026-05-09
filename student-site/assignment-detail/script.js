const params = new URLSearchParams(location.search);
const classCode = params.get("code");
const assignmentId = params.get("assignmentId");

const classData = window.StudentData.classes.find(
  (item) => item.code === classCode,
);
const ASSIGNMENT_OVERRIDE_KEY = "studentAssignmentOverrides";

if (!classData || !assignmentId) {
  window.location.href = "../index.html";
}

let assignment = classData.assignments.find((item) => item.id === assignmentId);

if (!assignment) {
  window.location.href = `../assignments/index.html?code=${encodeURIComponent(classCode)}`;
}

let pendingFiles = [];
let activeSubmitMode = "upload";

function showToast(message) {
  const existingToast = document.querySelector(".toast");

  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readOverrides() {
  try {
    const raw = localStorage.getItem(ASSIGNMENT_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_error) {
    return {};
  }
}

function writeOverrides(overrides) {
  localStorage.setItem(ASSIGNMENT_OVERRIDE_KEY, JSON.stringify(overrides));
}

function mergeAssignmentFromOverride() {
  const overrides = readOverrides();
  const override = overrides[assignment.id];

  if (override) {
    assignment = {
      ...assignment,
      ...override,
      submissionHistory:
        override.submissionHistory || assignment.submissionHistory || [],
    };
  }
}

function updateHeaderLinks() {
  const backHref = `../assignments/index.html?code=${encodeURIComponent(classData.code)}`;
  const header = document.getElementById("header-container");
  header.dataset.backHref = backHref;

  const sidebar = document.getElementById("sidebar-container");
  sidebar.dataset.assignmentsHref = backHref;

  const backLink = document.querySelector(".back-link");
  if (backLink) {
    backLink.setAttribute("href", backHref);
  }

  const assignmentNavLink = Array.from(
    document.querySelectorAll(".main-nav .nav-link"),
  ).find((link) =>
    link.textContent.trim().toLowerCase().includes("assignments"),
  );
  if (assignmentNavLink) {
    assignmentNavLink.setAttribute("href", backHref);
  }
}

function renderHeader() {
  document.getElementById("breadcrumbs").textContent =
    `My Classes > ${classData.title} > Assignments > ${assignment.title}`;
  document.getElementById("assignmentTitle").textContent = assignment.title;
  document.getElementById("assignmentInstructor").textContent =
    assignment.instructor || classData.teacher.name;
  document.getElementById("assignmentPostedAt").textContent =
    `Posted at ${assignment.postedAt || "N/A"}`;

  document.getElementById("deadlineText").textContent =
    `Deadline: ${assignment.deadline}`;
  document.getElementById("remainingText").textContent =
    assignment.badge ||
    (assignment.status === "graded"
      ? assignment.score || "Graded"
      : assignment.statusLabel);
  document.getElementById("assignmentInstructions").textContent =
    assignment.instructions || "No instructions yet.";
}

function renderReferenceFiles() {
  const referenceFileList = document.getElementById("referenceFileList");
  const files = assignment.referenceFiles || [];

  if (!files.length) {
    referenceFileList.innerHTML = '<p class="empty">No reference files.</p>';
    return;
  }

  referenceFileList.innerHTML = files
    .map((file) => {
      return `
        <article class="resource-item">
          <div>
            <strong>${file.name}</strong>
            <small>${file.sizeLabel} - ${file.updatedLabel}</small>
          </div>
          <button type="button" class="resource-action" data-name="${file.name}">Download</button>
        </article>
      `;
    })
    .join("");

  referenceFileList.querySelectorAll(".resource-action").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`Download placeholder for ${button.dataset.name}`);
    });
  });
}

function renderCourseContext() {
  document.getElementById("courseName").textContent =
    `${classData.title} (${classData.code})`;
  document.getElementById("courseTeacher").textContent = classData.teacher.name;
  document.getElementById("nextSession").textContent =
    classData.upcomingSessions && classData.upcomingSessions.length
      ? `${classData.upcomingSessions[0].date}, ${classData.upcomingSessions[0].time}`
      : "No upcoming session";
}

function renderStatusCard() {
  const statusLabel = document.getElementById("statusLabel");
  const statusTimer = document.getElementById("statusTimer");
  const statusChecklist = document.getElementById("statusChecklist");

  statusLabel.textContent = assignment.statusLabel;
  statusTimer.textContent = assignment.badge || "Submission window active";

  const checklist = [
    `Review material: ${assignment.referenceFiles && assignment.referenceFiles.length ? "done" : "optional"}`,
    `Upload files: ${(assignment.submissionHistory || []).length ? "done" : "pending"}`,
    `Status: ${assignment.statusLabel}`,
  ];

  statusChecklist.innerHTML = checklist
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function renderSelectedFiles() {
  const selectedFiles = document.getElementById("selectedFiles");

  if (!pendingFiles.length) {
    selectedFiles.innerHTML = '<p class="empty">No files selected.</p>';
    return;
  }

  selectedFiles.innerHTML = pendingFiles
    .map((file, index) => {
      return `
        <article class="selected-file-item">
          <div>
            <strong>${file.name}</strong>
            <small>${file.sizeLabel}</small>
          </div>
          <button type="button" data-index="${index}" class="remove-file">Remove</button>
        </article>
      `;
    })
    .join("");

  selectedFiles.querySelectorAll(".remove-file").forEach((button) => {
    button.addEventListener("click", () => {
      const removeIndex = Number(button.dataset.index);
      pendingFiles = pendingFiles.filter(
        (_item, index) => index !== removeIndex,
      );
      renderSelectedFiles();
    });
  });
}

function renderHistory() {
  const historyEl = document.getElementById("submissionHistory");
  const history = assignment.submissionHistory || [];

  if (!history.length) {
    historyEl.innerHTML = '<p class="empty">No submission history yet.</p>';
    return;
  }

  historyEl.innerHTML = history
    .slice()
    .reverse()
    .map((entry) => {
      const fileLines = (entry.files || [])
        .map((file) => `<li>${file.name} (${file.sizeLabel})</li>`)
        .join("");

      return `
        <article class="history-item">
          <strong>${entry.submittedAt}</strong>
          <p>${entry.note || "Submitted"}</p>
          <ul>${fileLines}</ul>
        </article>
      `;
    })
    .join("");
}

function saveSubmission(files, textResponse) {
  const submissionEntry = {
    id: `${assignment.id}-SUB-${Date.now()}`,
    submittedAt: new Date().toLocaleString(),
    note: textResponse
      ? "Submitted text response and files"
      : "Submitted through upload",
    files,
    textResponse: textResponse || "",
  };

  const updatedHistory = [
    ...(assignment.submissionHistory || []),
    submissionEntry,
  ];

  const overrides = readOverrides();
  overrides[assignment.id] = {
    status: assignment.status === "graded" ? "graded" : "submitted",
    statusLabel: assignment.status === "graded" ? "Graded" : "Submitted",
    badge: assignment.status === "graded" ? assignment.badge : "SUBMITTED",
    attachments: files.length,
    submissionHistory: updatedHistory,
  };

  writeOverrides(overrides);

  // Keep in-memory data (loaded from data.js) aligned in this session.
  assignment.submissionHistory = updatedHistory;
  if (assignment.status !== "graded") {
    assignment.status = "submitted";
    assignment.statusLabel = "Submitted";
    assignment.badge = "SUBMITTED";
  }
  assignment.attachments = files.length;

  mergeAssignmentFromOverride();
}

function initSubmitTabs() {
  const uploadMode = document.getElementById("uploadMode");
  const textMode = document.getElementById("textMode");

  document.querySelectorAll(".submit-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".submit-tab")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeSubmitMode = button.dataset.mode;

      uploadMode.classList.toggle("active", activeSubmitMode === "upload");
      textMode.classList.toggle("active", activeSubmitMode === "text");
    });
  });
}

function initUploadInput() {
  const submissionFileInput = document.getElementById("submissionFileInput");

  submissionFileInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      pendingFiles.push({
        name: file.name,
        sizeLabel: formatSize(file.size),
        type: file.type || "application/octet-stream",
      });
    });

    renderSelectedFiles();
    submissionFileInput.value = "";
  });
}

function initSubmitAction() {
  const confirmSubmit = document.getElementById("confirmSubmit");

  confirmSubmit.addEventListener("click", () => {
    const textResponse = document.getElementById("textResponse").value.trim();

    if (activeSubmitMode === "upload" && !pendingFiles.length) {
      showToast("Please select at least one file before submitting.");
      return;
    }

    if (activeSubmitMode === "text" && !textResponse && !pendingFiles.length) {
      showToast("Please enter a text response or attach a file.");
      return;
    }

    const filesToSubmit = pendingFiles.length
      ? pendingFiles
      : [
          {
            name: "text-response.txt",
            sizeLabel: `${textResponse.length} chars`,
            type: "text/plain",
          },
        ];

    saveSubmission(filesToSubmit, textResponse);
    pendingFiles = [];
    document.getElementById("textResponse").value = "";

    renderSelectedFiles();
    renderHistory();
    renderStatusCard();
    showToast(
      "Submission metadata was added to the assignment data successfully.",
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mergeAssignmentFromOverride();
  updateHeaderLinks();
  renderHeader();
  renderReferenceFiles();
  renderCourseContext();
  renderStatusCard();
  renderSelectedFiles();
  renderHistory();
  initSubmitTabs();
  initUploadInput();
  initSubmitAction();
});
