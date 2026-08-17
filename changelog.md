# Changelog

This file documents the relevant changes introduced in each version of Taskly.

## Version format

```text
## [MAJOR.MINOR.PATCH] - YYYY-MM-DD

### Added

- New features and capabilities.

### Changed

- Changes to existing behavior, design, or configuration.

### Fixed

- Bug fixes and corrected behavior.

### Security

- Authentication, authorization, and security improvements.

### Removed

- Features, files, or behavior removed from the project.
```

Taskly follows Semantic Versioning:

- `MAJOR`: incompatible or substantial application changes.
- `MINOR`: backward-compatible functionality.
- `PATCH`: backward-compatible fixes and minor improvements.
Only categories containing changes should be included in a version entry.



# Taskly - Frontend - Versions


## [1.0.0] - 2026-08-17

### Added

- Added a name to the project : Taskly
- Added login and registration interfaces with responsive, minimalist layouts.
- Added account registration using email, first name, and password.
- Added login and logout flows backed by Django REST Framework endpoints.
- Added frontend email and password validation for account registration.
- Added reusable animated messages for success, error, and session feedback.
- Added cookie-based JWT authentication with automatic access-token renewal.
- Added a reusable loading overlay for authentication renewal requests.
- Added authenticated-route checks for the Home and Profile pages.
- Added inverse session checks that redirect authenticated users away from the Login and Register pages.
- Added a responsive Home interface with To do and Done task views.
- Added task creation through a reusable modal with title and description fields.
- Added task detail retrieval and editing through PATCH requests.
- Added task deletion with immediate interface updates.
- Added task status updates through an animated checkbox interaction.
- Added a five-second animated transition from To do to Done after completing a task.
- Added user profile retrieval and editing for first name and email.
- Added confirmation modals for deleting an account or all user tasks.
- Added account deletion and redirection to the Register page.
- Added bulk task deletion and redirection to the Home page.
- Added a responsive navigation header with task filters, profile access, logout, and theme controls.
- Added animated light and dark themes shared by the Home and Profile interfaces.
- Added the Taskly logo throughout the application and as the browser favicon.
- Added centralized environment variables for the backend URL and API endpoints.
- Added a project-specific commit convention to the README.
- Added authenticated API requests in a shared Axios client configured to include cookies.
- Added task list handling to consume a direct array response from the backend.
- Added registration and login handling to use the user data returned by the backend.
- Added all visible application copy, labels, titles, messages, and accessibility text to English.
- Added the task interface with a darker glass effect and improved text contrast.
- Added responsive behavior for forms, modals, task cards, navigation, messages, and loading states.
- Added the password visibility control with animated icons.
- Redirected users to Login when authenticated Home or Profile requests are rejected.
- Added Axios requests with credentials so HttpOnly JWT cookies are included.
- Added automatic retry of the original authenticated request after refreshing an expired access token.
- Prevented authenticated users from reopening Login or Register while their session remains active.
- Added destructive-action confirmation before deleting accounts or tasks.
- Added task loading so retrieved tasks immediately populate the React state and interface.
- Added updated tasks disappearing from the task list after a successful request.
- Added null task access that caused the Home component to crash.
- Added missing React keys in rendered task collections.
- Added message overflow and responsiveness on mobile screens.
- Added logout messages remaining visible after navigation.
- Added session-expiration feedback so navigation occurs after the loading overlay finishes.
- Added loading-overlay timing so it remains visible until both its minimum duration and the active request are complete.
- Added profile fields to display the retrieved email and first name instead of treating them as messages.

### Changed

- None

### Fixed

- None

### Security

- None

### Removed

- None
