<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { Size } from './types'

  type Variant = 'solid' | 'quiet' | 'icon'
  type NativeButtonType = 'button' | 'submit' | 'reset'

  interface Props {
    variant?: Variant
    size?: Size
    type?: NativeButtonType
    disabled?: boolean
    loading?: boolean
    ariaLabel?: string
    class?: string
    onclick?: (event: MouseEvent) => void
    children?: Snippet
  }

  const {
    variant = 'solid',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    ariaLabel,
    class: className = '',
    onclick,
    children
  }: Props = $props()

  const variantClass = $derived(
    variant === 'solid' ? 'btn-solid' : variant === 'quiet' ? 'btn-quiet' : 'btn-icon'
  )
  const sizeClass = $derived(size === 'sm' ? 'ui-btn-sm' : size === 'lg' ? 'ui-btn-lg' : '')
</script>

<button
  {type}
  class={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
  disabled={disabled || loading}
  aria-label={ariaLabel}
  aria-busy={loading}
  {onclick}
>
  {#if children}
    {@render children()}
  {/if}
</button>
