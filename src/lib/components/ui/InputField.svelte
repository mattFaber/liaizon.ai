<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  type InputKind = 'text' | 'email' | 'phone'

  interface Props {
    id?: string
    name: string
    kind?: InputKind
    value?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    autocomplete?: HTMLInputAttributes['autocomplete']
    class?: string
    oninput?: (event: Event) => void
    onchange?: (event: Event) => void
  }

  let {
    id,
    name,
    kind = 'text',
    value = $bindable(''),
    placeholder,
    required = false,
    disabled = false,
    readonly = false,
    autocomplete,
    class: className = '',
    oninput,
    onchange
  }: Props = $props()

  const type = $derived(kind === 'phone' ? 'tel' : kind)
  const inputMode = $derived(kind === 'phone' ? 'tel' : kind === 'email' ? 'email' : 'text')
  const autoComplete = $derived<NonNullable<HTMLInputAttributes['autocomplete']>>(
    autocomplete ?? (kind === 'phone' ? 'tel' : kind === 'email' ? 'email' : 'off')
  )
</script>

<input
  {id}
  class={`ui-control ${className}`.trim()}
  {type}
  inputmode={inputMode}
  {name}
  bind:value
  {placeholder}
  {required}
  {disabled}
  {readonly}
  autocomplete={autoComplete}
  {oninput}
  {onchange}
/>
