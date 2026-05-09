const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");
const courseCategory = document.querySelector("#courseCategory");
const applyFilters = document.querySelector("#applyFilters");
const exportReport = document.querySelector("#exportReport");
const reportArea = document.querySelector("#reportArea");
const rangeTabs = Array.from(document.querySelectorAll("[data-range]"));
const enrollmentChart = document.querySelector("#enrollmentChart");
const teacherPerformance = document.querySelector("#teacherPerformance");
const reportData = {
  "All Technologies": {
    students: "1,240",
    classes: "48",
    workload: "82%",
    revenue: "$12,450",
    occupancy: "74%",
    trend: [
      { month: "Oct", current: 26, previous: 44 },
      { month: "Nov", current: 50, previous: 58 },
      { month: "Dec", current: 39, previous: 52 },
      { month: "Jan", current: 65, previous: 76 },
      { month: "Feb", current: 79, previous: 94 },
      { month: "Mar", current: 100, previous: 100 },
    ],
  },
  Mathematics: {
    students: "428",
    classes: "16",
    workload: "86%",
    revenue: "$4,820",
    occupancy: "81%",
    trend: [
      { month: "Oct", current: 32, previous: 45 },
      { month: "Nov", current: 44, previous: 56 },
      { month: "Dec", current: 41, previous: 50 },
      { month: "Jan", current: 68, previous: 78 },
      { month: "Feb", current: 83, previous: 92 },
      { month: "Mar", current: 96, previous: 100 },
    ],
  },
  Science: {
    students: "306",
    classes: "12",
    workload: "73%",
    revenue: "$3,410",
    occupancy: "69%",
    trend: [
      { month: "Oct", current: 22, previous: 36 },
      { month: "Nov", current: 38, previous: 46 },
      { month: "Dec", current: 35, previous: 42 },
      { month: "Jan", current: 53, previous: 65 },
      { month: "Feb", current: 61, previous: 74 },
      { month: "Mar", current: 80, previous: 91 },
    ],
  },
  English: {
    students: "292",
    classes: "11",
    workload: "77%",
    revenue: "$2,960",
    occupancy: "72%",
    trend: [
      { month: "Oct", current: 28, previous: 40 },
      { month: "Nov", current: 46, previous: 52 },
      { month: "Dec", current: 42, previous: 47 },
      { month: "Jan", current: 58, previous: 69 },
      { month: "Feb", current: 66, previous: 80 },
      { month: "Mar", current: 88, previous: 94 },
    ],
  },
  "Computer Science": {
    students: "214",
    classes: "9",
    workload: "68%",
    revenue: "$1,260",
    occupancy: "64%",
    trend: [
      { month: "Oct", current: 18, previous: 28 },
      { month: "Nov", current: 35, previous: 42 },
      { month: "Dec", current: 33, previous: 39 },
      { month: "Jan", current: 48, previous: 60 },
      { month: "Feb", current: 56, previous: 68 },
      { month: "Mar", current: 76, previous: 86 },
    ],
  },
};
const teachers = [
  { name: "Elena Rodriguez", since: "2021", specialty: "UI/UX Design", workload: 88, note: "High", rating: 4.9, reviews: 124, revenue: "$3,240", avatar: "ER", color: "#2e9c95" },
  { name: "Marcus Thorne", since: "2022", specialty: "Fullstack Dev", workload: 65, note: "Optimal", rating: 4.7, reviews: 89, revenue: "$2,810", avatar: "MT", color: "#0f4c5c" },
  { name: "Liam Chen", since: "2023", specialty: "Data Science", workload: 42, note: "Low", rating: 4.8, reviews: 56, revenue: "$1,450", avatar: "LC", color: "#27364f" },
];

function formatDateForTitle(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function renderDashboard() {
  const data = reportData[courseCategory.value] || reportData["All Technologies"];
  document.querySelector("#studentTotal").textContent = data.students;
  document.querySelector("#activeClasses").textContent = data.classes;
  document.querySelector("#teacherWorkload").textContent = data.workload;
  document.querySelector("#monthlyRevenue").textContent = data.revenue;
  document.querySelector("#occupancyValue").textContent = data.occupancy;

  enrollmentChart.innerHTML = data.trend
    .map(
      (item) => `
        <div class="enrollment-column">
          <span class="previous" style="height: ${item.previous * 2.5}px"></span>
          <span class="current" style="height: ${item.current * 2.5}px"></span>
          <small>${item.month}</small>
        </div>
      `
    )
    .join("");
}

function renderTeachers() {
  teacherPerformance.innerHTML = teachers
    .map(
      (teacher) => `
        <tr>
          <td>
            <div class="identity-cell">
              <span class="person-avatar" style="background: ${teacher.color}">${teacher.avatar}</span>
              <span><strong>${teacher.name}</strong><small>Active Since ${teacher.since}</small></span>
            </div>
          </td>
          <td><span class="tiny-badge soft">${teacher.specialty}</span></td>
          <td>
            <div class="workload-cell">
              <div class="bar"><span style="width: ${teacher.workload}%"></span></div>
              <small>${teacher.workload}% (${teacher.note})</small>
            </div>
          </td>
          <td><strong class="rating-star">★</strong> <strong>${teacher.rating}</strong> <small>(${teacher.reviews} reviews)</small></td>
          <td><strong>${teacher.revenue}</strong></td>
        </tr>
      `
    )
    .join("");
}

function setRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - Number(days));
  startDate.value = start.toISOString().slice(0, 10);
  endDate.value = end.toISOString().slice(0, 10);
}

rangeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    rangeTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    setRange(tab.dataset.range);
    renderDashboard();
  });
});

applyFilters.addEventListener("click", () => {
  renderDashboard();
  showToast(`Dashboard updated for ${formatDateForTitle(startDate.value)} - ${formatDateForTitle(endDate.value)}.`);
});

courseCategory.addEventListener("change", renderDashboard);

exportReport.addEventListener("click", () => {
  const previousTitle = document.title;
  document.title = `Techroom Center Overview ${startDate.value} to ${endDate.value}`;
  reportArea.dataset.printRange = `${formatDateForTitle(startDate.value)} - ${formatDateForTitle(endDate.value)}`;
  showToast("Preparing PDF export. Choose Save as PDF in the print dialog.");
  window.setTimeout(() => {
    window.print();
    document.title = previousTitle;
  }, 150);
});

renderDashboard();
renderTeachers();
