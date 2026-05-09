'use strict';

var rawEvents = window.TeacherData.timetableEvents;

var DAY_NAMES  = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
var DAY_FULL   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var HOUR_START = 7;
var HOUR_END   = 21;
var HOUR_HEIGHT = 64;

var DAY_MAP = { 0:'MON', 1:'TUE', 2:'WED', 3:'THU', 4:'FRI', 5:'SAT', 6:'SUN' };

var EVENT_COLORS = [
  { color: '#10b89d', bgColor: '#c9f1ea' },
  { color: '#5468ff', bgColor: '#e8eaff' },
  { color: '#f39b54', bgColor: '#fef0e3' },
  { color: '#e48788', bgColor: '#fce8e8' },
];

var timetable = rawEvents.map(function(e, idx) {
  var totalMin = e.startMinute + e.durationMinutes;
  var endHour = e.startHour + Math.floor(totalMin / 60);
  var endMin = totalMin % 60;
  var sm = e.startMinute < 10 ? '0' : '';
  var em = endMin < 10 ? '0' : '';
  var c = EVENT_COLORS[idx % EVENT_COLORS.length];
  return {
    className: e.title,
    subject: e.title,
    color: c.color,
    bgColor: c.bgColor,
    days: [DAY_MAP[e.day]],
    startTime: e.startHour + ':' + sm + e.startMinute,
    endTime: endHour + ':' + em + endMin,
    room: e.location,
    students: e.students,
  };
});

var currentWeekStart = getWeekStart(new Date());
var activeView = 'week';

function getWeekStart(date) {
  var d = new Date(date);
  var day = d.getDay();
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  var d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatWeekRange(start) {
  var end = addDays(start, 6);
  var sM = MONTH_NAMES[start.getMonth()];
  var eM = MONTH_NAMES[end.getMonth()];
  var sY = start.getFullYear();
  var eY = end.getFullYear();
  if (sY !== eY) return sM + ' ' + start.getDate() + ', ' + sY + ' \u2013 ' + eM + ' ' + end.getDate() + ', ' + eY;
  if (sM !== eM) return sM + ' ' + start.getDate() + ' \u2013 ' + eM + ' ' + end.getDate() + ', ' + sY;
  return sM + ' ' + start.getDate() + ' \u2013 ' + end.getDate() + ', ' + sY;
}

function parseTime(str) {
  var parts = str.split(':');
  return Number(parts[0]) + Number(parts[1]) / 60;
}

function formatTimePretty(str) {
  var parts = str.split(':');
  var h = Number(parts[0]);
  var m = Number(parts[1]);
  var ampm = h >= 12 ? 'PM' : 'AM';
  var hh = h % 12 || 12;
  var ms = m < 10 ? '0' : '';
  return hh + ':' + ms + m + ' ' + ampm;
}

function getEventsForDay(date) {
  var dayIdx = date.getDay();
  var key = DAY_NAMES[dayIdx];
  return timetable.filter(function(cls) {
    return cls.days.indexOf(key) !== -1;
  });
}

function renderWeekView() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var weekDays = [];
  for (var i = 0; i < 7; i++) {
    weekDays.push(addDays(currentWeekStart, i));
  }

  var dayColumns = document.getElementById('dayColumns');
  var dayHTML = '';
  for (var i = 0; i < weekDays.length; i++) {
    var d = weekDays[i];
    var isToday = isSameDay(d, today);
    dayHTML += '<div class="day-header">' +
      '<span class="day-header-name">' + DAY_NAMES[d.getDay()] + '</span>' +
      '<span class="day-header-num' + (isToday ? ' today' : '') + '">' + d.getDate() + '</span>' +
    '</div>';
  }
  dayColumns.innerHTML = dayHTML;

  var totalHours = HOUR_END - HOUR_START;
  var gridHeight = totalHours * HOUR_HEIGHT;

  var timeColumn = document.getElementById('timeColumn');
  timeColumn.style.height = gridHeight + 'px';
  var timeHTML = '';
  for (var i = 0; i <= totalHours; i++) {
    var h = HOUR_START + i;
    var top = i * HOUR_HEIGHT;
    var label = h === 12 ? '12:00' : h < 12 ? h + ':00' : (h - 12) + ':00';
    timeHTML += '<span class="time-label" style="top:' + top + 'px">' + label + '</span>';
  }
  timeColumn.innerHTML = timeHTML;

  var hourLines = document.getElementById('hourLines');
  hourLines.style.height = gridHeight + 'px';
  var linesHTML = '';
  for (var i = 0; i <= totalHours; i++) {
    linesHTML += '<div class="hour-line" style="top:' + (i * HOUR_HEIGHT) + 'px"></div>';
  }
  linesHTML += '<div class="day-col-lines">';
  for (var i = 0; i < 7; i++) {
    linesHTML += '<div class="day-col-line"></div>';
  }
  linesHTML += '</div>';
  hourLines.innerHTML = linesHTML;

  var eventBlocks = document.getElementById('eventBlocks');
  eventBlocks.style.height = gridHeight + 'px';
  var eventsHTML = '';
  for (var wi = 0; wi < weekDays.length; wi++) {
    var events = getEventsForDay(weekDays[wi]);
    var evHTML = '';
    for (var ei = 0; ei < events.length; ei++) {
      var cls = events[ei];
      var startH = parseTime(cls.startTime);
      var endH = parseTime(cls.endTime);
      var top = (startH - HOUR_START) * HOUR_HEIGHT;
      var height = (endH - startH) * HOUR_HEIGHT - 4;
      var timeStr = formatTimePretty(cls.startTime) + ' \u2013 ' + formatTimePretty(cls.endTime);
      evHTML += '<div class="event-block" style="top:' + top + 'px;height:' + height + 'px;background:' + cls.bgColor + ';border-left-color:' + cls.color + ';color:' + cls.color + ';"' +
        ' data-name="' + cls.className + '"' +
        ' data-time="' + timeStr + '"' +
        ' data-room="' + cls.room + '"' +
        ' role="button" tabindex="0"' +
        ' aria-label="' + cls.className + ', ' + timeStr + '">' +
        '<span class="event-block-name">' + cls.className + '</span>' +
        '<span class="event-block-time">' + timeStr + '</span>' +
      '</div>';
    }
    eventsHTML += '<div class="day-col">' + evHTML + '</div>';
  }
  eventBlocks.innerHTML = eventsHTML;

  attachEventTooltips();
}

