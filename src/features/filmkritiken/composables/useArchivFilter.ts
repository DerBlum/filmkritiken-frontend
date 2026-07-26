import { ref, computed, watch } from 'vue'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import type { FilterOptions } from '@/features/filmkritiken/types/filterOptions'
import { getDurchschnittsBewertung } from '@/features/filmkritiken/composables/useFilmkritiken'

export function useArchivFilter(allFilmkritiken: { value: Filmkritik[] }) {
  const suche = ref<string>('')
  const jahr = ref<number | null>(null)
  const beitragvon = ref<string>('')
  const sortierung = ref<'neueste' | 'aelteste' | 'beste'>('neueste')

  const pageSize = 12
  const displayedCount = ref<number>(pageSize)

  // Reset pagination whenever filter options change
  watch([suche, jahr, beitragvon, sortierung], () => {
    displayedCount.value = pageSize
  })

  // Extract unique discussion years from dataset for dropdown
  const verfuegbareJahre = computed<number[]>(() => {
    const jahre = allFilmkritiken.value
      .map((f) => {
        if (!f.details.besprochenam) return null
        const d = new Date(f.details.besprochenam)
        return isNaN(d.getTime()) ? null : d.getFullYear()
      })
      .filter((j): j is number => j !== null)
    return Array.from(new Set(jahre)).sort((a, b) => b - a)
  })

  // Extract unique contributors from dataset for dropdown
  const verfuegbareBeitragende = computed<string[]>(() => {
    const beitragende = allFilmkritiken.value
      .map((f) => f.details.beitragvon)
      .filter((b): b is string => Boolean(b && b.trim() !== ''))
    return Array.from(new Set(beitragende)).sort((a, b) => a.localeCompare(b))
  })

  // Filtered and sorted list
  const filteredFilmkritiken = computed<Filmkritik[]>(() => {
    let result = [...allFilmkritiken.value]

    // Title & Original Title search
    if (suche.value.trim() !== '') {
      const q = suche.value.trim().toLowerCase()
      result = result.filter(
        (f) =>
          f.film.titel.toLowerCase().includes(q) ||
          Boolean(f.film.originaltitel && f.film.originaltitel.toLowerCase().includes(q))
      )
    }

    // Year filter (Besprechungsjahr)
    if (jahr.value !== null) {
      result = result.filter((f) => {
        if (!f.details.besprochenam) return false
        const d = new Date(f.details.besprochenam)
        return !isNaN(d.getTime()) && d.getFullYear() === jahr.value
      })
    }

    // Contributor filter
    if (beitragvon.value.trim() !== '') {
      const b = beitragvon.value.trim().toLowerCase()
      result = result.filter((f) => f.details.beitragvon?.toLowerCase() === b)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortierung.value === 'neueste') {
        const da = a.details.besprochenam ? new Date(a.details.besprochenam).getTime() : 0
        const db = b.details.besprochenam ? new Date(b.details.besprochenam).getTime() : 0
        return db - da
      }
      if (sortierung.value === 'aelteste') {
        const da = a.details.besprochenam ? new Date(a.details.besprochenam).getTime() : Infinity
        const db = b.details.besprochenam ? new Date(b.details.besprochenam).getTime() : Infinity
        return da - db
      }
      if (sortierung.value === 'beste') {
        const avgA = getDurchschnittsBewertung(a) ?? -1
        const avgB = getDurchschnittsBewertung(b) ?? -1
        return avgB - avgA
      }
      return 0
    })

    return result
  })

  // Paginated visible items
  const paginatedFilmkritiken = computed<Filmkritik[]>(() => {
    return filteredFilmkritiken.value.slice(0, displayedCount.value)
  })

  // Check if there are more items to load
  const hasMore = computed<boolean>(() => {
    return displayedCount.value < filteredFilmkritiken.value.length
  })

  function loadMore(): void {
    if (hasMore.value) {
      displayedCount.value += pageSize
    }
  }

  const isFilterActive = computed<boolean>(() => {
    return (
      suche.value.trim() !== '' ||
      jahr.value !== null ||
      beitragvon.value.trim() !== '' ||
      sortierung.value !== 'neueste'
    )
  })

  function resetFilters(): void {
    suche.value = ''
    jahr.value = null
    beitragvon.value = ''
    sortierung.value = 'neueste'
    displayedCount.value = pageSize
  }

  return {
    suche,
    jahr,
    beitragvon,
    sortierung,
    verfuegbareJahre,
    verfuegbareBeitragende,
    filteredFilmkritiken,
    paginatedFilmkritiken,
    hasMore,
    isFilterActive,
    loadMore,
    resetFilters,
  }
}
