<script lang="ts">
  import { resolve } from '$app/paths'
  import ThemeToggle from '$lib/components/ThemeToggle.svelte'

  const { children } = $props()
</script>

<div class="app-shell">
  <header class="site-header glass" data-animate>
    <a class="brand" href={resolve('/')} aria-label="liaizon.ai home">
      <span class="brand-dot" aria-hidden="true"></span>
      <span>liaizon.ai</span>
    </a>

    <nav class="site-nav" aria-label="Primary">
      <a class="nav-link" href={resolve('/#features')}>Features</a>
      <a class="nav-link" href={resolve('/#roadmap')}>Roadmap</a>
      <a class="nav-link" href={resolve('/#build-notes')}>Build Notes</a>
    </nav>

    <div style="display:flex;gap:0.5rem;align-items:center;">
      <ThemeToggle />
      <a class="btn-quiet btn" href="https://svelte.dev/docs/kit">Docs</a>
    </div>
  </header>

  <main class="page-content">{@render children()}</main>

  <footer class="site-footer" id="build-notes">
    <p>Built with Svelte 5 · SvelteKit · Skeleton UI · Tailwind CSS v4 · TypeScript.</p>
  </footer>
</div>
