<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title?: string
    subtitle?: string
    sticky?: boolean
    class?: string
    children?: Snippet
  }

  const {
    title = 'Workspace',
    subtitle,
    sticky = true,
    class: className = '',
    children
  }: Props = $props()
</script>

<header class={`ui-topbar ${sticky ? 'is-sticky' : ''} ${className}`.trim()}>
  <div class="ui-topbar-main">
    <h2>{title}</h2>
    {#if subtitle}
      <p>{subtitle}</p>
    {/if}
  </div>
  {#if children}
    <div class="ui-topbar-actions">
      {@render children()}
    </div>
  {/if}
</header>
