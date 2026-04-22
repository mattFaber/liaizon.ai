import { writable } from 'svelte/store'
import type { ToastItem } from './types'

const DEFAULT_DURATION = 3500

function createToastStore () {
  const { subscribe, update } = writable<ToastItem[]>([])

  function addToast (item: Omit<ToastItem, 'id'>) {
    const id = `toast-${crypto.randomUUID()}`
    const next: ToastItem = {
      ...item,
      id,
      tone: item.tone ?? 'neutral',
      duration: item.duration ?? DEFAULT_DURATION
    }

    update((state) => [...state, next])
    return id
  }

  function removeToast (id: string) {
    update((state) => state.filter((item) => item.id !== id))
  }

  function clearToasts () {
    update(() => [])
  }

  return {
    subscribe,
    addToast,
    removeToast,
    clearToasts
  }
}

export const toastStore = createToastStore()
