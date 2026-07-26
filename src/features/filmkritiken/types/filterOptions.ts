/**
 * Filter- und Sortieroptionen für Filmkritiken.
 */
export interface FilterOptions {
  /** Freitext-Suche im Film-Titel */
  suche?: string
  /** Erscheinungsjahr des Films */
  jahr?: number | null
  /** Name des Mitglieds, das den Beitrag eingereicht hat */
  beitragvon?: string
  /** Sortierreihenfolge */
  sortierung?: 'neueste' | 'aelteste' | 'beste'
}
