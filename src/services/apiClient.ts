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
  (error) => {
    const { showToast } = useToast()
    const status = error.response?.status

    if (status === 401) {
      // Redirect to login — stub for Phase 2 (EntraID)
      window.location.href = '/login'
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
