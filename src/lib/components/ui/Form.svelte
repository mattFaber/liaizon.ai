<script lang="ts">
  import type { Snippet } from 'svelte'

  type SubmitDataHandler = (payload: {
    formData: FormData
    submitter: HTMLElement | null
    event: SubmitEvent
  }) => void | Promise<void>

  interface Props {
    id?: string
    method?: 'POST' | 'GET'
    action?: string
    class?: string
    onsubmitdata?: SubmitDataHandler
    children?: Snippet
  }

  const {
    id,
    method = 'POST',
    action,
    class: className = '',
    onsubmitdata,
    children
  }: Props = $props()

  async function handleSubmit (event: SubmitEvent) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const submitter = (event.submitter as HTMLElement | null) ?? null
    const formData = new FormData(form, submitter as HTMLButtonElement | null)
    await onsubmitdata?.({ formData, submitter, event })
  }
</script>

<form {id} class={`ui-form ${className}`.trim()} {method} {action} onsubmit={handleSubmit}>
  {#if children}
    {@render children()}
  {/if}
</form>
