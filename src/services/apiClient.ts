import axios from 'axios'
import { useToast } from '@/composables/useToast'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response Interceptors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { showToast } = useToast()
    const status = error.response?.status
    const requestUrl = error.config?.url || ''

    if (status === 401) {
      // Still abfangen, wenn /auth/me 401 liefert (normal bei uneingeloggt)
      if (!requestUrl.includes('/auth/me')) {
        showToast('Deine Session ist abgelaufen.', 'error')
      }

      try {
        const { useAuthStore } = await import('@/stores/useAuthStore')
        const auth = useAuthStore()
        auth.$patch({ user: null, permissions: [] })
      } catch {
        // ignore
      }

      try {
        const routerModule = await import('@/router')
        const currentRoute = routerModule.default.currentRoute.value
        if (currentRoute.meta?.requiresAuth) {
          routerModule.default.push('/login')
        }
      } catch {
        // ignore
      }

      return Promise.reject(error)
    }

    if (status === 403) {
      showToast('Keine Berechtigung für diese Aktion.', 'error')
      return Promise.reject(error)
    }

    if (!status || status >= 500) {
      const message =
        error.response?.data?.message ??
        'Der Server ist gerade nicht erreichbar. Bitte versuche es später erneut.'
      showToast(message, 'error')
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default apiClient
