<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    id?: string
    name: string
    value?: string
    checked?: boolean
    required?: boolean
    disabled?: boolean
    class?: string
    onchange?: (event: Event) => void
    children?: Snippet
  }

  let {
    id,
    name,
    value = 'on',
    checked = $bindable(false),
    required = false,
    disabled = false,
    class: className = '',
    onchange,
    children
  }: Props = $props()
</script>

<label class={`ui-check-wrap ${disabled ? 'is-disabled' : ''} ${className}`.trim()}>
  <input
    {id}
    class="ui-checkbox"
    type="checkbox"
    {name}
    bind:checked
    {value}
    {required}
    {disabled}
    {onchange}
  />
  <span>
    {#if children}
      {@render children()}
    {/if}
  </span>
</label>
