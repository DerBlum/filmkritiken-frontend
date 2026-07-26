import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchMe, postLogout } from '@/services/authService'
import { useToast } from '@/composables/useToast'

export type Permission = 'film.add' | 'bewertung.add' | 'bewertung.openclose'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(null)
  const permissions = ref<Permission[]>([])
  const { showToast } = useToast()

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => hasPermission('film.add'))

  function hasPermission(perm: Permission): boolean {
    return permissions.value.includes(perm)
  }

  async function fetchSession(): Promise<void> {
    const sessionData = await fetchMe()
    if (sessionData && sessionData.name) {
      user.value = sessionData.name
      permissions.value = (sessionData.permissions as Permission[]) || []
    } else {
      user.value = null
      permissions.value = []
    }
  }

  function login(returnUrl?: string): void {
    const baseUrl = import.meta.env.VITE_API_URL as string
    const currentPath = returnUrl || (window.location.pathname + window.location.search)
    const redirectParam = currentPath && currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''
    window.location.href = `${baseUrl}/auth/login${redirectParam}`
  }

  async function logout(): Promise<void> {
    try {
      await postLogout()
    } catch {
      // Ignoriere Netzwerkfehler beim Logout, leere lokal trotzdem
    } finally {
      user.value = null
      permissions.value = []
      showToast('Du wurdest abgemeldet.', 'info')
    }
  }

  return {
    user,
    permissions,
    isAuthenticated,
    isAdmin,
    hasPermission,
    fetchSession,
    login,
    logout,
  }
})
