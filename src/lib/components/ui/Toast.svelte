<script lang="ts">
  import { onMount } from 'svelte'
  import type { ToastItem } from './types'

  interface Props {
    toast: ToastItem
    onclose?: (id: string) => void
  }

  const { toast, onclose }: Props = $props()

  onMount(() => {
    const timeout = window.setTimeout(() => {
      onclose?.(toast.id)
    }, toast.duration ?? 3500)
    return () => window.clearTimeout(timeout)
  })
</script>

<article class={`ui-toast tone-${toast.tone ?? 'neutral'}`.trim()} aria-live="polite">
  <div>
    <p class="ui-toast-title">{toast.title}</p>
    {#if toast.description}
      <p class="ui-toast-copy">{toast.description}</p>
    {/if}
  </div>
  <button
    type="button"
    class="ui-toast-close"
    aria-label="Dismiss"
    onclick={() => onclose?.(toast.id)}>×</button
  >
</article>
