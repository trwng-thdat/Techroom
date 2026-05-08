const weekDays = window.TeacherData.weekDays;
const timeSlots = window.TeacherData.timeSlots;
const timetableEvents = window.TeacherData.timetableEvents;

const calendarGrid = document.querySelector("#calendarGrid");
const calendarShell = document.querySelector(".calendar-shell");
const detailCard = document.querySelector("#detailCard");
const hourHeight = 70;
const startHour = 8;
let hideDetailTimer;

function formatTime(hour, minute) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getEndTime(event) {
  const totalMinutes = event.startHour * 60 + event.startMinute + event.durationMinutes;
  return {
    hour: Math.floor(totalMinutes / 60),
    minute: totalMinutes % 60,
  };
}

function getEventPosition(event) {
  const minutesFromStart = (event.startHour - startHour) * 60 + event.startMinute;
  return {
    top: (minutesFromStart / 60) * hourHeight,
    height: (event.durationMinutes / 60) * hourHeight,
  };
}

function renderDetails(event) {
  const endTime = getEndTime(event);
  const timeSlot = `${formatTime(event.startHour, event.startMinute)} - ${formatTime(endTime.hour, endTime.minute)}`;

  detailCard.innerHTML = `
    <span class="status-pill">${event.active ? "ACTIVE SESSION" : "SCHEDULED"}</span>
    <h2>${event.title}</h2>
    <dl>
      <div>
        <dt>Location</dt>
        <dd>${event.location}</dd>
      </div>
      <div>
        <dt>Time Slot</dt>
        <dd>${timeSlot}</dd>
      </div>
      <div>
        <dt>Students</dt>
        <dd>${event.students}</dd>
      </div>
    </dl>
  `;
}

function positionDetails(eventButton) {
  const shellRect = calendarShell.getBoundingClientRect();
  const buttonRect = eventButton.getBoundingClientRect();
  const cardWidth = detailCard.offsetWidth || 238;
  const cardHeight = detailCard.offsetHeight || 250;
  const gap = 14;
  const padding = 12;
  const shellScrollLeft = calendarShell.scrollLeft || 0;
  const shellScrollTop = calendarShell.scrollTop || 0;

  let x = buttonRect.right - shellRect.left + shellScrollLeft + gap;
  let y = buttonRect.top - shellRect.top + shellScrollTop;
  const maxX = shellRect.width + shellScrollLeft - cardWidth - padding;
  const maxY = shellRect.height + shellScrollTop - cardHeight - padding;

  if (x > maxX) {
    x = buttonRect.left - shellRect.left + shellScrollLeft - cardWidth - gap;
  }

  y = Math.max(padding, Math.min(y, maxY));
  x = Math.max(padding, x);

  detailCard.style.setProperty("--detail-x", `${x}px`);
  detailCard.style.setProperty("--detail-y", `${y}px`);
}

function showDetails(eventButton) {
  const timetableEvent = timetableEvents.find((item) => item.id === eventButton.dataset.eventId);

  if (!timetableEvent) {
    return;
  }

  window.clearTimeout(hideDetailTimer);
  detailCard.hidden = false;
  renderDetails(timetableEvent);
  positionDetails(eventButton);
  detailCard.classList.add("is-visible");
}

function hideDetails() {
  detailCard.classList.remove("is-visible");

  hideDetailTimer = window.setTimeout(() => {
    if (!detailCard.classList.contains("is-visible")) {
      detailCard.hidden = true;
    }
  }, 190);
}

function renderCalendar() {
  const header = `
    <div class="calendar-header">
      <div class="corner-cell"><span>TIME</span></div>
      ${weekDays
        .map(
          (day) => `
            <div class="day-cell${day.today ? " today" : ""}">
              <span>${day.label}</span>
              <strong>${day.date}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;

  const lanes = weekDays
    .map((_, dayIndex) => {
      const events = timetableEvents
        .filter((event) => event.day === dayIndex)
        .map((event) => {
          const position = getEventPosition(event);
          const endTime = getEndTime(event);

          return `
            <button
              class="event-card"
              type="button"
              style="top: ${position.top}px; height: ${position.height}px"
              data-event-id="${event.id}"
            >
              <strong>${event.title}</strong>
              <small>${formatTime(event.startHour, event.startMinute)} - ${formatTime(endTime.hour, endTime.minute)}</small>
            </button>
          `;
        })
        .join("");

      return `<div class="day-lane">${events}</div>`;
    })
    .join("");

  const body = `
    <div class="calendar-body">
      <div class="time-column">
        ${timeSlots.map((slot) => `<div class="time-cell">${slot}</div>`).join("")}
      </div>
      ${lanes}
    </div>
  `;

  calendarGrid.innerHTML = header + body;
}

calendarGrid.addEventListener("mouseover", (event) => {
  const eventButton = event.target.closest(".event-card");

  if (!eventButton) {
    return;
  }

  showDetails(eventButton);
});

calendarGrid.addEventListener("mouseout", (event) => {
  const eventButton = event.target.closest(".event-card");

  if (!eventButton || eventButton.contains(event.relatedTarget)) {
    return;
  }

  hideDetails();
});

calendarGrid.addEventListener("focusin", (event) => {
  const eventButton = event.target.closest(".event-card");

  if (!eventButton) {
    return;
  }

  showDetails(eventButton);
});

calendarGrid.addEventListener("focusout", (event) => {
  const eventButton = event.target.closest(".event-card");

  if (!eventButton) {
    return;
  }

  hideDetails();
});

renderCalendar();
