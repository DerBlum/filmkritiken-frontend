import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNavigationStore } from '../useNavigationStore'

describe('useNavigationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('saves and retrieves scroll position for routes', () => {
    const store = useNavigationStore()
    expect(store.getScrollPosition('/archiv')).toBeUndefined()

    store.saveScrollPosition('/archiv', 450)
    expect(store.getScrollPosition('/archiv')).toBe(450)

    store.saveScrollPosition('/', 120)
    expect(store.getScrollPosition('/')).toBe(120)

    store.clearScrollPosition('/archiv')
    expect(store.getScrollPosition('/archiv')).toBeUndefined()
  })

  it('resets archiv filters to default state', () => {
    const store = useNavigationStore()
    store.archivFilter.suche = 'Matrix'
    store.archivFilter.jahr = 2024
    store.archivFilter.beitragvon = 'Stefan'
    store.archivFilter.sortierung = 'beste'
    store.archivFilter.displayedCount = 30

    store.resetArchivFilters()

    expect(store.archivFilter.suche).toBe('')
    expect(store.archivFilter.jahr).toBeNull()
    expect(store.archivFilter.beitragvon).toBe('')
    expect(store.archivFilter.sortierung).toBe('neueste')
    expect(store.archivFilter.displayedCount).toBe(10)
  })
})
