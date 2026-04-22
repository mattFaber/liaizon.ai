<script lang="ts">
  import { browser } from '$app/environment'
  import { resolve } from '$app/paths'
  import ThemeToggle from '$lib/components/ThemeToggle.svelte'
  import BottomBar from '$lib/components/ui/BottomBar.svelte'
  import SideNav from '$lib/components/ui/SideNav.svelte'
  import TopBar from '$lib/components/ui/TopBar.svelte'
  import type { NavItem } from '$lib/components/ui/types'
  import type { Snippet } from 'svelte'

  interface Props {
    title?: string
    subtitle?: string
    status?: string
    navItems?: NavItem[]
    activeItemId?: string
    children: Snippet
  }

  let {
    title = 'liaizon.ai Workspace',
    subtitle = 'C-Shell layout primitives: top bar, side nav, and bottom bar.',
    status = 'Shell ready',
    navItems = [
      { id: 'features', label: 'Features', href: resolve('/#features') },
      { id: 'roadmap', label: 'Roadmap', href: resolve('/#roadmap') },
      { id: 'ui-kit', label: 'UI Kit', href: resolve('/#ui-kit'), badge: 'New' },
      { id: 'build-notes', label: 'Build Notes', href: resolve('/#build-notes') }
    ],
    activeItemId = $bindable('features'),
    children
  }: Props = $props()

  const NAV_RAIL_STORAGE_KEY = 'c-shell-nav-compact'
  let navCompact = $state(false)

  if (browser) {
    navCompact = localStorage.getItem(NAV_RAIL_STORAGE_KEY) === '1'
  }

  function handleNavSelect (item: NavItem) {
    activeItemId = item.id
  }

  function persistNavRailState () {
    if (!browser) return
    localStorage.setItem(NAV_RAIL_STORAGE_KEY, navCompact ? '1' : '0')
  }

  function toggleNavRail () {
    navCompact = !navCompact
    persistNavRailState()
  }
</script>

<div class="c-shell-root">
  <div class="c-shell-top-region">
    <TopBar {title} {subtitle} sticky={false} class="c-shell-topbar">
      <button
        type="button"
        class="btn-quiet c-shell-rail-toggle btn"
        onclick={toggleNavRail}
        aria-pressed={navCompact}
        aria-label={navCompact ? 'Expand navigation rail' : 'Compact navigation rail'}
        title={navCompact ? 'Expand navigation rail' : 'Compact navigation rail'}
      >
        {navCompact ? 'Expand rail' : 'Compact rail'}
      </button>
      <ThemeToggle />
      <a class="btn-quiet btn" href="https://svelte.dev/docs/kit">Docs</a>
    </TopBar>
  </div>

  <div class="c-shell-main-region">
    <div class={`c-shell-body ${navCompact ? 'is-nav-compact' : ''}`.trim()}>
      <div class="c-shell-nav-region">
        <SideNav
          items={navItems}
          {activeItemId}
          onselect={handleNavSelect}
          compact={navCompact}
          class="c-shell-sidenav"
        >
          {#snippet header()}
            <a class="brand c-shell-brand" href={resolve('/')} aria-label="liaizon.ai home">
              <span class="brand-dot" aria-hidden="true"></span>
              <span>liaizon.ai</span>
            </a>
          {/snippet}
        </SideNav>
      </div>

      <main class="page-content c-shell-content">{@render children()}</main>
    </div>
  </div>

  <div id="build-notes" class="c-shell-bottom-region">
    <BottomBar {status} class="c-shell-bottombar">
      <a class="btn-quiet btn" href="https://skeleton.dev">Skeleton UI</a>
    </BottomBar>
  </div>
</div>
