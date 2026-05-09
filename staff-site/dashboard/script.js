const { metrics, utilization, liveClasses, notifications } = window.StaffData;
const metricGrid = document.querySelector("#metricGrid");
const utilizationChart = document.querySelector("#utilizationChart");
const liveClassTable = document.querySelector("#liveClassTable");
const recentNotifications = document.querySelector("#recentNotifications");
const exportDashboard = document.querySelector("#exportDashboard");

metricGrid.innerHTML = metrics
  .map(
    (metric) => `
      <article class="metric-card">
        <p>${metric.label}</p>
        <strong>${metric.value}</strong>
        <span class="${metric.tone}">${metric.note}</span>
      </article>
    `
  )
  .join("");

utilizationChart.innerHTML = utilization
  .map(
    (item) => `
      <div class="utilization-column${item.day === "Wed" ? " is-peak" : ""}">
        <span style="height: ${item.value * 2.6}px"></span>
        <small>${item.day}</small>
      </div>
    `
  )
  .join("");

liveClassTable.innerHTML = liveClasses
  .map(
    (item) => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.room}</td>
        <td>${item.teacher}</td>
        <td><span class="status-pill">${item.status}</span></td>
      </tr>
    `
  )
  .join("");

recentNotifications.innerHTML = notifications
  .map(
    (item) => `
      <article class="notice-item">
        <span class="notice-icon ${item.tone}">${item.tone === "danger" ? "*" : item.tone === "success" ? "✓" : "i"}</span>
        <div>
          <h3>${item.title}</h3>
          <p>${item.body}</p>
          <small>${item.time}</small>
        </div>
      </article>
    `
  )
  .join("");

exportDashboard.addEventListener("click", () => {
  showToast("Preparing dashboard PDF. Choose Save as PDF in the print dialog.");
  window.setTimeout(() => window.print(), 150);
});
