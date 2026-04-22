<script lang="ts">
  interface Props {
    id?: string
    name: string
    value?: string
    placeholder?: string
    rows?: number
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    class?: string
    oninput?: (event: Event) => void
  }

  let {
    id,
    name,
    value = $bindable(''),
    placeholder,
    rows = 4,
    required = false,
    disabled = false,
    readonly = false,
    class: className = '',
    oninput
  }: Props = $props()
</script>

<textarea
  {id}
  class={`ui-control ui-textarea ${className}`.trim()}
  {name}
  bind:value
  {placeholder}
  {rows}
  {required}
  {disabled}
  {readonly}
  {oninput}
></textarea>
