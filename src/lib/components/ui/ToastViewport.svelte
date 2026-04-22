<script lang="ts">
  import { onDestroy } from 'svelte'
  import Toast from './Toast.svelte'
  import type { ToastItem } from './types'
  import { toastStore } from './toast-store'

  let items = $state<ToastItem[]>([])

  const unsubscribe = toastStore.subscribe((state) => {
    items = state
  })

  onDestroy(() => {
    unsubscribe()
  })
</script>

<div class="ui-toast-viewport" aria-live="polite" aria-relevant="additions text">
  {#each items as toast (toast.id)}
    <Toast {toast} onclose={toastStore.removeToast} />
  {/each}
</div>
