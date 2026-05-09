'use strict';

const timetable = (window.StudentData.schedule && window.StudentData.schedule.timetable) || [];

// ── Constants ─────────────────────────────────────────────────────────────────
const DAY_NAMES  = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAY_FULL   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const HOUR_START = 7;   // 7 AM
const HOUR_END   = 21;  // 9 PM
const HOUR_HEIGHT = 64; // px per hour (matches CSS --hour-height)

// ── State ─────────────────────────────────────────────────────────────────────
let currentWeekStart = getWeekStart(new Date());
let activeView = 'week';

// ── Date helpers ──────────────────────────────────────────────────────────────
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day + 1); // Monday
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function formatWeekRange(start) {
  const end = addDays(start, 6);
  const sM = MONTH_NAMES[start.getMonth()];
  const eM = MONTH_NAMES[end.getMonth()];
  const sY = start.getFullYear();
  const eY = end.getFullYear();
  if (sY !== eY) return `${sM} ${start.getDate()}, ${sY} – ${eM} ${end.getDate()}, ${eY}`;
  if (sM !== eM) return `${sM} ${start.getDate()} – ${eM} ${end.getDate()}, ${sY}`;
  return `${sM} ${start.getDate()} – ${end.getDate()}, ${sY}`;
}

function parseTime(str) {
  // "16:30" → decimal hours
  const [h, m] = str.split(':').map(Number);
  return h + m / 60;
}

function formatTimePretty(str) {
  // "16:30" → "4:30 PM"
  const [h, m] = str.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ── Get events for a given day (Date obj) ─────────────────────────────────────
function getEventsForDay(date) {
  const dayKey = DAY_NAMES[date.getDay() === 0 ? 0 : date.getDay()]; // SUN, MON…
  // Adjust since our week grid shows MON=index0 ... SUN=index6
  const dayIdx = date.getDay(); // JS: 0=Sun,1=Mon
  const key = DAY_NAMES[dayIdx];
  return timetable.filter((cls) => cls.days.includes(key));
}

// ══════════════════════════════════════════════════════════════════════════════
//  WEEK VIEW
// ══════════════════════════════════════════════════════════════════════════════
function renderWeekView() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Week days: Mon to Sun
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Day headers
  const dayColumns = document.getElementById('dayColumns');
  dayColumns.innerHTML = weekDays.map((d) => {
    const isToday = isSameDay(d, today);
    return `
      <div class="day-header">
        <span class="day-header-name">${DAY_NAMES[d.getDay() === 0 ? 0 : d.getDay()]}</span>
        <span class="day-header-num ${isToday ? 'today' : ''}">${d.getDate()}</span>
      </div>`;
  }).join('');

  // Time labels
  const totalHours = HOUR_END - HOUR_START;
  const gridHeight = totalHours * HOUR_HEIGHT;

  const timeColumn = document.getElementById('timeColumn');
  timeColumn.style.height = gridHeight + 'px';
  timeColumn.innerHTML = Array.from({ length: totalHours + 1 }, (_, i) => {
    const h = HOUR_START + i;
    const top = i * HOUR_HEIGHT;
    const label = h === 12 ? '12:00' : h < 12 ? `${h}:00` : `${h - 12}:00`;
    return `<span class="time-label" style="top:${top}px">${label}</span>`;
  }).join('');

  // Hour lines
  const hourLines = document.getElementById('hourLines');
  hourLines.style.height = gridHeight + 'px';
  hourLines.innerHTML =
    Array.from({ length: totalHours + 1 }, (_, i) => `<div class="hour-line" style="top:${i * HOUR_HEIGHT}px"></div>`).join('') +
    `<div class="day-col-lines">${weekDays.map(() => '<div class="day-col-line"></div>').join('')}</div>`;

  // Event blocks (one column per day)
  const eventBlocks = document.getElementById('eventBlocks');
  eventBlocks.style.height = gridHeight + 'px';
  eventBlocks.innerHTML = weekDays.map((d) => {
    const events = getEventsForDay(d);
    const evHTML = events.map((cls) => {
      const startH = parseTime(cls.startTime);
      const endH   = parseTime(cls.endTime);
      const top    = (startH - HOUR_START) * HOUR_HEIGHT;
      const height = (endH - startH) * HOUR_HEIGHT - 4;
      return `
        <div
          class="event-block"
          style="top:${top}px; height:${height}px; background:${cls.bgColor}; border-left-color:${cls.color}; color:${cls.color};"
          data-name="${cls.className}"
          data-time="${formatTimePretty(cls.startTime)} – ${formatTimePretty(cls.endTime)}"
          data-room="${cls.room}"
          role="button"
          tabindex="0"
          aria-label="${cls.className}, ${formatTimePretty(cls.startTime)} to ${formatTimePretty(cls.endTime)}"
        >
          <span class="event-block-name">${cls.className}</span>
          <span class="event-block-time">${formatTimePretty(cls.startTime)} – ${formatTimePretty(cls.endTime)}</span>
        </div>`;
    }).join('');
    return `<div class="day-col">${evHTML}</div>`;
  }).join('');

  attachEventTooltips();
}

// ── Event tooltip ─────────────────────────────────────────────────────────────
function attachEventTooltips() {
  const tooltip = document.getElementById('eventTooltip');

  document.getElementById('eventBlocks').addEventListener('mouseover', (e) => {
    const block = e.target.closest('.event-block');
    if (!block) { tooltip.hidden = true; return; }

    tooltip.innerHTML = `
      <strong>${block.dataset.name}</strong>
      <span>${block.dataset.time} · ${block.dataset.room}</span>`;
    tooltip.hidden = false;
    positionTooltip(e, tooltip);
  });

  document.getElementById('eventBlocks').addEventListener('mousemove', (e) => {
    if (!tooltip.hidden) positionTooltip(e, tooltip);
  });

  document.getElementById('eventBlocks').addEventListener('mouseout', (e) => {
    if (!e.target.closest('.event-block')) tooltip.hidden = true;
  });
}

