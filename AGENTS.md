# Repository Guidelines

## Project Structure & Module Organization

This repository is a static demo/prototype. Keep changes lightweight and self-contained:

- `student-site/`: student-facing HTML, CSS, and JavaScript.
- `teacher-site/`: teacher-facing HTML, CSS, and JavaScript. Teacher app pages are organized into page folders such as `my-classes/`, `class-management/`, `materials/`, `assignments/`, and `schedule/`.
- `staff-site/`: academic staff-facing HTML, CSS, and JavaScript. Staff app pages are organized into page folders such as `dashboard/`, `classes/`, `classes/detail/`, `classes/new/`, `students/`, `students/new/`, `timetable/`, and `timetable/new/`.
- `owner-site/`: center admin/owner-facing HTML, CSS, and JavaScript. Admin app pages are organized into page folders such as `dashboard/`, `accounts/`, and `classes/`.
- `README.md`: short project identifier.

Each page folder keeps its files side by side as `index.html`, `styles.css`, and `script.js`. Treat each folder as an isolated page unit unless a change must stay consistent across multiple pages.

Keep shared demo data in each site root `data.js` file instead of duplicating arrays in page scripts. For teacher pages, read from `window.TeacherData`; for staff pages, read from `window.StaffData`; for admin/owner pages, read from `window.OwnerData`; for student pages, use the same pattern with `student-site/data.js` when data is needed.

Prefer shared components for repeated teacher app chrome. Reuse `teacher-site/sidebar.js` for the sidebar and `teacher-site/header.js` for the workspace header instead of recreating those elements directly in page HTML. If a shared component needs a different link or active state, pass it through `data-*` attributes on the container rather than duplicating markup.

Centralize teacher app data in `teacher-site/data.js`. Page-specific scripts should read lists such as students, feedback, materials, assignments, scheduled sessions, and timetable events from `window.TeacherData` instead of declaring their own data arrays. Include `../data.js` before the page script on teacher pages that use shared data.

Prefer shared components for repeated admin/owner app chrome. Reuse `owner-site/sidebar.js`, `owner-site/header.js`, and `owner-site/shared.js` for admin navigation, workspace header, and toast helpers. Centralize admin app metrics, branches, accounts, courses, teachers, and cashflow data in `owner-site/data.js`, and include `../data.js` before page scripts on owner pages that use shared data.

Prefer shared components for repeated staff app chrome. Reuse `staff-site/sidebar.js`, `staff-site/header.js`, and `staff-site/shared.js` for staff navigation, workspace header, toast helpers, and logout. Centralize staff app metrics, classes, students, timetable sessions, rooms, live class rows, notices, and roster data in `staff-site/data.js`, and include `../data.js` or `../../data.js` before page scripts on staff pages that use shared data.

Use toast-style UI for user notifications. Prefer an in-page toast component or helper for save confirmations, validation notes, and placeholder actions instead of `window.alert()`, so feedback stays consistent and non-blocking across the app. Use modal-style placeholders only when the flow needs a stronger blocking affordance.

This repo intentionally has no backend, build pipeline, or production integration. Demo interactions may rely on hardcoded data, URL parameters, or `localStorage`; keep that behavior explicit and avoid adding hidden dependencies.

## Build, Test, and Development Commands

There is no package manager or build step. Open either HTML file directly in a browser for quick checks:

```powershell
start .\student-site\index.html
start .\teacher-site\index.html
start .\staff-site\index.html
start .\owner-site\index.html
```

For a local static server, use any simple server from the repository root, for example:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/student-site/`, `http://localhost:8000/teacher-site/`, `http://localhost:8000/staff-site/`, or `http://localhost:8000/owner-site/`.

When adding or changing a page, manually verify the affected HTML file and its immediate interactions in a browser. Keep any required script order intact, especially shared teacher chrome before page-specific scripts.

## Coding Style & Naming Conventions

Use 2-space indentation for HTML, CSS, and JavaScript, matching the existing files. Prefer semantic HTML, accessible labels, and stable IDs for form controls, such as `studentUsername` or `teacherLoginForm`. CSS uses custom properties in `:root`, kebab-case class names, and compact component sections. JavaScript uses `const`, small functions, and camelCase variables.

Keep page assets and state colocated with the page folder when possible. Avoid introducing cross-page abstractions unless the same behavior is already repeated and clearly shared.

When updating both portals, keep equivalent class names and interaction patterns aligned so shared fixes can be copied safely.

## Testing Guidelines

No automated tests are configured. Manually verify both portals after changes:

- Load each page without console errors.
- Submit the form and confirm the toast appears.
- Edit the username field and confirm the error state clears.
- Check responsive layout around mobile width, especially below `640px`.

For teacher, staff, and owner pages, also confirm the shared sidebar/header still render and the correct active state or back link is preserved.

If tests are added later, place them in a clear `tests/` directory or beside the feature they cover, and document the command here.

## Commit & Pull Request Guidelines

Git history currently only shows `first commit`, so there is no established convention. Use short, imperative commit messages such as `Update teacher login copy` or `Fix mobile footer spacing`.

Pull requests should include a concise summary, affected portal paths, manual test notes, and screenshots for visual changes. Link related issues when available and call out any behavior that intentionally differs between student and teacher portals.

## Security & Configuration Tips

Do not commit real credentials, API keys, or production endpoints. Existing username and password values are demo placeholders only; keep any future authentication wiring configurable outside source files.
