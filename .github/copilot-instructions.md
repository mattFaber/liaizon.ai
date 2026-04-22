# liaizon.ai — Copilot Instructions

## Primary Agent

**RepoSavant** is the default agent for this repository.
Use it for all code changes, architecture questions, component work, and reviews.
Invoke it directly via the `@RepoSavant` handle in Copilot Chat, or by selecting it in agent mode.

## Repository Context

- **Stack**: Svelte 5 + SvelteKit 2 + TypeScript + Tailwind CSS v4 + Skeleton UI (Terminus theme)
- **Route shell**: `src/routes/+layout.svelte` → `src/lib/components/AppShell.svelte`
- **Main page**: `src/routes/+page.svelte` (hero, features, roadmap sections)
- **Shared components**: `AppShell.svelte`, `FeatureCard.svelte`, `ThemeToggle.svelte`
- **Global styles**: `src/routes/layout.css` — Tailwind v4 + Skeleton imports, design tokens, `rise`/`pulse` animations
- **Dark mode**: class-based via `html.dark`, toggled by `ThemeToggle.svelte`, persisted to `localStorage` key `theme-mode`

## Conventions

- Use Svelte 5 runes (`$props()`, `$state()`) — no legacy reactive declarations
- Reuse existing CSS classes and design tokens from `layout.css` before adding new ones
- TypeScript strict mode is active — all component props must be typed
- Run `npm run check` after any Svelte/TS change; run `npm run lint` after style/UI changes

## Key Scripts

| Script     | Command          |
| ---------- | ---------------- |
| Dev server | `npm run dev`    |
| Type check | `npm run check`  |
| Lint       | `npm run lint`   |
| Format     | `npm run format` |
| Build      | `npm run build`  |
