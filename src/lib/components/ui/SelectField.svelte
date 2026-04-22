<script lang="ts">
  import type { SelectOption } from './types'

  interface Props {
    id?: string
    name: string
    options: SelectOption[]
    value?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    class?: string
    onchange?: (event: Event) => void
  }

  let {
    id,
    name,
    options,
    value = $bindable(''),
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    class: className = '',
    onchange
  }: Props = $props()
</script>

<select
  {id}
  class={`ui-control ${className}`.trim()}
  {name}
  bind:value
  {required}
  {disabled}
  {onchange}
>
  <option value="" disabled>{placeholder}</option>
  {#each options as option (option.value)}
    <option value={option.value} disabled={option.disabled}>{option.label}</option>
  {/each}
</select>
