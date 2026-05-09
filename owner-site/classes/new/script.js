const courseForm = document.querySelector("#courseForm");
const courseName = document.querySelector("#courseName");
const sessionCount = document.querySelector("#sessionCount");
const addSession = document.querySelector("#addSession");
const removeSession = document.querySelector("#removeSession");
const syllabusUpload = document.querySelector("#syllabusUpload");
const syllabusFileName = document.querySelector("#syllabusFileName");
let sessions = 12;

function updateSessions(nextValue) {
  sessions = Math.min(24, Math.max(1, nextValue));
  sessionCount.textContent = sessions;
}

addSession.addEventListener("click", () => updateSessions(sessions + 1));
removeSession.addEventListener("click", () => updateSessions(sessions - 1));

syllabusUpload.addEventListener("change", () => {
  const [file] = syllabusUpload.files;

  if (!file) {
    syllabusFileName.textContent = "Upload syllabus file";
    return;
  }

  syllabusFileName.textContent = file.name;
  showToast(`${file.name} attached to this course.`);
});

courseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!courseName.value.trim()) {
    showToast("Add a course name before saving.");
    courseName.focus();
    return;
  }

  showToast("Course draft saved.");
  window.setTimeout(() => {
    window.location.href = "../index.html";
  }, 500);
});
