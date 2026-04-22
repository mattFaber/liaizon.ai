<script lang="ts">
  import type { DropdownItem } from './types'

  interface Props {
    name: string
    legend?: string
    options: DropdownItem[]
    value?: string
    required?: boolean
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
    class?: string
    onchange?: (value: string) => void
  }

  let {
    name,
    legend,
    options,
    value = $bindable(''),
    required = false,
    disabled = false,
    orientation = 'vertical',
    class: className = '',
    onchange
  }: Props = $props()

  function handleChange (next: string) {
    value = next
    onchange?.(next)
  }
</script>

<fieldset
  class={`ui-radio-group ${orientation === 'horizontal' ? 'is-horizontal' : ''} ${className}`.trim()}
>
  {#if legend}
    <legend>{legend}</legend>
  {/if}
  {#each options as option (option.value)}
    <label class={`ui-radio-wrap ${option.disabled || disabled ? 'is-disabled' : ''}`.trim()}>
      <input
        type="radio"
        {name}
        value={option.value}
        checked={value === option.value}
        required={required && !value}
        disabled={disabled || option.disabled}
        onchange={() => handleChange(option.value)}
      />
      <span>{option.label}</span>
    </label>
  {/each}
</fieldset>
