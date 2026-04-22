<script lang="ts">
  import { onMount } from 'svelte'
  import type { DropdownItem } from './types'

  interface Props {
    id?: string
    label?: string
    items: DropdownItem[]
    open?: boolean
    class?: string
    onselect?: (item: DropdownItem) => void
  }

  let {
    id,
    label = 'Open menu',
    items,
    open = $bindable(false),
    class: className = '',
    onselect
  }: Props = $props()

  const internalId = $props.id()
  const dropdownId = $derived(id ?? `dropdown-${internalId}`)

  function toggle () {
    open = !open
  }

  function close () {
    open = false
  }

  function selectItem (item: DropdownItem) {
    if (item.disabled) return
    onselect?.(item)
    close()
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close()
    }
  }

  onMount(() => {
    function handleWindowClick (event: MouseEvent) {
      const target = event.target as Element | null
      if (!target?.closest(`[data-dropdown-root='${dropdownId}']`)) close()
    }

    window.addEventListener('click', handleWindowClick)
    return () => window.removeEventListener('click', handleWindowClick)
  })
</script>

<div class={`ui-dropdown ${className}`.trim()} data-dropdown-root={dropdownId}>
  <button
    id={dropdownId}
    type="button"
    class="btn-quiet ui-dropdown-trigger btn"
    onclick={toggle}
    onkeydown={onKeydown}
    aria-haspopup="menu"
    aria-expanded={open}
  >
    {label}
  </button>

  {#if open}
    <ul class="ui-dropdown-menu" role="menu">
      {#each items as item (item.value)}
        <li>
          <button
            type="button"
            role="menuitem"
            class="ui-dropdown-item"
            disabled={item.disabled}
            onclick={() => selectItem(item)}
          >
            {item.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
