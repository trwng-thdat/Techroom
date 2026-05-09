const sessionForm = document.querySelector("#sessionForm");
const sessionClass = document.querySelector("#sessionClass");
const sessionRoom = document.querySelector("#sessionRoom");
const sessionDay = document.querySelector("#sessionDay");
const startTime = document.querySelector("#startTime");
const endTime = document.querySelector("#endTime");
const liveCheckList = document.querySelector("#liveCheckList");
const overviewClass = document.querySelector("#overviewClass");
const overviewMeta = document.querySelector("#overviewMeta");
const overviewStudents = document.querySelector("#overviewStudents");
const allocationValue = document.querySelector("#allocationValue");
const allocationBar = document.querySelector("#allocationBar");
const allocationNote = document.querySelector("#allocationNote");

sessionClass.innerHTML = window.StaffData.classes
  .filter((item) => item.status !== "Cancelled")
  .map((item) => `<option value="${item.id}">${item.name}</option>`)
  .join("");

sessionRoom.innerHTML = window.StaffData.rooms
  .map((room) => `<option value="${room.name}">${room.name} (${room.status})</option>`)
  .join("");

function getSelectedClass() {
  return window.StaffData.classes.find((item) => item.id === sessionClass.value) || window.StaffData.classes[0];
}

function renderLiveCheck() {
  const selectedClass = getSelectedClass();
  const room = window.StaffData.rooms.find((item) => item.name === sessionRoom.value);
  const conflict = sessionDay.value === "Wednesday" || startTime.value >= "16:00";
  const allocated = selectedClass.course === "Mathematics" ? 4 : selectedClass.course === "Physics" ? 3 : 2;
  const target = selectedClass.course === "Mathematics" ? 6 : 4;
  const percent = Math.min(100, Math.round((allocated / target) * 100));

  overviewClass.textContent = selectedClass.name;
  overviewMeta.textContent = `${selectedClass.code} • ${selectedClass.course}`;
  overviewStudents.textContent = `${selectedClass.enrolled} / ${room ? room.capacity : 30}`;
  allocationValue.textContent = `${allocated} / ${target} Hours`;
  allocationBar.style.width = `${percent}%`;
  allocationNote.textContent = `${Math.max(0, target - allocated)} hours remaining to meet curriculum goals.`;

  liveCheckList.innerHTML = `
    <article class="check-row success"><span>✓</span><div><strong>Teacher Availability</strong><p>${selectedClass.teacher} is available</p></div></article>
    <article class="check-row success"><span>✓</span><div><strong>Room Capacity</strong><p>${room.name} is available (${room.capacity} seats)</p></div></article>
    <article class="check-row ${conflict ? "danger" : "success"}"><span>${conflict ? "!" : "✓"}</span><div><strong>Student Conflicts</strong><p>${conflict ? "2 students have overlapping classes" : "No overlapping sessions detected"}</p>${conflict ? "<button type=\"button\" data-toast=\"Alex Mercer and Sanya Nair have overlapping classes.\">View names</button>" : ""}</div></article>
  `;
}

[sessionClass, sessionRoom, sessionDay, startTime, endTime].forEach((control) => {
  control.addEventListener("change", renderLiveCheck);
});

sessionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast(`${getSelectedClass().name} session saved to the timetable.`);
  window.setTimeout(() => {
    window.location.href = "../index.html";
  }, 650);
});

renderLiveCheck();
