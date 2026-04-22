<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    text: string
    position?: 'top' | 'right' | 'bottom' | 'left'
    class?: string
    children?: Snippet
  }

  const { text, position = 'top', class: className = '', children }: Props = $props()
  let open = $state(false)
  const tooltipBaseId = $props.id()
  const tooltipId = `tooltip-${tooltipBaseId}`
</script>

<span
  class={`ui-tooltip-wrap ${className}`.trim()}
  role="group"
  onmouseenter={() => (open = true)}
  onmouseleave={() => (open = false)}
  onfocusin={() => (open = true)}
  onfocusout={() => (open = false)}
>
  {#if children}
    {@render children()}
  {/if}
  {#if open}
    <span id={tooltipId} role="tooltip" class={`ui-tooltip ui-tooltip-${position}`.trim()}
      >{text}</span
    >
  {/if}
</span>
