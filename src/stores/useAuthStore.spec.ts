import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './useAuthStore'
import * as authService from '@/services/authService'

vi.mock('@/services/authService', () => ({
  fetchMe: vi.fn(),
  postLogout: vi.fn(),
}))

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with unauthenticated state', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.permissions).toEqual([])
    expect(store.hasPermission('film.add')).toBe(false)
  })

  it('fetches session and updates state when authenticated', async () => {
    vi.mocked(authService.fetchMe).mockResolvedValue({
      name: 'Stefan',
      permissions: ['film.add', 'bewertung.add'],
    })

    const store = useAuthStore()
    await store.fetchSession()

    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toBe('Stefan')
    expect(store.hasPermission('film.add')).toBe(true)
    expect(store.hasPermission('bewertung.openclose')).toBe(false)
  })

  it('clears state when fetchSession fails / returns null', async () => {
    vi.mocked(authService.fetchMe).mockResolvedValue(null)

    const store = useAuthStore()
    await store.fetchSession()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.permissions).toEqual([])
  })

  it('logs out and clears session state', async () => {
    vi.mocked(authService.fetchMe).mockResolvedValue({
      name: 'Stefan',
      permissions: ['film.add'],
    })
    vi.mocked(authService.postLogout).mockResolvedValue()

    const store = useAuthStore()
    await store.fetchSession()
    expect(store.isAuthenticated).toBe(true)

    await store.logout()

    expect(authService.postLogout).toHaveBeenCalled()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
})
