import { ref, reactive } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

let nextId = 0
const toasts = reactive<Toast[]>([])

export function useToast() {
  function showToast(message: string, type: ToastType = 'info', duration = 4000): void {
    const id = nextId++
    toasts.push({ id, message, type, duration })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id: number): void {
    const index = toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
