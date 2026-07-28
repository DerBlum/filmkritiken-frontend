import { ref, computed, watch, onMounted } from 'vue'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import type { FilterOptions } from '@/features/filmkritiken/types/filterOptions'
import { getDurchschnittsBewertung } from '@/features/filmkritiken/composables/useFilmkritiken'
import { fetchFilmkritiken, fetchFilterOptions } from '@/features/filmkritiken/services/filmkritikenService'
import { useNavigationStore } from '@/stores/useNavigationStore'

export function useArchivFilter(allFilmkritiken?: { value: Filmkritik[] }) {
  const isBackend = !allFilmkritiken
  const navStore = isBackend ? useNavigationStore() : null

  const suche = ref<string>(navStore ? navStore.archivFilter.suche : '')
  const jahr = ref<number | null>(navStore ? navStore.archivFilter.jahr : null)
  const beitragvon = ref<string>(navStore ? navStore.archivFilter.beitragvon : '')
  const sortierung = ref<'neueste' | 'aelteste' | 'beste'>(
    navStore ? navStore.archivFilter.sortierung : 'neueste'
  )

  const pageSize = 10
  const displayedCount = ref<number>(navStore ? navStore.archivFilter.displayedCount : pageSize)

  const backendFilme = ref<Filmkritik[]>([])
  const totalCount = ref<number>(0)
  const isLoading = ref<boolean>(false)
  const hasMoreBackend = ref<boolean>(true)
  const fallbackFilterOptions = ref<FilterOptions | null>(null)

  // Sync with navigation store
  watch([suche, jahr, beitragvon, sortierung, displayedCount], () => {
    if (navStore) {
      navStore.archivFilter.suche = suche.value
      navStore.archivFilter.jahr = jahr.value
      navStore.archivFilter.beitragvon = beitragvon.value
      navStore.archivFilter.sortierung = sortierung.value
      navStore.archivFilter.displayedCount = displayedCount.value
    }
  })

  async function loadFilterOptionsData() {
    if (!isBackend) return
    try {
      const opts = await fetchFilterOptions()
      if (navStore) {
        navStore.backendFilterOptions = opts
      } else {
        fallbackFilterOptions.value = opts
      }
    } catch (err) {
      console.error('Fehler beim Laden der Filter-Optionen:', err)
    }
  }

  async function loadBackendData() {
    if (!isBackend) return
    isLoading.value = true
    try {
      const res = await fetchFilmkritiken({
        suche: suche.value,
        jahr: jahr.value,
        beitragvon: beitragvon.value,
        sortierung: sortierung.value,
        limit: displayedCount.value,
      })
      backendFilme.value = res.items
      totalCount.value = res.totalCount
      hasMoreBackend.value = res.items.length < res.totalCount
    } catch (err) {
      console.error('Fehler beim Laden der gefilterten Filmkritiken:', err)
    } finally {
      isLoading.value = false
    }
  }

  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

  // Watch title search with 500ms debounce
  watch(suche, () => {
    if (isBackend) {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer)
      }
      searchDebounceTimer = setTimeout(() => {
        loadBackendData()
      }, 500)
    }
  })

  // Watch select/dropdown filters immediately
  watch([jahr, beitragvon, sortierung], () => {
    if (isBackend) {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer)
      }
      loadBackendData()
    }
  })

  watch(displayedCount, () => {
    if (isBackend) {
      loadBackendData()
    }
  })

  if (isBackend) {
    onMounted(() => {
      loadFilterOptionsData()
      loadBackendData()
    })
  }

  const sourceList = computed(() => (allFilmkritiken ? allFilmkritiken.value : backendFilme.value))

  // Extract unique discussion years from backend options or dataset fallback
  const verfuegbareJahre = computed<number[]>(() => {
    const opts = navStore?.backendFilterOptions || fallbackFilterOptions.value
    if (isBackend && opts && Array.isArray(opts.jahre) && opts.jahre.length > 0) {
      return opts.jahre
    }
    const jahre = sourceList.value
      .map((f) => {
        if (!f.details.besprochenam) return null
        const d = new Date(f.details.besprochenam)
        return isNaN(d.getTime()) ? null : d.getFullYear()
      })
      .filter((j): j is number => j !== null)
    return Array.from(new Set(jahre)).sort((a, b) => b - a)
  })

  // Extract unique contributors from backend options or dataset fallback
  const verfuegbareBeitragende = computed<string[]>(() => {
    const opts = navStore?.backendFilterOptions || fallbackFilterOptions.value
    if (isBackend && opts && Array.isArray(opts.beitragende) && opts.beitragende.length > 0) {
      return opts.beitragende
    }
    const beitragende = sourceList.value
      .map((f) => f.details.beitragvon)
      .filter((b): b is string => Boolean(b && b.trim() !== ''))
    return Array.from(new Set(beitragende)).sort((a, b) => a.localeCompare(b))
  })

  // Filtered and sorted list
  const filteredFilmkritiken = computed<Filmkritik[]>(() => {
    if (isBackend) {
      return backendFilme.value
    }

    let result = [...sourceList.value]

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
    if (isBackend) {
      return backendFilme.value
    }
    return filteredFilmkritiken.value.slice(0, displayedCount.value)
  })

  // Check if there are more items to load
  const hasMore = computed<boolean>(() => {
    if (isBackend) {
      return hasMoreBackend.value
    }
    return displayedCount.value < filteredFilmkritiken.value.length
  })

  function loadMore(): void {
    displayedCount.value += pageSize
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
    if (navStore) {
      navStore.resetArchivFilters()
    }
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
    totalCount,
    isFilterActive,
    isLoading,
    loadMore,
    resetFilters,
    reload: loadBackendData,
  }
}
