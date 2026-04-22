<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { NavItem } from './types'

  interface Props {
    label?: string
    items?: NavItem[]
    activeItemId?: string
    compact?: boolean
    class?: string
    onselect?: (item: NavItem) => void
    header?: Snippet
    footer?: Snippet
  }

  const {
    label = 'Section navigation',
    items = [],
    activeItemId,
    compact = false,
    class: className = '',
    onselect,
    header,
    footer
  }: Props = $props()

  function handleSelect (event: MouseEvent, item: NavItem) {
    if (item.disabled) {
      event.preventDefault()
      return
    }

    onselect?.(item)
  }
</script>

<aside class={`ui-sidenav ${compact ? 'is-compact' : ''} ${className}`.trim()} aria-label={label}>
  {#if header}
    <div class="ui-sidenav-header">{@render header()}</div>
  {/if}

  <nav class="ui-sidenav-nav" aria-label={label}>
    {#each items as item (item.id)}
      <a
        class={`ui-sidenav-link ${item.id === activeItemId ? 'is-active' : ''}`.trim()}
        href={item.href ?? '#'}
        title={compact ? item.label : undefined}
        aria-label={compact ? item.label : undefined}
        aria-current={item.id === activeItemId ? 'page' : undefined}
        aria-disabled={item.disabled}
        onclick={(event) => handleSelect(event, item)}
      >
        <span class="ui-sidenav-short" aria-hidden={!compact}>{item.label.slice(0, 1)}</span>
        <span class="ui-sidenav-label">{item.label}</span>
        {#if item.badge}
          <span class="ui-sidenav-badge">{item.badge}</span>
        {/if}
      </a>
    {/each}
  </nav>

  {#if footer}
    <div class="ui-sidenav-footer">{@render footer()}</div>
  {/if}
</aside>
