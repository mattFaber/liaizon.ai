<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { Tone } from './types'

  interface Props {
    tone?: Tone
    pill?: boolean
    class?: string
    children?: Snippet
  }

  const { tone = 'neutral', pill = true, class: className = '', children }: Props = $props()
</script>

<span class={`ui-badge tone-${tone} ${pill ? 'is-pill' : ''} ${className}`.trim()}>
  {#if children}
    {@render children()}
  {/if}
</span>
