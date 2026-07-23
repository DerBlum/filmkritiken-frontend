import { ref } from 'vue'

/**
 * Auth-Stub für Phase 1.
 * In Phase 2 wird dieser Stub durch einen echten EntraID-Flow ersetzt.
 */
export function useAuth() {
  const isAuthenticated = ref(false)
  const user = ref<string | null>(null)
  const isAdmin = ref(false)

  return {
    isAuthenticated,
    user,
    isAdmin,
  }
}
