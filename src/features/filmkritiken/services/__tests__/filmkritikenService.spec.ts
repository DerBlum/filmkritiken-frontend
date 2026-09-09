import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from '@/services/apiClient'
import { fetchFilmkritiken, fetchFilmkritikById, createFilm, filmkritikenReloadTrigger } from '../filmkritikenService'
import type { Filmkritik, CreateFilmPayload } from '@/features/filmkritiken/types/filmkritik'

vi.mock('@/services/apiClient', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
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
    vi.mocked(apiClient.get).mockResolvedValue({ data: { items: mockFilme, totalCount: 3 } })
  })

  it('fetches all filmkritiken when no options provided', async () => {
    const res = await fetchFilmkritiken()
    expect(apiClient.get).toHaveBeenCalledWith('/api/filmkritiken', { params: {} })
    expect(res.items).toHaveLength(3)
    expect(res.totalCount).toBe(3)
  })

  it('passes suche query parameter', async () => {
    await fetchFilmkritiken({ suche: 'inter' })
    expect(apiClient.get).toHaveBeenCalledWith('/api/filmkritiken', {
      params: { suche: 'inter' },
    })
  })

  it('passes jahr query parameter', async () => {
    await fetchFilmkritiken({ jahr: 2025 })
    expect(apiClient.get).toHaveBeenCalledWith('/api/filmkritiken', {
      params: { jahr: 2025 },
    })
  })

  it('passes beitragvon query parameter', async () => {
    await fetchFilmkritiken({ beitragvon: 'Julia' })
    expect(apiClient.get).toHaveBeenCalledWith('/api/filmkritiken', {
      params: { beitragvon: 'Julia' },
    })
  })

  it('passes sortierung query parameter', async () => {
    await fetchFilmkritiken({ sortierung: 'neueste' })
    expect(apiClient.get).toHaveBeenCalledWith('/api/filmkritiken', {
      params: { sortierung: 'neueste' },
    })
  })

  it('passes limit and offset query parameters', async () => {
    await fetchFilmkritiken({ limit: 10, offset: 20 })
    expect(apiClient.get).toHaveBeenCalledWith('/api/filmkritiken', {
      params: { limit: 10, offset: 20 },
    })
  })

  it('fetchFilmkritikById returns matching item or null', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockFilme[1] })
    const item = await fetchFilmkritikById('2')
    expect(apiClient.get).toHaveBeenCalledWith('/api/filmkritiken/2')
    expect(item?.film.titel).toBe('Interstellar')

    vi.mocked(apiClient.get).mockRejectedValueOnce({ response: { status: 404 } })
    const notFound = await fetchFilmkritikById('non-existent')
    expect(notFound).toBeNull()
  })

  it('createFilm sends FormData with json and image and increments reload trigger', async () => {
    const payload: CreateFilmPayload = {
      von: 'Stefan',
      besprochenam: '2026-10-31T12:00:00Z',
      bewertungoffen: false,
      film: {
        titel: 'Dune: Part Two',
        erscheinungsjahr: 2024,
        regie: 'Denis Villeneuve',
        laenge: 166,
        altersfreigabe: 12,
        originaltitel: 'Dune: Part Two',
        originalsprache: 'Englisch',
        produktionsland: 'USA',
        image: {
          source: '',
          copyright: 'IMDb',
          id: '',
        },
      },
    }
    const mockFile = new File(['fake content'], 'dune2.jpg', { type: 'image/jpeg' })
    const mockResponseFilm: Filmkritik = {
      id: 'new-id-123',
      details: {
        besprochenam: '2026-10-31T12:00:00Z',
        bewertungoffen: false,
        beitragvon: 'Stefan',
      },
      film: {
        titel: 'Dune: Part Two',
        erscheinungsjahr: 2024,
        regie: 'Denis Villeneuve',
        laenge: 166,
        image: { id: 'img-123', copyright: 'IMDb', source: '' },
      },
      bewertungen: [],
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponseFilm })
    const initialTrigger = filmkritikenReloadTrigger.value

    const result = await createFilm(payload, mockFile)

    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/filme',
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    )
    expect(result.id).toBe('new-id-123')
    expect(filmkritikenReloadTrigger.value).toBe(initialTrigger + 1)
  })
})
