import apiClient from '@/services/apiClient'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import type { FilterOptions } from '@/features/filmkritiken/types/filterOptions'
import { getDurchschnittsBewertung } from '@/features/filmkritiken/composables/useFilmkritiken'

export interface FetchFilmkritikenResponse {
  items: Filmkritik[]
  totalCount: number
}

/**
 * Lädt Filmkritiken vom Backend.
 * Unterstützt FilterOptions für Suche, Jahr, BeitragVon, Sortierung, Limit & Offset als Query-Parameter.
 */
export async function fetchFilmkritiken(options?: FilterOptions): Promise<FetchFilmkritikenResponse> {
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
 * Lädt eine einzelne Filmkritik anhand der ID.
 */
export async function fetchFilmkritikById(id: string): Promise<Filmkritik | null> {
  const { items } = await fetchFilmkritiken()
  return items.find((f) => f.id === id) ?? null
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
