'use strict';

var events = window.TeacherData.timetableEvents;

var shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatTime(h, m) {
  var ampm = h >= 12 ? 'PM' : 'AM';
  var hh = h % 12 || 12;
  return hh + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
}

function getDurationEnd(startHour, startMinute, durationMinutes) {
  var totalMin = startMinute + durationMinutes;
  return {
    hour: startHour + Math.floor(totalMin / 60),
    minute: totalMin % 60
  };
}

var classMap = {};
events.forEach(function(ev) {
  if (!classMap[ev.title]) {
    classMap[ev.title] = [];
  }
  classMap[ev.title].push(ev);
});

var classList = document.querySelector('.class-list');
var classesHTML = '';

Object.keys(classMap).forEach(function(title) {
  var slots = classMap[title];
  var rooms = [];
  var scheduleParts = [];

  slots.forEach(function(slot) {
    var dayName = shortDayNames[slot.day];
    var end = getDurationEnd(slot.startHour, slot.startMinute, slot.durationMinutes);
    var timeStr = formatTime(slot.startHour, slot.startMinute) + ' \u2013 ' + formatTime(end.hour, end.minute);
    scheduleParts.push(dayName + ' \u00B7 ' + timeStr);
    if (rooms.indexOf(slot.location) === -1) {
      rooms.push(slot.location);
    }
  });

  var scheduleStr = scheduleParts.join(', ');
  var roomStr = rooms.join(', ');
  var code = title.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 8) + '-10A';
  var dataName = title + ' ' + code;

  classesHTML +=
    '<article class="class-card" data-name="' + dataName + '">' +
      '<div class="subject-icon math" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24">' +
          '<path d="M7 5h10M7 19h10M8 5l7 7-7 7" />' +
        '</svg>' +
      '</div>' +
      '<div class="class-main">' +
        '<p class="class-code">' + code + '</p>' +
        '<h2>' + title + '</h2>' +
        '<div class="class-meta">' +
          '<span>' +
            '<svg viewBox="0 0 24 24">' +
              '<path d="M12 7v5l3 2" />' +
              '<path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />' +
            '</svg>' +
            scheduleStr +
          '</span>' +
          '<span>' +
            '<svg viewBox="0 0 24 24">' +
              '<path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />' +
              '<path d="M9 21v-6h6v6" />' +
            '</svg>' +
            roomStr +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="attendance">' +
        '<p>STUDENTS</p>' +
        '<div class="meter"><span style="width:92%"></span></div>' +
        '<strong>' + slots[0].students + '</strong>' +
      '</div>' +
      '<button class="open-class" type="button" aria-label="Open ' + title + '">' +
        '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>' +
      '</button>' +
    '</article>';
});

classList.innerHTML = classesHTML;

// Search
var searchInput = document.querySelector('#searchClasses');
var classCards = Array.from(document.querySelectorAll('.class-card'));

function renderEmptyState() {
  var el = document.createElement('p');
  el.className = 'empty-state';
  el.textContent = 'No classes match your search.';
  classList.appendChild(el);
}

function removeEmptyState() {
  var el = document.querySelector('.empty-state');
  if (el) el.remove();
}

searchInput.addEventListener('input', function() {
  var query = searchInput.value.trim().toLowerCase();
  var visibleCount = 0;
  removeEmptyState();
  classCards.forEach(function(card) {
    var text = card.textContent.toLowerCase();
    var isVisible = text.indexOf(query) !== -1;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });
  if (visibleCount === 0) renderEmptyState();
});

// Navigation
classCards.forEach(function(card) {
  card.addEventListener('click', function(event) {
    if (event.target.closest('.open-class')) return;
    var code = card.querySelector('.class-code').textContent;
    window.location.href = '../class-management/index.html?code=' + encodeURIComponent(code);
  });

  var openBtn = card.querySelector('.open-class');
  if (openBtn) {
    openBtn.addEventListener('click', function() {
      var code = card.querySelector('.class-code').textContent;
      window.location.href = '../class-management/index.html?code=' + encodeURIComponent(code);
    });
  }
});
