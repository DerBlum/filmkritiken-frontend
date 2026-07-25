import { useAuthStore } from '@/stores/useAuthStore'

export type { Permission } from '@/stores/useAuthStore'

export function useAuth() {
  return useAuthStore()
}
