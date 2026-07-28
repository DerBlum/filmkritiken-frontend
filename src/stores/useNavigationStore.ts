import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FilterOptions } from '@/features/filmkritiken/types/filterOptions'

export interface ArchivFilterState {
  suche: string
  jahr: number | null
  beitragvon: string
  sortierung: 'neueste' | 'aelteste' | 'beste'
  displayedCount: number
}

export const useNavigationStore = defineStore('navigation', () => {
  const scrollPositions = ref<Record<string, number>>({})

  const archivFilter = ref<ArchivFilterState>({
    suche: '',
    jahr: null,
    beitragvon: '',
    sortierung: 'neueste',
    displayedCount: 10,
  })

  const backendFilterOptions = ref<FilterOptions | null>(null)

  function saveScrollPosition(routePath: string, y: number) {
    scrollPositions.value[routePath] = y
  }

  function getScrollPosition(routePath: string): number | undefined {
    return scrollPositions.value[routePath]
  }

  function clearScrollPosition(routePath: string) {
    delete scrollPositions.value[routePath]
  }

  function resetArchivFilters() {
    archivFilter.value = {
      suche: '',
      jahr: null,
      beitragvon: '',
      sortierung: 'neueste',
      displayedCount: 10,
    }
  }

  return {
    scrollPositions,
    archivFilter,
    backendFilterOptions,
    saveScrollPosition,
    getScrollPosition,
    clearScrollPosition,
    resetArchivFilters,
  }
})
