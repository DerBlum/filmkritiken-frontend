/**
 * TypeScript DTOs für die Filmkritiken-API.
 * Entspricht der Backend OpenAPI-Spec.
 * Alle nullbaren Felder sind explizit als nullable modelliert.
 */

export interface FilmImage {
  /** Bild-ID für die URL /api/images/:id. Null wenn kein Bild vorhanden. */
  id: string | null
  source?: string | null
  copyright?: string | null
}

export interface FilmkritikenDetails {
  /** Date-only-String (YYYY-MM-DD oder ISO-Date ohne Uhrzeit). Null wenn kein Datum gesetzt. */
  besprochenam: string | null
  /** True wenn Bewertungen noch offen sind (amber Badge in der UI) */
  bewertungoffen: boolean
  /** Name des Mitglieds, das den Film beigetragen hat */
  beitragvon: string | null

}

export interface Bewertung {
  /** Mitglieds-Name als String (z.B. "Thomas", "Julia") */
  von: string
  /** Numerische Bewertung 1–10. Null bei Enthaltung. */
  wertung: number | null
  /** True wenn Mitglied sich enthalten hat. Enthaltungen fließen NICHT in den Durchschnitt ein. */
  enthaltung: boolean
}

export interface Film {
  titel: string
  erscheinungsjahr: number | null
  regie: string | null
  laenge: number | null
  altersfreigabe?: number | null
  originaltitel?: string | null
  originalsprache?: string | null
  produktionsland?: string | null
  image?: FilmImage | null
}

export interface Filmkritik {
  id: string
  details: FilmkritikenDetails
  film: Film
  bewertungen: Bewertung[]
}
