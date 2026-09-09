import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const isOpen = ref(false)

export function useFilmCreateModal() {
  const authStore = useAuthStore()

  function openModal(): boolean {
    if (!authStore.canAddFilm) {
      return false
    }
    isOpen.value = true
    return true
  }

  function closeModal(): void {
    isOpen.value = false
  }

  return {
    isOpen,
    openModal,
    closeModal,
  }
}
