<script lang="ts">
  import type { Snippet } from 'svelte'
  import Label from './Label.svelte'

  interface Props {
    label: string
    forId: string
    hint?: string
    error?: string
    required?: boolean
    class?: string
    children?: Snippet
  }

  const {
    label,
    forId,
    hint,
    error,
    required = false,
    class: className = '',
    children
  }: Props = $props()
</script>

<div class={`ui-field ${className}`.trim()}>
  <Label {forId} {required}>{label}</Label>
  {#if children}
    {@render children()}
  {/if}
  {#if hint}
    <p class="ui-hint">{hint}</p>
  {/if}
  {#if error}
    <p class="ui-error">{error}</p>
  {/if}
</div>
