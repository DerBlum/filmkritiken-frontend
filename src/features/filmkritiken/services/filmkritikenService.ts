import apiClient from '@/services/apiClient'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import type { FilterOptions } from '@/features/filmkritiken/types/filterOptions'
import { getDurchschnittsBewertung } from '@/features/filmkritiken/composables/useFilmkritiken'

export interface FilmkritikenQueryOptions {
  suche?: string
  jahr?: number | null
  beitragvon?: string
  sortierung?: 'neueste' | 'aelteste' | 'beste'
  limit?: number
  offset?: number
}

export interface FetchFilmkritikenResponse {
  items: Filmkritik[]
  totalCount: number
}

/**
 * Lädt verfügbare Filter-Optionen (Jahre und Beitragende) vom Backend.
 */
export async function fetchFilterOptions(): Promise<FilterOptions> {
  const response = await apiClient.get<FilterOptions>('/api/filmkritiken/filter-options')
  return response.data
}

/**
 * Lädt Filmkritiken vom Backend.
 * Unterstützt Filter-Optionen für Suche, Jahr, BeitragVon, Sortierung, Limit & Offset als Query-Parameter.
 */
export async function fetchFilmkritiken(options?: FilmkritikenQueryOptions): Promise<FetchFilmkritikenResponse> {
  const params: Record<string, string | number> = {}

  if (options) {
    if (options.suche && options.suche.trim() !== '') {
      params.suche = options.suche.trim()
    }
    if (options.jahr !== undefined && options.jahr !== null) {
      params.jahr = options.jahr
    }
    if (options.beitragvon && options.beitragvon.trim() !== '') {
      params.beitragvon = options.beitragvon.trim()
    }
    if (options.sortierung) {
      params.sortierung = options.sortierung
    }
    if (options.limit !== undefined && options.limit > 0) {
      params.limit = options.limit
    }
    if (options.offset !== undefined && options.offset >= 0) {
      params.offset = options.offset
    }
  }

  const response = await apiClient.get<FetchFilmkritikenResponse>('/api/filmkritiken', { params })
  if (response.data && Array.isArray(response.data.items)) {
    return {
      items: response.data.items,
      totalCount: response.data.totalCount ?? response.data.items.length,
    }
  }

  // Fallback if backend returns array
  const rawArray = Array.isArray(response.data) ? (response.data as unknown as Filmkritik[]) : []
  return {
    items: rawArray,
    totalCount: rawArray.length,
  }
}

/**
 * Lädt eine einzelne Filmkritik anhand der ID vom Backend.
 */
export async function fetchFilmkritikById(id: string): Promise<Filmkritik | null> {
  try {
    const response = await apiClient.get<Filmkritik>(`/api/filmkritiken/${encodeURIComponent(id)}`)
    return response.data ?? null
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const resp = (err as { response?: { status?: number } }).response
      if (resp?.status === 404) {
        return null
      }
    }
    throw err
  }
}

/**
 * Sendet eine Bewertung oder Enthaltung für eine Filmkritik.
 */
export async function submitBewertung(
  id: string,
  username: string,
  payload: { wertung?: number; enthaltung?: boolean }
): Promise<void> {
  const body = {
    filmkritikenId: id,
    ...payload,
  }
  await apiClient.put(
    `/api/filmkritiken/${encodeURIComponent(id)}/bewertungen/${encodeURIComponent(username)}`,
    body
  )
}

/**
 * Öffnet oder schließt die Bewertungsmöglichkeit für eine Filmkritik.
 */
export async function updateBewertungOffen(id: string, offen: boolean): Promise<void> {
  await apiClient.patch(
    `/api/filmkritiken/${encodeURIComponent(id)}/bewertungenoffen/${offen}`
  )
}
