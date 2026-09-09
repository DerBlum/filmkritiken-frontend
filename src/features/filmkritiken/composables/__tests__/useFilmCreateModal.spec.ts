import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFilmCreateModal } from '../useFilmCreateModal'

describe('useFilmCreateModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const { closeModal } = useFilmCreateModal()
    closeModal()
  })

  it('rejects openModal if user lacks film.add permission', () => {
    const authStore = useAuthStore()
    authStore.permissions = []

    const { isOpen, openModal } = useFilmCreateModal()
    expect(isOpen.value).toBe(false)

    const opened = openModal()
    expect(opened).toBe(false)
    expect(isOpen.value).toBe(false)
  })

  it('allows openModal if user has film.add permission', () => {
    const authStore = useAuthStore()
    authStore.permissions = ['film.add']

    const { isOpen, openModal, closeModal } = useFilmCreateModal()
    expect(isOpen.value).toBe(false)

    const opened = openModal()
    expect(opened).toBe(true)
    expect(isOpen.value).toBe(true)

    closeModal()
    expect(isOpen.value).toBe(false)
  })
})
