# Repository Guidelines

## Project Structure & Module Organization

This repository contains static HTML, CSS, and JavaScript portals:

- `student-site/`: student-facing HTML, CSS, and JavaScript.
- `teacher-site/`: teacher-facing HTML, CSS, and JavaScript. Teacher app pages are organized into page folders such as `my-classes/`, `class-management/`, `materials/`, `assignments/`, and `schedule/`.
- `README.md`: short project identifier.

Each page folder keeps its files side by side as `index.html`, `styles.css`, and `script.js`. Keep changes scoped to the relevant portal unless a visual or behavior update must stay consistent across multiple pages.

Prefer shared components for repeated teacher app chrome. Reuse `teacher-site/sidebar.js` for the sidebar and `teacher-site/header.js` for the workspace header instead of recreating those elements directly in page HTML. If a shared component needs a different link or active state, pass it through `data-*` attributes on the container rather than duplicating markup.

Centralize teacher app data in `teacher-site/data.js`. Page-specific scripts should read lists such as students, feedback, materials, assignments, scheduled sessions, and timetable events from `window.TeacherData` instead of declaring their own data arrays. Include `../data.js` before the page script.

Use toast-style UI for user notifications. Prefer an in-page toast component or helper for save confirmations, validation notes, and placeholder actions instead of `window.alert()`, so feedback stays consistent and non-blocking across the app.

## Build, Test, and Development Commands

There is no package manager or build step. Open either HTML file directly in a browser for quick checks:

```powershell
start .\student-site\index.html
start .\teacher-site\index.html
```

For a local static server, use any simple server from the repository root, for example:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/student-site/` or `http://localhost:8000/teacher-site/`.

## Coding Style & Naming Conventions

Use 2-space indentation for HTML, CSS, and JavaScript, matching the existing files. Prefer semantic HTML, accessible labels, and stable IDs for form controls, such as `studentUsername` or `teacherLoginForm`. CSS uses custom properties in `:root`, kebab-case class names, and compact component sections. JavaScript uses `const`, small functions, and camelCase variables.

When updating both portals, keep equivalent class names and interaction patterns aligned so shared fixes can be copied safely.

## Testing Guidelines

No automated tests are configured. Manually verify both portals after changes:

- Load each page without console errors.
- Submit the form and confirm the toast appears.
- Edit the username field and confirm the error state clears.
- Check responsive layout around mobile width, especially below `640px`.

If tests are added later, place them in a clear `tests/` directory or beside the feature they cover, and document the command here.

## Commit & Pull Request Guidelines

Git history currently only shows `first commit`, so there is no established convention. Use short, imperative commit messages such as `Update teacher login copy` or `Fix mobile footer spacing`.

Pull requests should include a concise summary, affected portal paths, manual test notes, and screenshots for visual changes. Link related issues when available and call out any behavior that intentionally differs between student and teacher portals.

## Security & Configuration Tips

Do not commit real credentials, API keys, or production endpoints. Existing username and password values are demo placeholders only; keep any future authentication wiring configurable outside source files.