function positionTooltip(e, tooltip) {
  const tx = Math.min(e.clientX + 14, window.innerWidth - tooltip.offsetWidth - 12);
  const ty = Math.max(e.clientY - tooltip.offsetHeight - 10, 10);
  tooltip.style.left = tx + 'px';
  tooltip.style.top  = ty + 'px';
}

// ══════════════════════════════════════════════════════════════════════════════
//  MONTH VIEW
// ══════════════════════════════════════════════════════════════════════════════
function renderMonthView() {
  const ref = currentWeekStart;
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  // Start from Monday of the week containing the 1st
  let startOffset = firstDay.getDay() - 1; // 0=Mon offset
  if (startOffset < 0) startOffset = 6;

  const grid = document.getElementById('monthGrid');

  // Day headers
  const headers = ['MON','TUE','WED','THU','FRI','SAT','SUN']
    .map((d) => `<div class="month-day-header">${d}</div>`).join('');

  const cells = [];
  let cursor = new Date(firstDay);
  cursor.setDate(cursor.getDate() - startOffset);

  for (let i = 0; i < 42; i++) {
    const isToday = isSameDay(cursor, today);
    const isOther = cursor.getMonth() !== month;
    const events = getEventsForDay(cursor);
    const evDots = events.map((cls) =>
      `<span class="month-event-dot" style="background:${cls.bgColor};color:${cls.color}">${cls.className}</span>`
    ).join('');

    cells.push(`
      <div class="month-day-cell ${isOther ? 'other-month' : ''}">
        <span class="month-day-num ${isToday ? 'today' : ''}">${cursor.getDate()}</span>
        ${evDots}
      </div>`);
    cursor = addDays(cursor, 1);
  }

  grid.innerHTML = headers + cells.join('');
}

// ══════════════════════════════════════════════════════════════════════════════
//  LIST VIEW
// ══════════════════════════════════════════════════════════════════════════════
function renderListView() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Collect next 30 days
  const groups = [];
  for (let i = 0; i < 30; i++) {
    const day = addDays(today, i);
    const events = getEventsForDay(day);
    if (events.length) groups.push({ day, events });
  }

  const container = document.getElementById('listSessions');
  if (!groups.length) {
    container.innerHTML = '<p class="list-empty">No scheduled sessions in the next 30 days.</p>';
    return;
  }

  container.innerHTML = groups.map(({ day, events }) => {
    const label = isSameDay(day, today)
      ? 'Today'
      : `${DAY_FULL[day.getDay()]}, ${MONTH_NAMES[day.getMonth()]} ${day.getDate()}`;

    const rows = events.map((cls) => `
      <div class="list-session-row">
        <div class="list-session-color" style="background:${cls.color}"></div>
        <div class="list-session-info">
          <span class="list-session-name">${cls.className}</span>
          <span class="list-session-meta">${cls.room}</span>
        </div>
        <span class="list-session-time">${formatTimePretty(cls.startTime)} – ${formatTimePretty(cls.endTime)}</span>
      </div>`).join('');

    return `<div class="list-date-group"><p class="list-date-label">${label}</p>${rows}</div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════════════════════
//  FOOTER — Legend + Stats
// ══════════════════════════════════════════════════════════════════════════════
function renderLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = timetable.map((cls) => `
    <span class="legend-item">
      <span class="legend-dot" style="background:${cls.color}"></span>
      ${cls.subject}
    </span>`).join('');
}

function renderStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count sessions this week
  const weekStart = getWeekStart(today);
  let weekSessions = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    weekSessions += getEventsForDay(d).length;
  }
  document.getElementById('weekCountText').textContent = `This week: ${weekSessions} session${weekSessions !== 1 ? 's' : ''}`;

  // Next session
  let nextLabel = '—';
  outer: for (let i = 0; i < 14; i++) {
    const d = addDays(today, i);
    const events = getEventsForDay(d);
    if (events.length) {
      const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      nextLabel = `${dayName} · ${formatTimePretty(events[0].startTime)}`;
      break outer;
    }
  }
  document.getElementById('nextSessionText').textContent = `Next session: ${nextLabel}`;
}

// ══════════════════════════════════════════════════════════════════════════════
//  Week navigation + view switcher
// ══════════════════════════════════════════════════════════════════════════════
function updateWeekRange() {
  document.getElementById('weekRange').textContent = formatWeekRange(currentWeekStart);
}

function renderCurrentView() {
  if (activeView === 'week')  renderWeekView();
  if (activeView === 'month') renderMonthView();
  if (activeView === 'list')  renderListView();
}

function initNavigation() {
  document.getElementById('prevWeekBtn').addEventListener('click', () => {
    currentWeekStart = addDays(currentWeekStart, -7);
    updateWeekRange();
    renderCurrentView();
  });

  document.getElementById('nextWeekBtn').addEventListener('click', () => {
    currentWeekStart = addDays(currentWeekStart, 7);
    updateWeekRange();
    renderCurrentView();
  });

  document.getElementById('todayBtn').addEventListener('click', () => {
    currentWeekStart = getWeekStart(new Date());
    updateWeekRange();
    renderCurrentView();
  });

  document.querySelectorAll('.view-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.view-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeView = tab.dataset.view;

      document.querySelectorAll('.view-panel').forEach((p) => p.classList.remove('active'));
      document.getElementById(`${activeView}View`).classList.add('active');

      renderCurrentView();
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateWeekRange();
  renderLegend();
  renderStats();
  renderWeekView();
  initNavigation();
});