function attachEventTooltips() {
  var tooltip = document.getElementById('eventTooltip');

  document.getElementById('eventBlocks').addEventListener('mouseover', function(e) {
    var block = e.target.closest('.event-block');
    if (!block) { tooltip.hidden = true; return; }
    tooltip.innerHTML = '<strong>' + block.dataset.name + '</strong><span>' + block.dataset.time + ' \u00B7 ' + block.dataset.room + '</span>';
    tooltip.hidden = false;
    positionTooltip(e, tooltip);
  });

  document.getElementById('eventBlocks').addEventListener('mousemove', function(e) {
    if (!tooltip.hidden) positionTooltip(e, tooltip);
  });

  document.getElementById('eventBlocks').addEventListener('mouseout', function(e) {
    if (!e.target.closest('.event-block')) tooltip.hidden = true;
  });
}

function positionTooltip(e, tooltip) {
  var tx = Math.min(e.clientX + 14, window.innerWidth - tooltip.offsetWidth - 12);
  var ty = Math.max(e.clientY - tooltip.offsetHeight - 10, 10);
  tooltip.style.left = tx + 'px';
  tooltip.style.top = ty + 'px';
}

function renderMonthView() {
  var ref = currentWeekStart;
  var year = ref.getFullYear();
  var month = ref.getMonth();
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var firstDay = new Date(year, month, 1);
  var startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  var grid = document.getElementById('monthGrid');
  var headerDays = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  var headersHTML = '';
  for (var i = 0; i < headerDays.length; i++) {
    headersHTML += '<div class="month-day-header">' + headerDays[i] + '</div>';
  }

  var cells = [];
  var cursor = new Date(firstDay);
  cursor.setDate(cursor.getDate() - startOffset);

  for (var i = 0; i < 42; i++) {
    var isToday = isSameDay(cursor, today);
    var isOther = cursor.getMonth() !== month;
    var events = getEventsForDay(cursor);
    var evDots = '';
    for (var ei = 0; ei < events.length; ei++) {
      evDots += '<span class="month-event-dot" style="background:' + events[ei].bgColor + ';color:' + events[ei].color + '">' + events[ei].className + '</span>';
    }
    cells.push('<div class="month-day-cell' + (isOther ? ' other-month' : '') + '">' +
      '<span class="month-day-num' + (isToday ? ' today' : '') + '">' + cursor.getDate() + '</span>' +
      evDots + '</div>');
    cursor = addDays(cursor, 1);
  }

  grid.innerHTML = headersHTML + cells.join('');
}

