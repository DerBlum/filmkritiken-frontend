import { ref, onMounted } from 'vue'
import { fetchFilmkritiken } from '@/features/filmkritiken/services/filmkritikenService'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'

// ─────────────────────────────────────────────
// Helper Functions (exported for reuse)
// ─────────────────────────────────────────────

/**
 * Hilfsfunktionen zum Auslesen von Details-Feldern
 */
export function getBesprochenAm(filmkritik: Filmkritik): string | null {
  return filmkritik.details?.besprochenam ?? null
}

export function getBeitragVon(filmkritik: Filmkritik): string | null {
  return filmkritik.details?.beitragvon ?? null
}

export function isBewertungOffen(filmkritik: Filmkritik): boolean {
  return filmkritik.details?.bewertungoffen ?? false
}

/**
 * Gibt den nächsten Film zurück: frühestes besprochenam in der Zukunft,
 * oder eine Filmkritik ohne Datum (besprochenam: null).
 */
export function getNextFilm(filmkritiken: Filmkritik[]): Filmkritik | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filme ohne Datum (geplant, aber kein Termin)
  const withoutDate = filmkritiken.filter((f) => getBesprochenAm(f) === null)

  // Zukünftige Filme (besprochenam >= heute)
  const future = filmkritiken
    .filter((f) => {
      const bDate = getBesprochenAm(f)
      if (!bDate) return false
      const d = new Date(bDate)
      d.setHours(0, 0, 0, 0)
      return d >= today
    })
    .sort((a, b) => {
      const da = new Date(getBesprochenAm(a)!).getTime()
      const db = new Date(getBesprochenAm(b)!).getTime()
      return da - db
    })

  return future[0] ?? withoutDate[0] ?? null
}

/**
 * Gibt die letzte Besprechung zurück: jüngste Filmkritik mit besprochenam in der Vergangenheit.
 */
export function getLastFilm(filmkritiken: Filmkritik[]): Filmkritik | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const past = filmkritiken
    .filter((f) => {
      const bDate = getBesprochenAm(f)
      if (!bDate) return false
      const d = new Date(bDate)
      d.setHours(0, 0, 0, 0)
      return d < today
    })
    .sort((a, b) => {
      const da = new Date(getBesprochenAm(a)!).getTime()
      const db = new Date(getBesprochenAm(b)!).getTime()
      return db - da // neueste zuerst
    })

  return past[0] ?? null
}

/**
 * Gibt alle Archiv-Filme zurück: vergangene Filme, ausgenommen nextFilm und lastFilm (Hero-Filme).
 * Sortiert: neueste zuerst.
 */
export function getArchivFilme(
  filmkritiken: Filmkritik[],
  nextFilm: Filmkritik | null,
  lastFilm: Filmkritik | null
): Filmkritik[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const excludeIds = new Set<string>()
  if (nextFilm) excludeIds.add(nextFilm.id)
  if (lastFilm) excludeIds.add(lastFilm.id)

  return filmkritiken
    .filter((f) => {
      if (excludeIds.has(f.id)) return false
      const bDate = getBesprochenAm(f)
      if (!bDate) return false
      const d = new Date(bDate)
      d.setHours(0, 0, 0, 0)
      return d < today
    })
    .sort((a, b) => {
      const da = new Date(getBesprochenAm(a)!).getTime()
      const db = new Date(getBesprochenAm(b)!).getTime()
      return db - da // neueste zuerst
    })
}

/**
 * Berechnet die Durchschnittsbewertung — Enthaltungen werden ignoriert.
 * Gibt null zurück wenn keine Bewertungen vorhanden.
 */
export function getDurchschnittsBewertung(filmkritik: Filmkritik): number | null {
  const gueltige = filmkritik.bewertungen?.filter(
    (b) => !b.enthaltung && b.wertung !== null
  ) ?? []
  if (gueltige.length === 0) return null

  const summe = gueltige.reduce((acc, b) => acc + (b.wertung ?? 0), 0)
  return Math.round((summe / gueltige.length) * 10) / 10
}

/**
 * Gibt die Poster-URL zurück, oder null wenn kein Bild vorhanden.
 */
export function getPosterUrl(filmkritik: Filmkritik, apiBaseUrl: string): string | null {
  const imageId = filmkritik.film?.image?.id ?? null
  if (!imageId) return null
  return `${apiBaseUrl}/api/images/${imageId}`
}

/**
 * Formatiert ein Date-only-String als lesbare Datumsangabe.
 * Beispiel: "2026-07-17" → "Fr, 17. Juli 2026"
 */
export function formatDatum(besprochenam: string | null): string | null {
  if (!besprochenam) return null
  try {
    // Behandle als lokales Datum ohne Timezone-Verschiebung
    const [year, month, day] = besprochenam.split('T')[0].split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return besprochenam
  }
}

// ─────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────

import type { FilmkritikenQueryOptions } from '@/features/filmkritiken/services/filmkritikenService'

export function useFilmkritiken(options?: FilmkritikenQueryOptions) {
  const filmkritiken = ref<Filmkritik[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    isLoading.value = true
    try {
      const res = await fetchFilmkritiken(options)
      filmkritiken.value = res.items
    } catch (e) {
      // Toast wird vom apiClient-Interceptor ausgelöst — kein doppelter Toast hier
      error.value = 'Fehler beim Laden der Filmkritiken.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    load()
  })

  return {
    filmkritiken,
    isLoading,
    error,
    reload: load,
  }
}
