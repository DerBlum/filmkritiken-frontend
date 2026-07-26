import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from '@/services/apiClient'
import { fetchFilmkritiken, fetchFilmkritikById } from '../filmkritikenService'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'

vi.mock('@/services/apiClient', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

const mockFilme: Filmkritik[] = [
  {
    id: '1',
    details: { besprochenam: '2026-01-10', bewertungoffen: false, beitragvon: 'Thomas' },
    film: { titel: 'Inception', erscheinungsjahr: 2010, regie: 'Nolan', laenge: 148 },
    bewertungen: [
      { von: 'Thomas', wertung: 9, enthaltung: false },
      { von: 'Julia', wertung: 8, enthaltung: false },
    ],
  },
  {
    id: '2',
    details: { besprochenam: '2026-05-20', bewertungoffen: false, beitragvon: 'Julia' },
    film: { titel: 'Interstellar', erscheinungsjahr: 2014, regie: 'Nolan', laenge: 169 },
    bewertungen: [
      { von: 'Thomas', wertung: 10, enthaltung: false },
      { von: 'Julia', wertung: 10, enthaltung: false },
    ],
  },
  {
    id: '3',
    details: { besprochenam: '2025-12-01', bewertungoffen: false, beitragvon: 'Thomas' },
    film: { titel: 'Matrix', erscheinungsjahr: 1999, regie: 'Wachowski', laenge: 136 },
    bewertungen: [
      { von: 'Thomas', wertung: 6, enthaltung: false },
    ],
  },
]

describe('filmkritikenService with FilterOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockFilme })
  })

  it('fetches all filmkritiken when no options provided', async () => {
    const res = await fetchFilmkritiken()
    expect(res).toHaveLength(3)
  })

  it('filters by title search (case insensitive)', async () => {
    const res = await fetchFilmkritiken({ suche: 'inter' })
    expect(res).toHaveLength(1)
    expect(res[0].film.titel).toBe('Interstellar')
  })

  it('filters by appearance year', async () => {
    const res = await fetchFilmkritiken({ jahr: 1999 })
    expect(res).toHaveLength(1)
    expect(res[0].film.titel).toBe('Matrix')
  })

  it('filters by beitragvon', async () => {
    const res = await fetchFilmkritiken({ beitragvon: 'Julia' })
    expect(res).toHaveLength(1)
    expect(res[0].film.titel).toBe('Interstellar')
  })

  it('sorts by neueste', async () => {
    const res = await fetchFilmkritiken({ sortierung: 'neueste' })
    expect(res.map((f) => f.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by aelteste', async () => {
    const res = await fetchFilmkritiken({ sortierung: 'aelteste' })
    expect(res.map((f) => f.id)).toEqual(['3', '1', '2'])
  })

  it('sorts by beste (highest average score)', async () => {
    const res = await fetchFilmkritiken({ sortierung: 'beste' })
    expect(res.map((f) => f.film.titel)).toEqual(['Interstellar', 'Inception', 'Matrix'])
  })

  it('fetchFilmkritikById returns matching item or null', async () => {
    const item = await fetchFilmkritikById('2')
    expect(item?.film.titel).toBe('Interstellar')

    const notFound = await fetchFilmkritikById('non-existent')
    expect(notFound).toBeNull()
  })
})
