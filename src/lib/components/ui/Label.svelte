<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    forId?: string
    required?: boolean
    disabled?: boolean
    class?: string
    children?: Snippet
  }

  const {
    forId,
    required = false,
    disabled = false,
    class: className = '',
    children
  }: Props = $props()
</script>

<label class={`ui-label ${disabled ? 'is-disabled' : ''} ${className}`.trim()} for={forId}>
  {#if children}
    {@render children()}
  {/if}
  {#if required}
    <span class="ui-required" aria-hidden="true">*</span>
    <span class="ui-sr-only">required</span>
  {/if}
</label>
