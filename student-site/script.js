const studentData = window.StudentData;
const classGrid = document.querySelector("#classGrid");
const emptyState = document.querySelector("#emptyState");
const classSearch = document.querySelector("#classSearch");
const subjectFilter = document.querySelector("#subjectFilter");
const levelFilter = document.querySelector("#levelFilter");
const dayFilter = document.querySelector("#dayFilter");
const clearFiltersButton = document.querySelector("#clearFilters");

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

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function populateFilter(select, values, placeholder) {
  select.innerHTML = "";
  select.appendChild(createOption("", placeholder));

  values.forEach((value) => {
    select.appendChild(createOption(value, value));
  });
}

function getUniqueValues(key) {
  return [...new Set(studentData.classes.map((item) => item[key]))].sort();
}

function matchesQuery(classItem, query) {
  if (!query) {
    return true;
  }

  return [
    classItem.title,
    classItem.code,
    classItem.subject,
    classItem.level,
    classItem.day,
    classItem.teacher.name,
    classItem.teacher.role,
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function renderClassCard(classItem) {
  const isCompleted = classItem.status.toLowerCase() === "completed";
  const actionIcon = isCompleted
    ? `<svg viewBox="0 0 24 24"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M8 3h5l6 6v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M10 14h4" /></svg>`
    : `<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>`;

  return `
    <article class="class-card" style="--accent:${classItem.accent}" data-code="${classItem.code}">
      <div class="card-head">
        <div>
          <h2>${classItem.title}</h2>
          <p>${classItem.code}</p>
        </div>
        <span class="status-badge ${isCompleted ? "is-completed" : ""}">${classItem.status}</span>
      </div>

      <p class="meeting-line">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        </svg>
        ${classItem.day} · ${classItem.time}
      </p>

      <div class="card-footer">
        <div class="teacher-chip">
          <span class="teacher-avatar" style="background:${classItem.teacher.color}">${classItem.teacher.avatar}</span>
          <div>
            <strong>${classItem.teacher.name}</strong>
            <small>${classItem.teacher.role}</small>
          </div>
        </div>

        <button class="card-action" type="button" data-code="${classItem.code}" data-title="${classItem.title}" data-action="${classItem.actionLabel}">
          <span>${classItem.actionLabel}</span>
          ${actionIcon}
        </button>
      </div>
    </article>
  `;
}

function renderClasses() {
  const query = classSearch.value.trim().toLowerCase();
  const subject = subjectFilter.value;
  const level = levelFilter.value;
  const day = dayFilter.value;

  const filteredClasses = studentData.classes.filter((classItem) => {
    const subjectMatches = !subject || classItem.subject === subject;
    const levelMatches = !level || classItem.level === level;
    const dayMatches = !day || classItem.day === day;

    return (
      subjectMatches &&
      levelMatches &&
      dayMatches &&
      matchesQuery(classItem, query)
    );
  });

  classGrid.innerHTML = filteredClasses.map(renderClassCard).join("");
  emptyState.hidden = filteredClasses.length !== 0;

  classGrid.querySelectorAll(".card-action").forEach((button) => {
    button.addEventListener("click", () => {
      const code = button.dataset.code;
      window.location.href = `class-detail/index.html?code=${code}`;
    });
  });
}

function resetFilters() {
  classSearch.value = "";
  subjectFilter.value = "";
  levelFilter.value = "";
  dayFilter.value = "";
  renderClasses();
}

populateFilter(subjectFilter, getUniqueValues("subject"), "All Subjects");
populateFilter(levelFilter, getUniqueValues("level"), "All Levels");
populateFilter(dayFilter, getUniqueValues("day"), "All Days");

classSearch.addEventListener("input", renderClasses);
subjectFilter.addEventListener("change", renderClasses);
levelFilter.addEventListener("change", renderClasses);
dayFilter.addEventListener("change", renderClasses);
clearFiltersButton.addEventListener("click", resetFilters);

renderClasses();