function renderListView() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var groups = [];
  for (var i = 0; i < 30; i++) {
    var day = addDays(today, i);
    var events = getEventsForDay(day);
    if (events.length) groups.push({ day: day, events: events });
  }

  var container = document.getElementById('listSessions');
  if (!groups.length) {
    container.innerHTML = '<p class="list-empty">No scheduled sessions in the next 30 days.</p>';
    return;
  }

  var listHTML = '';
  for (var gi = 0; gi < groups.length; gi++) {
    var group = groups[gi];
    var label = isSameDay(group.day, today)
      ? 'Today'
      : DAY_FULL[group.day.getDay()] + ', ' + MONTH_NAMES[group.day.getMonth()] + ' ' + group.day.getDate();

    var rows = '';
    for (var ei = 0; ei < group.events.length; ei++) {
      var cls = group.events[ei];
      rows += '<div class="list-session-row">' +
        '<div class="list-session-color" style="background:' + cls.color + '"></div>' +
        '<div class="list-session-info">' +
          '<span class="list-session-name">' + cls.className + '</span>' +
          '<span class="list-session-meta">' + cls.room + '</span>' +
        '</div>' +
        '<span class="list-session-time">' + formatTimePretty(cls.startTime) + ' \u2013 ' + formatTimePretty(cls.endTime) + '</span>' +
      '</div>';
    }
    listHTML += '<div class="list-date-group"><p class="list-date-label">' + label + '</p>' + rows + '</div>';
  }
  container.innerHTML = listHTML;
}

function renderLegend() {
  var legend = document.getElementById('legend');
  var legendHTML = '';
  for (var i = 0; i < timetable.length; i++) {
    legendHTML += '<span class="legend-item">' +
      '<span class="legend-dot" style="background:' + timetable[i].color + '"></span>' +
      timetable[i].subject +
    '</span>';
  }
  legend.innerHTML = legendHTML;
}

function renderStats() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var weekStart = getWeekStart(today);
  var weekSessions = 0;
  for (var i = 0; i < 7; i++) {
    weekSessions += getEventsForDay(addDays(weekStart, i)).length;
  }
  document.getElementById('weekCountText').textContent = 'This week: ' + weekSessions + ' session' + (weekSessions !== 1 ? 's' : '');

  var nextLabel = '\u2014';
  outer: for (var i = 0; i < 14; i++) {
    var d = addDays(today, i);
    var events = getEventsForDay(d);
    if (events.length) {
      var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      nextLabel = dayNames[d.getDay()] + ' \u00B7 ' + formatTimePretty(events[0].startTime);
      break outer;
    }
  }
  document.getElementById('nextSessionText').textContent = 'Next session: ' + nextLabel;
}

function updateWeekRange() {
  document.getElementById('weekRange').textContent = formatWeekRange(currentWeekStart);
}

function renderCurrentView() {
  if (activeView === 'week') renderWeekView();
  if (activeView === 'month') renderMonthView();
  if (activeView === 'list') renderListView();
}

document.getElementById('prevWeekBtn').addEventListener('click', function() {
  currentWeekStart = addDays(currentWeekStart, -7);
  updateWeekRange();
  renderCurrentView();
});

document.getElementById('nextWeekBtn').addEventListener('click', function() {
  currentWeekStart = addDays(currentWeekStart, 7);
  updateWeekRange();
  renderCurrentView();
});

document.getElementById('todayBtn').addEventListener('click', function() {
  currentWeekStart = getWeekStart(new Date());
  updateWeekRange();
  renderCurrentView();
});

document.querySelectorAll('.view-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.view-tab').forEach(function(t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeView = tab.dataset.view;

    document.querySelectorAll('.view-panel').forEach(function(p) {
      p.classList.remove('active');
    });
    document.getElementById(activeView + 'View').classList.add('active');

    renderCurrentView();
  });
});

updateWeekRange();
renderLegend();
renderStats();
renderWeekView();
