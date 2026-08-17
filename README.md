# Commit Convention — Taskly

## Format

```text
type(scope): short description

- Detailed description of the change.
```

The description must be written in the imperative mood, start with a lowercase
letter, and not end with a period.

## Project Scopes

- `component-{subScope}`: changes limited to a UI component or feature.
- `app-{subScope}`: changes to the application entry point or global behavior.
- `server-{subScope}`: API requests, authentication, and response handling.
- `config`: project or tool configuration.
- `deps`: dependencies and package management.
- `docs`: project documentation.
- `all`: changes that affect the entire project.

Subscopes are optional. Use them only when they make the affected area clearer.

## Component Subscopes

- `login`
- `register`
- `home`
- `profile`
- `message`
- `task-modal`
- `confirmation-modal`
- `loading-spinner`
- `theme`
- `multiple`

## App Subscopes

- `routing`
- `styles`
- `bootstrap`
- `multiple`

## Server Subscopes

- `api-client`
- `auth`
- `tasks`
- `users`
- `response-formatter`
- `multiple`

## Types

### Feature

```text
feat(scope): new functionality

- Description of the new functionality.
```

### Fix

```text
fix(scope): fix an error

- Description of the corrected behavior.
```

### Refactor

```text
refactor(scope): improve internal code without changing behavior

- Description of the internal improvement.
```

### Documentation

```text
docs(docs): update project documentation

- Description of the documentation change.
```

### Styles

Use this type only for visual or formatting changes that do not modify behavior.

```text
style(scope): update visual styles or code formatting

- Description of the style change.
```
