<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import Button from './Button.svelte'
  import InputField from './InputField.svelte'

  interface Props {
    id?: string
    name?: string
    value?: string
    label?: string
    placeholder?: string
    submitLabel?: string
    clearLabel?: string
    disabled?: boolean
    clearable?: boolean
    searchOnInput?: boolean
    debounceMs?: number
    keyboardShortcut?: string
    clearOnEscape?: boolean
    minQueryLength?: number
    class?: string
    onsearch?: (query: string) => void
  }

  let {
    id,
    name = 'search',
    value = $bindable(''),
    label = 'Search',
    placeholder = 'Search…',
    submitLabel = 'Search',
    clearLabel = 'Clear',
    disabled = false,
    clearable = true,
    searchOnInput = false,
    debounceMs = 180,
    keyboardShortcut = '/',
    clearOnEscape = true,
    minQueryLength = 0,
    class: className = '',
    onsearch
  }: Props = $props()

  const inputId = $derived(id ?? `${name}-input`)
  const normalizedMinQueryLength = $derived(Math.max(0, minQueryLength))
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  function handleSubmit (event: SubmitEvent) {
    event.preventDefault()
    clearDebounce()
    dispatchSearch(value)
  }

  function handleClear () {
    value = ''
    clearDebounce()
    onsearch?.('')
  }

  function clearDebounce () {
    if (!debounceTimeout) return
    clearTimeout(debounceTimeout)
    debounceTimeout = null
  }

  function handleInput () {
    if (!searchOnInput || disabled) return
    clearDebounce()
    debounceTimeout = setTimeout(
      () => {
        dispatchSearch(value)
        debounceTimeout = null
      },
      Math.max(0, debounceMs)
    )
  }

  function dispatchSearch (rawQuery: string) {
    const query = rawQuery.trim()
    if (query.length === 0 || query.length >= normalizedMinQueryLength) {
      onsearch?.(query)
    }
  }

  function focusInput () {
    const element = document.getElementById(inputId)
    if (!(element instanceof HTMLInputElement)) return
    element.focus()
    element.select()
  }

  function shouldIgnoreShortcut (target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false
    if (target.isContentEditable) return true
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  }

  function isSearchInputFocused () {
    return (
      document.activeElement instanceof HTMLInputElement && document.activeElement.id === inputId
    )
  }

  onMount(() => {
    function handleKeydown (event: KeyboardEvent) {
      if (event.defaultPrevented || disabled) return

      if (clearOnEscape && event.key === 'Escape' && isSearchInputFocused()) {
        event.preventDefault()
        handleClear()
        return
      }

      if (!keyboardShortcut || event.metaKey || event.ctrlKey || event.altKey) return
      if (shouldIgnoreShortcut(event.target)) return
      if (event.key.toLowerCase() !== keyboardShortcut.toLowerCase()) return

      event.preventDefault()
      focusInput()
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })

  onDestroy(() => {
    clearDebounce()
  })
</script>

<form class={`ui-search ${className}`.trim()} role="search" onsubmit={handleSubmit}>
  <label class="ui-sr-only" for={inputId}>{label}</label>
  <InputField
    id={inputId}
    {name}
    kind="text"
    bind:value
    {placeholder}
    {disabled}
    oninput={handleInput}
    class="ui-search-input"
  />
  <Button type="submit" size="sm" variant="solid" {disabled}>{submitLabel}</Button>
  {#if clearable && value.trim().length > 0}
    <Button type="button" size="sm" variant="quiet" onclick={handleClear} {disabled}>
      {clearLabel}
    </Button>
  {/if}
</form>
