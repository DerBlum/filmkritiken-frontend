import apiClient from '@/services/apiClient'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'

/**
 * Lädt alle Filmkritiken vom Backend.
 * Verwendet limit=100 — das Backend prüft kein Maximum.
 */
export async function fetchFilmkritiken(): Promise<Filmkritik[]> {
  const response = await apiClient.get<Filmkritik[]>('/api/filmkritiken', {
    params: { limit: 100 },
  })
  return response.data ?? []
}
