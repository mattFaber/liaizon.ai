# Coding Standards

This document defines formatting, code style, and organizational conventions for the liaizon.ai project.

## Automated Enforcement

All standards are enforced via:

- **Prettier** – code formatting
- **ESLint** – code quality and Svelte-specific rules
- **Svelte Check** – type safety and Svelte semantics
- **TypeScript** – strict static type checking

Run checks locally before committing:

```sh
npm run check   # Type check
npm run lint    # ESLint checks
npm run format  # Auto-fix formatting
npm run format:check # Check Prettier formatting
```

## Formatting & Whitespace

### General

- **Line length:** 100 characters (Prettier default)
- **Indent:** 2 spaces (no tabs)
- **Trailing commas:** none
- **Quotes:** single quotes for strings
- **Semicolons:** never (auto-removed by Prettier)
- **Arrow functions:** parentheses always used for single parameters (`(x) => x + 1`)
- **Function definitions:** require a space before `(` (`function myFn (arg) {}`)
- **Note:** this function-spacing rule is enforced by ESLint, even though Prettier's default output differs.

```ts
function myFunctionName(params: string) {
  return params.trim()
}

const myOtherFunction = function (params: string) {
  return params.toUpperCase()
}
```

### JSON/YAML

- 2-space indentation
- No trailing commas in JSON
- Newline at end of file

### Markdown

- 80-character line wrap (soft wrap in editors)
- Consistent heading hierarchy (no skipped levels)
- Code blocks with language tags

## TypeScript

### Strictness

- `strict: true` in `tsconfig.json`
- All parameters, returns, and assignments must be explicitly typed
- No `any` type; use `unknown` if type cannot be inferred

### Conventions

- Use `type` for interfaces / shape definitions
- Use `interface` only when extending or merging is needed
- Prefer const assertions for readonly collections: `as const`
- Null-coalescing (`??`) over logical OR (`||`) for falsy checks
- Use explicit union types instead of `boolean` flags where possible

### Imports

- Absolute imports using `$lib`, `$app`, `$env` aliases (SvelteKit convention)
- Relative imports only within the same module
- Group imports: Node built-ins, third-party, local, types

```ts
// Standard import order
import path from 'node:path'
import { writable } from 'svelte/store'
import { Button, Badge } from '$lib/components/ui'
import type { User } from '$lib/types'
```

## Svelte 5

### Runes

- Use `$props()` for reactive component props (never `export let`)
- Use `$state()` for local reactive state
- Use `$derived` for computed values
- Use `$derived.by()` for complex computations
- Destructure props with type annotation in $props():

```svelte
<script lang="ts">
  interface Props {
    title: string
    disabled?: boolean
    onclick?: (e: MouseEvent) => void
  }
  const { title, disabled = false, onclick } = $props()
</script>
```

### Component Structure

1. Script block (types, state, logic)
2. Markup (HTML/slots)
3. CSS (scoped styles only)

### Naming

- Components use PascalCase (`Button.svelte`, `FormField.svelte`)
- Event handlers: `on{EventName}` (e.g., `onclick`, `onsubmit`)
- Callback props: no `on` prefix, just function name (e.g., `onselect`, `onchange`)
- Internal functions: camelCase with `handle` prefix (e.g., `handleClick`)

## Naming Conventions

### Files & Directories

- Components: PascalCase (e.g., `Button.svelte`, `FormField.svelte`)
- Utilities/modules: camelCase (e.g., `firestore.ts`, `validators.ts`)
- Routes: kebab-case or `+page.svelte` (SvelteKit convention)
- Collections: lowercase (e.g., `submissions_v1`)

### Variables & Functions

- Constants: `SCREAMING_SNAKE_CASE` or `camelCase` (depending on scope)
- Functions: `camelCase` with verb prefix where appropriate (`handleSubmit`, `fetchUser`)
- Private/internal: prefix with underscore (`_internal`, `__dev`)
- Booleans: `is`/`has`/`should` prefix (e.g., `isOpen`, `hasError`, `shouldRender`)

### CSS Classes

- BEM-lite: `.component-name`, `.component-name__element`, `.component-name--modifier`
- Utility-first with Tailwind
- Custom tokens: `--token-name` (e.g., `--radius`, `--shadow`)

## Code Organization

### Component Props

Always use a typed `Props` interface and destructure in `$props()`:

```svelte
<script lang="ts">
  import type { Size } from './types'

  interface Props {
    label: string
    size?: Size
    disabled?: boolean
    class?: string
    onclick?: (e: MouseEvent) => void
  }

  const { label, size = 'md', disabled = false, class: className = '', onclick } = $props()
</script>
```

### Event Handlers

- Accept only event as parameter (destructure in handler body if needed)
- Validate and return early if checks fail
- Delegate to callbacks or store methods

```ts
function handleFormSubmit(event: SubmitEvent) {
  event.preventDefault()
  const form = event.currentTarget as HTMLFormElement
  const data = new FormData(form)
  onsubmit?.(data)
}
```

### Error Handling

- Prefer explicit error returns over exceptions for expected failures
- Use try/catch for unexpected runtime errors
- Log errors to console in dev; report via observability in prod
- Return structured error objects with `ok` and `errors` fields for API routes

## Comments & Documentation

- Self-documenting code first; comments for _why_, not _what_
- JSDoc comments for public functions/exports
- Inline comments for complex logic only
- No commented-out code (use git history)

```ts
// Good: explains intent
const debounceMs = 180 // Balance responsiveness with server load

// Avoid: restates code
const x = Math.max(0, value) // Get max of 0 and value
```

## Git Workflow

- Commit message format: `type(scope): description`
  - `feat(auth): add login form`
  - `fix(firestore): handle missing field`
  - `docs(readme): update setup steps`
  - `style(css): refactor button padding`
- Keep commits atomic (one logical change per commit)
- Ensure all checks pass before pushing

## CI/CD Checks

All PRs must pass:

```sh
npm run check   # Type safety
npm run lint    # Code quality + style rules
npm run format:check # Prettier formatting check
npm run build   # Production build
```

Failures block merges. Fix locally and push again.

## Configuration Files

- `.prettierrc` – code formatter
- `.eslintignore` – ESLint exceptions
- `eslint.config.js` – ESLint rules
- `tsconfig.json` – TypeScript compiler options
- `svelte.config.js` – SvelteKit compiler + adapter options

All are tracked in git; changes require team consensus.

## Deviations

If a standard conflicts with project requirements or tooling limitations, document the exception in the relevant file's README or code comment and notify the team.
