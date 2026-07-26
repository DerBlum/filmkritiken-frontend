import apiClient from '@/services/apiClient'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import type { FilterOptions } from '@/features/filmkritiken/types/filterOptions'
import { getDurchschnittsBewertung } from '@/features/filmkritiken/composables/useFilmkritiken'

/**
 * Lädt Filmkritiken vom Backend.
 * Unterstüzt FilterOptions für Suche, Jahr, BeitragVon und Sortierung.
 */
export async function fetchFilmkritiken(options?: FilterOptions): Promise<Filmkritik[]> {
  const response = await apiClient.get<Filmkritik[]>('/api/filmkritiken', {
    params: { limit: 100 },
  })
  let result = response.data ?? []

  // TODO(Phase3-Backend): Ersetzen durch Query-Params wenn Backend-Ticket-05 fertig
  if (options) {
    if (options.suche && options.suche.trim() !== '') {
      const query = options.suche.trim().toLowerCase()
      result = result.filter((f) => f.film.titel.toLowerCase().includes(query))
    }

    if (options.jahr !== undefined && options.jahr !== null) {
      result = result.filter((f) => f.film.erscheinungsjahr === options.jahr)
    }

    if (options.beitragvon && options.beitragvon.trim() !== '') {
      const beitragQuery = options.beitragvon.trim().toLowerCase()
      result = result.filter(
        (f) => f.details.beitragvon?.toLowerCase() === beitragQuery
      )
    }

    if (options.sortierung) {
      result = [...result].sort((a, b) => {
        if (options.sortierung === 'neueste') {
          const da = a.details.besprochenam ? new Date(a.details.besprochenam).getTime() : 0
          const db = b.details.besprochenam ? new Date(b.details.besprochenam).getTime() : 0
          return db - da
        }
        if (options.sortierung === 'aelteste') {
          const da = a.details.besprochenam ? new Date(a.details.besprochenam).getTime() : Infinity
          const db = b.details.besprochenam ? new Date(b.details.besprochenam).getTime() : Infinity
          return da - db
        }
        if (options.sortierung === 'beste') {
          const avgA = getDurchschnittsBewertung(a) ?? -1
          const avgB = getDurchschnittsBewertung(b) ?? -1
          return avgB - avgA
        }
        return 0
      })
    }
  }

  return result
}

/**
 * Lädt eine einzelne Filmkritik anhand der ID.
 */
export async function fetchFilmkritikById(id: string): Promise<Filmkritik | null> {
  // TODO(Phase3-Backend): Ersetzen durch GET /api/filmkritiken/{id} wenn Backend-Ticket-05 fertig
  const alle = await fetchFilmkritiken()
  return alle.find((f) => f.id === id) ?? null
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
