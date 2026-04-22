<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    status?: string
    class?: string
    children?: Snippet
  }

  const { status = 'All changes saved', class: className = '', children }: Props = $props()
</script>

<footer class={`ui-bottom-bar ${className}`.trim()}>
  <p>{status}</p>
  {#if children}
    <div class="ui-bottom-bar-actions">
      {@render children()}
    </div>
  {/if}
</footer>
